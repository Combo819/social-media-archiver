import { RxCollection, RxDocument } from 'rxdb';
import { IUser, IUserService } from '../../User/Types/userTypes';
import { IBaseDAL, IBaseService, IBaseCrawler } from '../../Base/baseTypes';
type IPost = {
  id: string; // id of post
  createTime: number; // create time of post
  content: string; // content of post, usually a html string or plain string
  repostsCount?: number; // count of reposts
  commentsCount?: number; // count of comments
  upvotesCount?: number; // count of upvotes
  user: string; // user id of author
  comments?: string[]; // comments id of post
  images?: { name: string; originUrl: string }[]; // images of post, name usually is the last part of originUrl as A_LONG_HASH.jpg
  videos?: { name: string; originUrl: string }[]; // videos of post, name usually is the last part of originUrl as A_LONG_HASH.mp4
  saveTime: number; // save time of post
  repostingId?: string; // id of reposting post
  repostComments?: string[]; // the repost comments id of post
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
