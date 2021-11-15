import { RxCollection, RxDocument } from 'rxdb';
import { IBaseDAL, IBaseService } from '../../Base/baseTypes';
/**
 * Interface to model the User Schema for TypeScript.
 */
type IUser = {
  id: string; // The user's unique ID.
  username: string; // The user's username.
  profileUrl?: string; // The user's home URL.
  gender: string; // same as the platform
  followersCount: number;
  followingCount: number;
  image: { name: string; originUrl: string }; // for the user's profile image
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
