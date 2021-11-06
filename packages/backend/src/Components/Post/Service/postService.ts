import { MangoQuery, MangoQuerySelector } from 'rxdb';
import {
  PostDocument,
  IPostDAL,
  IPostService,
  IPost,
  POST_IOC_SYMBOLS,
  IPostPopulated,
  IPostCrawler,
} from '../Types';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { map, asyncify } from 'async';
import { logger } from '../../../Logger';
import { processJsonAsStream } from '../../../Utility/json';
import _ from 'lodash';
import { postMigration } from '../DAL';
import { migrate } from '../../../Utility/migrate/migrate';
import { UserDocument } from '../../User/Types';
@injectable()
class PostService implements IPostService {
  private postDAL: IPostDAL;
  private postCrawler: IPostCrawler;
  constructor(
    @inject(POST_IOC_SYMBOLS.IPostDAL) postDAL: IPostDAL,
    @inject(POST_IOC_SYMBOLS.IPostCrawler)
    postCrawler: IPostCrawler,
  ) {
    this.postDAL = postDAL;
    this.postCrawler = postCrawler;
  }

  async startCrawling(postId: string): Promise<PostDocument | null> {
    const postDoc: PostDocument | null =
      await this.postCrawler.startCrawling(postId);
    return postDoc;
  }

  async save(postInfo: IPost): Promise<PostDocument> {
    const postDoc = await this.postDAL.upsert(postInfo);
    return postDoc;
  }

  async getOneByIdPopulated(postId: string): Promise<IPostPopulated | null> {
    const postDoc = await this.postDAL.findOneById(postId);
    if (postDoc) {
      return this.populatePost(postDoc);
    } else {
      return null;
    }
  }

  async populatePost(postDoc: PostDocument): Promise<IPostPopulated> {
    const userDoc: UserDocument | undefined = await postDoc.populate('user');
    const reposting: PostDocument = await postDoc.populate('repostingId');
    let repostingUser: UserDocument | undefined;

    const populatedPostDoc: IPostPopulated = {
      ...postDoc.toJSON(),
      user: userDoc?.toJSON(),
    };

    if (reposting) {
      repostingUser = await reposting.populate('user');
      populatedPostDoc['reposting'] = {
        ...reposting.toJSON(),
        user: repostingUser?.toJSON(),
      };
    }
    return populatedPostDoc;
  }

  async addComments(commentIds: string[], postDoc: PostDocument) {
    await this.postDAL.addComments(commentIds, postDoc);
  }

  async addRepostComments(repostCommentIds: string[], postDoc: PostDocument) {
    await this.postDAL.addRepostComments(repostCommentIds, postDoc);
  }

  async deleteDoc(postId: string) {
    const result: boolean = await this.postDAL.remove(postId);
    return result;
  }

  async queryPopulated(query: MangoQuery): Promise<IPostPopulated[]> {
    const postDocs: PostDocument[] = await this.postDAL.query(query);
    const postsPopulated: IPostPopulated[] = await map(
      postDocs,
      asyncify(async (postDoc: PostDocument) => {
        return await this.populatePost(postDoc);
      }),
    );

    return postsPopulated;
  }

  async count(selector: MangoQuerySelector) {
    return await this.postDAL.count(selector);
  }

  getPostById(postId: string) {
    return this.postDAL.findOneById(postId);
  }

  async importData(
    filePath: string,
    version: number,
    batchSize: number,
  ): Promise<void> {
    const worker = async (values: { value: IPost & { _rev: string } }[]) => {
      const infos = values.map((item) => item.value);
      const migratedInfos = migrate<IPost>(infos, version, postMigration);
      const newMig: IPost[] = migratedInfos.map((info) => {
        return _.omit(info, ['_rev']);
      }) as IPost[];
      const result = await this.postDAL.bulkInsert(newMig);
      logger.info(`imported posts: ${result.success.length}`);
      if (result.error.length > 0) {
        logger.error(`importing posts error: ${result.error.length}`);
        logger.error(
          `First importing posts error in batch: ${result.error[0]}`,
        );
      }
    };

    await processJsonAsStream<IPost>(filePath, batchSize, worker);
  }

  exportData(): Promise<IPost[]> {
    return this.postDAL.exportData();
  }

  getVersion(): number {
    return this.postDAL.getVersion();
  }
}

export { PostService };
