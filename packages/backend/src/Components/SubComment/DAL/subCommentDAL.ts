import {
  ISubComment,
  ISubCommentDAL,
  SubCommentDocument,
  SubCommentCollection,
} from '../Types/subCommentTypes';
import { database } from '../../../Loaders/rxdb';
import { MangoQuery, MangoQuerySelector } from 'rxdb';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { version } from './subCommentSchema';
@injectable()
class SubCommentDAL implements ISubCommentDAL {
  constructor() {
    if (!database) {
      throw new Error('database is not created!');
    }
  }
  async upsert(subComment: ISubComment) {
    const subCommentCollection: SubCommentCollection = database.subcomment;
    const subCommentDoc: SubCommentDocument =
      await subCommentCollection.atomicUpsert(subComment);
    return subCommentDoc;
  }

  async query(queryObj: MangoQuery): Promise<SubCommentDocument[]> {
    const subCommentCollection: SubCommentCollection = database.subcomment;
    const subCommentDocs: SubCommentDocument[] = await subCommentCollection
      .find(queryObj)
      .exec();
    return subCommentDocs;
  }

  async count(selector: MangoQuerySelector): Promise<number> {
    const subCommentCollection: SubCommentCollection = database.subcomment;
    const totalNumber: number = (
      await subCommentCollection.find({ selector }).exec()
    ).length;
    return totalNumber;
  }
  remove(): never {
    throw new Error('method is not implemented');
  }

  async findOneById(subCommentId: string): Promise<SubCommentDocument | null> {
    if (!subCommentId) {
      return null;
    }
    const subCommentCollection: SubCommentCollection = database.subcomment;
    const subCommentDoc: SubCommentDocument | null = await subCommentCollection
      .findOne(subCommentId)
      .exec();
    return subCommentDoc;
  }

  async bulkInsert(infos: ISubComment[]) {
    const subCommentCollection: SubCommentCollection = database.subcomment;
    return await subCommentCollection.bulkInsert(infos);
  }
  getVersion() {
    return version;
  }

  exportData() {
    const subCommentCollection: SubCommentCollection = database.subcomment;
    return subCommentCollection.find().exec();
  }
}

export { SubCommentDAL };
