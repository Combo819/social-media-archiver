import {
  PostDocument,
  IPost,
  IPostDAL,
  PostCollection,
} from '../Types/postTypes';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { database } from '../../../Loaders/rxdb';
import { MangoQuery, MangoQuerySelector } from 'rxdb';
import { DatabaseError } from '../../../Error/ErrorClass';
import { version } from './postSchema';
@injectable()
class PostDAL implements IPostDAL {
  constructor() {
    if (!database) {
      throw new DatabaseError('database is not created!');
    }
  }
  async upsert(newPost: IPost) {
    const postDoc: PostDocument = await database.post.atomicUpsert(newPost);
    return postDoc;
  }

  async findOneById(postId: string): Promise<PostDocument | null> {
    if (!postId) {
      return null;
    }
    const postDoc: PostDocument | null = await database.post
      .findOne(postId)
      .exec();
    return postDoc;
  }

  async addComments(commentIds: string[], postDoc: PostDocument) {
    await postDoc.update({
      $addToSet: {
        comments: { $each: commentIds },
      },
    });
  }

  async addRepostComments(repostCommentIds: string[], postDoc: PostDocument) {
    await postDoc.update({
      $addToSet: {
        repostComments: { $each: repostCommentIds },
      },
    });
  }

  async remove(postId: string): Promise<boolean> {
    const postDoc: PostDocument | null = await this.findOneById(postId);
    if (!postDoc) {
      return false;
    } else {
      const result: boolean = await postDoc.remove();
      return result;
    }
  }

  async query(queryObj: MangoQuery): Promise<PostDocument[]> {
    const postDocs: PostDocument[] = await database.post
      .find(queryObj)
      .exec();
    return postDocs;
  }

  async count(selector: MangoQuerySelector) {
    const postCollection: PostCollection = database.post;
    // bad performance but I have no choice
    const postDocs: PostDocument[] = await postCollection
      .find({ selector })
      .exec();
    return postDocs.length;
  }

  async bulkInsert(infos: IPost[]): Promise<{ success: any[]; error: any[] }> {
    const postCollection: PostCollection = database.post;
    const result = await postCollection.bulkInsert(infos);
    return result;
  }

  async exportData() {
    const postCollection: PostCollection = database.post;
    return postCollection.find().exec();
  }

  getVersion(): number {
    return version;
  }
}

export { PostDAL };
