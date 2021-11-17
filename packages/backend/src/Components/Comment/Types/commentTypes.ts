import { RxCollection, RxDocument, MangoQuerySelector } from 'rxdb';
import { IBaseDAL, IBaseService } from '../../Base/baseTypes';
import { IUser } from '../../User/Types/userTypes';
import { PostDocument } from '../../Post/Types/postTypes';

type IComment = {
  id: string;
  floorNumber?: number;
  content: string; // unicode and html
  subCommentsCount?: number; // the number of sub comments shown on client
  user: string;
  upvotesCount?: number;
  createTime: number;
  subComments?: string[];
  image?: { name: string; originUrl: string };
  postId: string;
  saveTime: number;
  replyTo?: string;
};

type CommentDocument = RxDocument<IComment>;

type CommentCollection = RxCollection<IComment>;

type ICommentPopulated = Omit<Omit<IComment, 'user'>, 'replyTo'> & {
  user: IUser;
} & {
  replyTo?: IUser;
};

interface ICommentDAL extends IBaseDAL<IComment, CommentDocument> {
  addSubComments: (
    subCommentIds: string[],
    commentDoc: CommentDocument,
  ) => Promise<void>;
}

interface ICommentService
  extends IBaseService<
    IComment,
    CommentDocument,
    ICommentPopulated
  > {
  addSubComments: (
    subCommentIds: string[],
    commentId: string,
  ) => Promise<void>;
}

type CommentCrawlParams = {
  postId: string;
  /* possible other properties */
};

interface ICommentCrawler {
  startCrawling: (postId: string) => void;
}

export {
  IComment,
  CommentDocument,
  CommentCollection,
  ICommentService,
  ICommentDAL,
  CommentCrawlParams,
  ICommentPopulated,
  ICommentCrawler,
};
