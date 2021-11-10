import { MangoQuery, MangoQuerySelector } from 'rxdb';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { PostDocument } from '../../Post/Types';
import {
  ICommentService,
  IComment,
  ICommentDAL,
  CommentDocument,
  COMMENT_IOC_SYMBOLS,
  ICommentPopulated,
  ICommentCrawler,
} from '../Types';
import { ImageServiceInterface, IMAGE_IOC_SYMBOLS } from '../../Image/Types';
import { UserDocument } from '../../User/Types';
import { staticPath } from '../../../Config';
import {
  ISubCommentService,
  SUB_COMMENT_IOC_SYMBOLS,
} from '../../SubComment/Types';
import { map, asyncify } from 'async';
import { logger } from '../../../Logger';
import { processJsonAsStream } from '../../../Utility/json';
import { commentMigration } from '../DAL';
import _ from 'lodash';
import { migrate } from '../../../Utility/migrate/migrate';

@injectable()
class CommentService implements ICommentService {
  private commentDAL: ICommentDAL;
  private commentCrawler: ICommentCrawler;
  private imageService: ImageServiceInterface;
  private subCommentService: ISubCommentService;
  constructor(
    @inject(COMMENT_IOC_SYMBOLS.ICommentDAL) commentDAL: ICommentDAL,
    @inject(COMMENT_IOC_SYMBOLS.ICommentCrawler)
    commentCrawler: ICommentCrawler,
    @inject(IMAGE_IOC_SYMBOLS.ImageServiceInterface)
    imageService: ImageServiceInterface,
    @inject(SUB_COMMENT_IOC_SYMBOLS.ISubCommentService)
    subCommentService: ISubCommentService,
  ) {
    this.commentDAL = commentDAL;
    this.commentCrawler = commentCrawler;
    this.imageService = imageService;
    this.subCommentService = subCommentService;
  }

  /**
   * starter function that pushes the first comment requesting to the worker of queue
   * @param postId
   */
  startCrawling(postDoc: PostDocument) {
    this.commentCrawler.startCrawling(postDoc);
  }

  //need second param "callback"?
  save = async (newComment: IComment) => {
    const commentDoc: CommentDocument = await this.commentDAL.upsert(
      newComment,
    );

    return commentDoc;
  };

  async addSubComments(subCommentIds: string[], commentDoc: CommentDocument) {
    await this.commentDAL.addSubComments(subCommentIds, commentDoc);
  }

  private async populate(
    commentDoc: CommentDocument,
  ): Promise<ICommentPopulated> {
    const userDoc: UserDocument = await commentDoc.populate('user');
    const replyTo: UserDocument = await commentDoc.populate('replyTo');
    return {
      ...commentDoc.toJSON(),
      user: userDoc?.toJSON(),
      replyTo: replyTo?.toJSON(),
    };
  }

  async getOneByIdPopulated(
    commentId: string,
  ): Promise<ICommentPopulated | null> {
    const commentDoc = await this.commentDAL.findOneById(commentId);
    if (commentDoc) {
      return this.populate(commentDoc);
    }
    return null;
  }

  async queryPopulated(query: MangoQuery): Promise<ICommentPopulated[]> {
    const commentDocs: CommentDocument[] = await this.commentDAL.query(query);
    return await map(commentDocs, asyncify(this.populate));
  }

  async count(selector: MangoQuerySelector): Promise<number> {
    return await this.commentDAL.count(selector);
  }

  async importData(
    filePath: string,
    version: number,
    batchSize: number,
  ): Promise<void> {
    const worker = async (values: { value: IComment & { _rev: string } }[]) => {
      const infos = values.map((item) => item.value);
      const migratedInfos = migrate<IComment>(infos, version, commentMigration);
      const newMig: IComment[] = migratedInfos.map((info) => {
        return _.omit(info, ['_rev']);
      }) as IComment[];
      const result = await this.commentDAL.bulkInsert(newMig);
      logger.info(`imported comments: ${result.success.length}`);
      if (result.error.length > 0) {
        logger.error(`importing comments error: ${result.error.length}`);
        logger.error(
          `First importing comments error in batch: ${result.error[0]}`,
        );
      }
    };

    await processJsonAsStream<IComment>(filePath, batchSize, worker);
  }

  exportData() {
    return this.commentDAL.exportData();
  }

  getVersion() {
    return this.commentDAL.getVersion();
  }
}

export { CommentService };
