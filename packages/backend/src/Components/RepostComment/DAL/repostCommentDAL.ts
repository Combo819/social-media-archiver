import {
  IRepostCommentDAL,
  IRepostComment,
  RepostCommentDocument,
  RepostCommentCollection,
} from '../Types/repostCommentTypes';
import { database } from '../../../Loaders/rxdb';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MangoQuery, MangoQuerySelector } from 'rxdb';
import { version } from './repostCommentSchema';
@injectable()
class RepostCommentDAL implements IRepostCommentDAL {
  constructor() {
    if (!database) {
      throw new Error('database is not created!');
    }
  }

  async upsert(repostComment: IRepostComment) {
    const repostCommentDoc: RepostCommentDocument =
      await database.repostcomment.atomicUpsert(repostComment);
    return repostCommentDoc;
  }

  async count(selector: MangoQuerySelector): Promise<number> {
    const repostCommentCollection: RepostCommentCollection =
      database.repostcomment;
    const totalNumber: number = (
      await repostCommentCollection.find({ selector }).exec()
    ).length;
    return totalNumber;
  }
  remove(): never {
    throw new Error('method is not implemented');
  }

  async findOneById(
    repostCommentId: string,
  ): Promise<RepostCommentDocument | null> {
    if (!repostCommentId) {
      return null;
    }
    const repostCommentCollection: RepostCommentCollection =
      database.repostcomment;
    const repostDoc: RepostCommentDocument | null =
      await repostCommentCollection.findOne(repostCommentId).exec();
    return repostDoc;
  }
  async query(queryObj: MangoQuery): Promise<RepostCommentDocument[]> {
    const repostCommentCollection: RepostCommentCollection =
      database.repostcomment;
    const repostDocs: RepostCommentDocument[] = await repostCommentCollection
      .find(queryObj)
      .exec();
    return repostDocs;
  }
  async bulkInsert(infos: IRepostComment[]) {
    const repostCommentCollection: RepostCommentCollection =
      database.repostcomment;
    return await repostCommentCollection.bulkInsert(infos);
  }

  getVersion() {
    return version;
  }

  async exportData() {
    const repostCommentCollection: RepostCommentCollection =
      database.repostcomment;
    return repostCommentCollection.find().exec();
  }
}

export { RepostCommentDAL };
