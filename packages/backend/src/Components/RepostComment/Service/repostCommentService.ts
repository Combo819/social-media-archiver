import { MangoQuery, MangoQuerySelector } from 'rxdb';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import {
  IRepostCommentService,
  IRepostComment,
  IRepostCommentDAL,
  RepostCommentDocument,
  REPOST_COMMENT_IOC_SYMBOLS,
  IRepostCommentPopulated,
  IRepostCommentCrawler,
} from '../Types';
import { UserDocument } from '../../User/Types';
import { PostDocument } from '../../Post/Types/postTypes';
import { map, asyncify } from 'async';
import { logger } from '../../../Logger';
import { processJsonAsStream } from '../../../Utility/json';
import { repostCommentMigration } from '../DAL';
import _ from 'lodash';
import { migrate } from '../../../Utility/migrate/migrate';
import { NotImplementedError } from '../../../Error/ErrorClass';
@injectable()
class RepostCommentService implements IRepostCommentService {
  private repostCommentDAL: IRepostCommentDAL;
  private repostCommentCrawler: IRepostCommentCrawler;

  constructor(
    @inject(REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentDAL)
    repostCommentDAL: IRepostCommentDAL,
    @inject(REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentCrawler)
    repostCommentCrawler: IRepostCommentCrawler,
  ) {
    this.repostCommentDAL = repostCommentDAL;
    this.repostCommentCrawler = repostCommentCrawler;
  }

  save = async (repostComment: IRepostComment) => {
    const repostCommentDoc: RepostCommentDocument =
      await this.repostCommentDAL.upsert(repostComment);

    return repostCommentDoc;
  };

  startCrawling(postId: string) {
    this.repostCommentCrawler.startCrawling(postId);
  }

  private async populate(
    repostCommentDoc: RepostCommentDocument,
  ): Promise<IRepostCommentPopulated> {
    const userDoc: UserDocument = await repostCommentDoc.populate('user');
    return { ...repostCommentDoc.toJSON(), user: userDoc.toJSON() };
  }

  async queryPopulated(query: MangoQuery): Promise<IRepostCommentPopulated[]> {
    const repostComments: RepostCommentDocument[] =
      await this.repostCommentDAL.query(query);
    const repostCommentsPopulated: IRepostCommentPopulated[] = await map(
      repostComments,
      asyncify(this.populate),
    );
    return repostCommentsPopulated;
  }

  async count(selector: MangoQuerySelector): Promise<number> {
    return await this.repostCommentDAL.count(selector);
  }

  async importData(
    filePath: string,
    version: number,
    batchSize: number,
  ): Promise<void> {
    const worker = async (values: { value: IRepostComment }[]) => {
      const infos = values.map((item) => item.value);
      const migratedInfos = migrate<IRepostComment>(
        infos,
        version,
        repostCommentMigration,
      );
      const newMig: IRepostComment[] = migratedInfos.map((info) => {
        return _.omit(info, ['_rev']);
      }) as IRepostComment[];
      const result = await this.repostCommentDAL.bulkInsert(newMig);
      logger.info(`imported repostComments: ${result.success.length}`);
      if (result.error.length > 0) {
        logger.error(`importing repostComments error: ${result.error.length}`);
        logger.error(
          `First importing repostComments error in batch: ${result.error[0]}`,
        );
      }
    };

    await processJsonAsStream<IRepostComment>(filePath, batchSize, worker);
  }

  getOneByIdPopulated(id: string): never {
    throw new NotImplementedError(
      `getOneByIdPopulated in repostCommentService is not implemented`,
    );
  }

  exportData() {
    return this.repostCommentDAL.exportData();
  }

  getVersion() {
    return this.repostCommentDAL.getVersion();
  }
}

export { RepostCommentService };
