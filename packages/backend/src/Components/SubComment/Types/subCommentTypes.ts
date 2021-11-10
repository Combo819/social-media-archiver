import { RxCollection, RxDocument } from 'rxdb';
import { CommentDocument } from '../../Comment/Types/commentTypes';
import { IUser } from '../../User/Types/userTypes';
import { IBaseDAL, IBaseService, IBaseCrawler } from '../../Base/baseTypes';

type ISubComment = {
  id: string; //id for subComment
  floorNumber?: number;
  content: string; // unicode and html
  user: string;
  upvotesCount?: number;
  createTime: number;
  commentId: string;
  saveTime: number;
  replyTo?: string;
};

type SubCommentDocument = RxDocument<ISubComment>;

type SubCommentCollection = RxCollection<ISubComment>;

interface ISubCommentDAL extends IBaseDAL<ISubComment, SubCommentDocument> {}
type ISubCommentPopulated = Omit<Omit<ISubComment, 'user'>, 'replyTo'> & {
  user?: IUser;
} & { replyTo?: IUser };

interface ISubCommentService
  extends IBaseService<
    ISubComment,
    SubCommentDocument,
    ISubCommentPopulated,
    CommentDocument
  > {}

interface ISubCommentCrawler extends IBaseCrawler<CommentDocument> {}

/**
 * the params that the func needs in async queue worker
 */
type SubCommentCrawlerParams = {
  commentDoc: CommentDocument;
  /* possible other properties */
};

export {
  ISubComment,
  SubCommentDocument,
  SubCommentCollection,
  ISubCommentDAL,
  ISubCommentService,
  SubCommentCrawlerParams,
  ISubCommentPopulated,
  ISubCommentCrawler,
};
