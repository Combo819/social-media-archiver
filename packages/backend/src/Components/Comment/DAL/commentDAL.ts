import {
  CommentCollection,
  CommentDocument,
  IComment,
  ICommentDAL,
} from '../Types/commentTypes';
import { database } from '../../../Loaders/rxdb';
import { MangoQuery, MangoQuerySelector } from 'rxdb';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { version } from './commentSchema';

@injectable()
class CommentDAL implements ICommentDAL {
  constructor() {
    if (!database) {
      throw new Error('database is not created!');
    }
  }
  async upsert(comment: IComment) {
    const commentDoc: CommentDocument = await database.comment.atomicUpsert(
      comment,
    );
    return commentDoc;
  }

  async addSubComments(subCommentIds: string[], commentDoc: CommentDocument) {
    await commentDoc.update({
      $addToSet: { subComments: { $each: subCommentIds } },
    });
  }

  async count(selector: MangoQuerySelector): Promise<number> {
    const commentCollection: CommentCollection = database.comment;
    const totalNumber: number = (
      await commentCollection.find({ selector }).exec()
    ).length;
    return totalNumber;
  }

  remove(): never {
    throw new Error('method is not implemented');
  }

  async findOneById(commentId: string): Promise<CommentDocument | null> {
    if (!commentId) {
      //should check if commmentId is empty, otherwise it returns the first doc
      return null;
    }
    const commentCollection: CommentCollection = database.comment;
    const commentDoc: CommentDocument | null = await commentCollection
      .findOne(commentId)
      .exec();
    return commentDoc;
  }
  async query(queryObj: MangoQuery): Promise<CommentDocument[]> {
    const commentCollection: CommentCollection = database.comment;
    const commentDoc: CommentDocument[] = await commentCollection
      .find(queryObj)
      .exec();
    return commentDoc;
  }

  async bulkInsert(infos: IComment[]) {
    const commentCollection: CommentCollection = database.comment;
    return await commentCollection.bulkInsert(infos);
  }
  getVersion() {
    return version;
  }
  async exportData() {
    const commentCollection: CommentCollection = database.comment;
    return commentCollection.find().exec();
  }
}

export { CommentDAL };
