import { RxCollection, RxDocument } from 'rxdb';
import { IUser, IUserService } from '../../User/Types/userTypes';
import { IBaseDAL, IBaseService, IBaseCrawler } from '../../Base/baseTypes';
type IPost = {
  id: string;
  createTime: number;
  content: string;
  repostsCount?: number;
  commentsCount?: number;
  upvotesCount?: number;
  user: string;
  comments?: string[];
  images?: { name: string; originUrl: string }[];
  videos?: { name: string; originUrl: string }[];
  saveTime: number;
  repostingId?: string;
  repostComments?: string[];
};

type PostDocument = RxDocument<IPost>;

type PostCollection = RxCollection<IPost, any>;

interface IPostDAL extends IBaseDAL<IPost, PostDocument> {
  addComments: (commentIds: string[], postDoc: PostDocument) => Promise<void>;
  addRepostComments: (
    repostCommentIds: string[],
    postDoc: PostDocument,
  ) => Promise<void>;
}

type IPostPopulatedWithUser = Omit<IPost, 'user'> & { user?: IUser };
type IPostPopulated = IPostPopulatedWithUser & {
  reposting?: IPostPopulatedWithUser;
};

type CrawlerPostParams = {
  postId: string;
  postService: IPostService;
  userService: IUserService;
};

type CrawlerPostTask = {
  params: CrawlerPostParams;
  func: (params: CrawlerPostParams) => Promise<PostDocument | null>;
};

interface IPostService
  extends IBaseService<IPost, PostDocument, IPostPopulated, any> {
  startCrawling(id: string): Promise<PostDocument | null>;
  getPostById(id: string): Promise<PostDocument | null>;
  populatePost(postDoc: PostDocument): Promise<IPostPopulated>;
  addComments: (commentIds: string[], postDoc: PostDocument) => Promise<void>;
  addRepostComments: (
    repostCommentIds: string[],
    postDoc: PostDocument,
  ) => Promise<void>;
  deleteDoc(id: string): Promise<boolean>;
}

interface IPostCrawler extends IBaseCrawler<any> {
  startCrawling: (postId: string) => Promise<PostDocument | null>;
}

export {
  IPost,
  PostDocument,
  PostCollection,
  IPostDAL,
  IPostService,
  IPostPopulated,
  CrawlerPostTask,
  CrawlerPostParams,
  IPostCrawler,
};
