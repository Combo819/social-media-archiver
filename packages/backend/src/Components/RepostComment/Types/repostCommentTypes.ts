import { RxCollection, RxDocument } from 'rxdb';
import { PostDocument } from '../../Post/Types/postTypes';
import { IBaseCrawler, IBaseDAL, IBaseService } from '../../Base/baseTypes';
import { IUser } from '../../User/Types/userTypes';

type IRepostComment = {
  id: string;
  content: string; // unicode and html
  user: string;
  createTime: number;
  repostedId: string;
  saveTime: number;
};

type RepostCommentDocument = RxDocument<IRepostComment>;

type RepostCommentCollection = RxCollection<IRepostComment>;

type IRepostCommentPopulated = Omit<IRepostComment, 'user'> & { user: IUser };

interface IRepostCommentDAL
  extends IBaseDAL<IRepostComment, RepostCommentDocument> {}

interface IRepostCommentService
  extends IBaseService<
    IRepostComment,
    RepostCommentDocument,
    IRepostCommentPopulated
  > {}

interface IRepostCommentCrawler extends IBaseCrawler {}

type RepostCommentCrawlerParams = {
  postId: string;
  /* possible other properties */
};

export {
  IRepostComment,
  RepostCommentDocument,
  RepostCommentCollection,
  IRepostCommentService,
  IRepostCommentDAL,
  RepostCommentCrawlerParams,
  IRepostCommentPopulated,
  IRepostCommentCrawler,
};
