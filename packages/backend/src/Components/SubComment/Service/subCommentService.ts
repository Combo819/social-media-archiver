import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { MangoQuery, MangoQuerySelector } from 'rxdb';
import {
  ISubCommentDAL,
  ISubCommentService,
  ISubComment,
  SubCommentDocument,
  SUB_COMMENT_IOC_SYMBOLS,
  ISubCommentPopulated,
  ISubCommentCrawler,
} from '../Types';
import { UserDocument } from '../../User/Types';
import { CommentDocument } from '../../Comment/Types';
import { map, asyncify } from 'async';
import { logger } from '../../../Logger';
import { processJsonAsStream } from '../../../Utility/json';
import _ from 'lodash';
import { subCommentMigration } from '../DAL';
import { migrate } from '../../../Utility/migrate/migrate';
import { NotImplementedError } from '../../../Error/ErrorClass';

@injectable()
class SubCommentService implements ISubCommentService {
  private subCommentDAL: ISubCommentDAL;
  private subCommentCrawler: ISubCommentCrawler;

  constructor(
    @inject(SUB_COMMENT_IOC_SYMBOLS.ISubCommentDAL)
    subCommentDAL: ISubCommentDAL,
    @inject(SUB_COMMENT_IOC_SYMBOLS.ISubCommentCrawler)
    subCommentCrawler: ISubCommentCrawler,
  ) {
    this.subCommentDAL = subCommentDAL;
    this.subCommentCrawler = subCommentCrawler;
  }

  save = async (subComment: ISubComment) => {
    const subCommentDoc: SubCommentDocument = await this.subCommentDAL.upsert(
      subComment,
    );

    return subCommentDoc;
  };

  startCrawling(commentDoc: CommentDocument) {
    this.subCommentCrawler.startCrawling(commentDoc);
  }

  private async populate(
    subCommentDoc: SubCommentDocument,
  ): Promise<ISubCommentPopulated> {
    const userDoc: UserDocument | undefined = await subCommentDoc.populate(
      'user',
    );
    const replyTo: UserDocument | null = await subCommentDoc.populate(
      'replyTo',
    );
    return {
      ...subCommentDoc.toJSON(),
      user: userDoc?.toJSON(),
      replyTo: replyTo?.toJSON(),
    };
  }

  async queryPopulated(query: MangoQuery) {
    const subCommentDocs: SubCommentDocument[] = await this.subCommentDAL.query(
      query,
    );

    const subCommentsPopulated = await map<
      SubCommentDocument,
      ISubCommentPopulated
    >(subCommentDocs, asyncify(this.populate));

    return subCommentsPopulated;
  }

  async count(selector: MangoQuerySelector): Promise<number> {
    const totalNumber: number = await this.subCommentDAL.count(selector);
    return totalNumber;
  }

  async importData(
    filePath: string,
    version: number,
    batchSize: number,
  ): Promise<void> {
    const worker = async (
      values: { value: ISubComment & { _rev: string } }[],
    ) => {
      const infos = values.map((item) => item.value);
      const migratedInfos = migrate<ISubComment>(
        infos,
        version,
        subCommentMigration,
      );
      const newMig: ISubComment[] = migratedInfos.map((info) => {
        return _.omit(info, ['_rev']);
      }) as ISubComment[];
      const result = await this.subCommentDAL.bulkInsert(newMig);

      logger.info(`imported subComments: ${result.success.length}`);
      if (result.error.length > 0) {
        logger.error(`importing subComments error: ${result.error.length}`);
        logger.error(
          `First importing subComment error in batch: ${result.error[0]}`,
        );
      }
    };

    await processJsonAsStream<ISubComment>(filePath, batchSize, worker);
  }

  getOneByIdPopulated(id: string): never {
    throw new NotImplementedError(
      'getOneByIdPopulated in SubCommentService is not implemented',
    );
  }

  exportData() {
    return this.subCommentDAL.exportData();
  }

  getVersion() {
    return this.subCommentDAL.getVersion();
  }
}

export { SubCommentService };
