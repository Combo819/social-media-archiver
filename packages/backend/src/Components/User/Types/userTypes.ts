import { RxCollection, RxDocument } from 'rxdb';
import { IBaseDAL, IBaseService } from '../../Base/baseTypes';
/**
 * Interface to model the User Schema for TypeScript.
 */
type IUser = {
  id: string;
  username: string;
  profileUrl?: string;
  gender: string;
  followersCount: number;
  followingCount: number;
  image: { name: string; originUrl: string }; // profile image filename,
};

interface IUserService extends IBaseService<IUser, UserDocument, any, any> {
  getUserByName: (name: string) => Promise<IUser[]>;
  fetchUser: (userId: string) => Promise<UserDocument | null>;
  getUserIdByName: (username: string) => Promise<string | ''>;
  countUserByName(name: string): Promise<number>;
  transformUserResponse(userRaw: any): IUser;
}

interface IUserDAL extends IBaseDAL<IUser, UserDocument> {}

type UserDocument = RxDocument<IUser>;
type UserCollection = RxCollection<IUser>;

export { IUser, IUserService, UserDocument, UserCollection, IUserDAL };
