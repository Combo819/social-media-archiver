import {
  IUserDAL,
  UserDocument,
  IUser,
  UserCollection,
} from '../Types/userTypes';
import { database } from '../../../Loaders/rxdb';
import { MangoQuery } from 'rxdb';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { NotImplementedError } from '../../../Error/ErrorClass';
import { DatabaseError } from '../../../Error/ErrorClass';
import { version } from './userSchema';
@injectable()
class UserDAL implements IUserDAL {
  constructor() {
    if (!database) {
      throw new DatabaseError('Database is not connect');
    }
  }
  async upsert(userInfo: IUser) {
    const userDoc: UserDocument = await database.user.atomicUpsert(userInfo);
    return userDoc;
  }

  async findOneById(userId: string): Promise<UserDocument | null> {
    if (!userId) {
      return null;
    }
    const userCollection: UserCollection = database.user;
    const userDoc: UserDocument | null = await userCollection
      .findOne(userId)
      .exec();
    return userDoc;
  }

  async query(queryObj: MangoQuery): Promise<UserDocument[]> {
    const userDocs: UserDocument[] = await database.user.find(queryObj).exec();
    return userDocs;
  }
  count(): never {
    throw new NotImplementedError('method is not implemented');
  }
  remove(): never {
    throw new NotImplementedError('method is not implemented');
  }

  async bulkInsert(infos: IUser[]) {
    const userCollection: UserCollection = database.user;
    return await userCollection.bulkInsert(infos);
  }

  getVersion() {
    return version;
  }

  exportData() {
    const userCollection: UserCollection = database.user;
    return userCollection.find().exec();
  }
}

export { UserDAL };
