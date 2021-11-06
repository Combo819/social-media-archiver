import { Container } from 'inversify';

import { CommentDAL } from '../Components/Comment/DAL';
import { CommentCrawler, CommentService } from '../Components/Comment/Service';
import { VideoService } from '../Components/Video/Service';
import { ImageService } from '../Components/Image/Service';
import { SubCommentService } from '../Components/SubComment/Service';
import { SubCommentDAL } from '../Components/SubComment/DAL';
import { RepostCommentService } from '../Components/RepostComment/Service';
import { RepostCommentDAL } from '../Components/RepostComment/DAL';
import { PostService } from '../Components/Post/Service';
import { PostDAL } from '../Components/Post/DAL';
import { UserDAL } from '../Components/User/DAL';
import { UserService } from '../Components/User/Service';

import {
  COMMENT_IOC_SYMBOLS,
  ICommentCrawler,
  ICommentDAL,
  ICommentService,
} from '../Components/Comment/Types';
import {
  IMAGE_IOC_SYMBOLS,
  ImageServiceInterface,
} from '../Components/Image/Types';
import {
  REPOST_COMMENT_IOC_SYMBOLS,
  IRepostCommentDAL,
  IRepostCommentService,
  IRepostCommentCrawler,
} from '../Components/RepostComment/Types';
import {
  SUB_COMMENT_IOC_SYMBOLS,
  ISubCommentDAL,
  ISubCommentService,
  ISubCommentCrawler,
} from '../Components/SubComment/Types';
import {
  USER_IOC_SYMBOLS,
  IUserService,
  IUserDAL,
} from '../Components/User/Types';
import { VIDEO_IOC_SYMBOLS, IVideoService } from '../Components/Video/Types';
import {
  POST_IOC_SYMBOLS,
  IPostDAL,
  IPostService,
  IPostCrawler,
} from '../Components/Post/Types';
import { AccountService } from '../Components/Account/Service';
import {
  IAccountService,
  ACCOUNT_IOC_SYMBOLS,
} from '../Components/Account/Types';
import { SubCommentCrawler } from '../Components/SubComment/Service/subCommentCrawler';
import { RepostCommentCrawler } from '../Components/RepostComment/Service/repostCommentCrawler';
import { PostCrawler } from '../Components/Post/Service/postCrawler';
import {
  IMonitorService,
  MONITOR_IOC_SYMBOLS,
} from '../Components/Monitor/Types';
import { MonitorService } from '../Components/Monitor/Service/monitorService';

const container = new Container();

//video
container.bind<IVideoService>(VIDEO_IOC_SYMBOLS.IVideoService).to(VideoService);

//image
container
  .bind<ImageServiceInterface>(IMAGE_IOC_SYMBOLS.ImageServiceInterface)
  .to(ImageService);

//user
container.bind<IUserDAL>(USER_IOC_SYMBOLS.IUserDAL).to(UserDAL);
container.bind<IUserService>(USER_IOC_SYMBOLS.IUserService).to(UserService);

// subComment
container
  .bind<ISubCommentDAL>(SUB_COMMENT_IOC_SYMBOLS.ISubCommentDAL)
  .to(SubCommentDAL);
container
  .bind<ISubCommentService>(SUB_COMMENT_IOC_SYMBOLS.ISubCommentService)
  .to(SubCommentService);
container
  .bind<ISubCommentCrawler>(SUB_COMMENT_IOC_SYMBOLS.ISubCommentCrawler)
  .to(SubCommentCrawler)
  .inSingletonScope();

// repostComment
container
  .bind<IRepostCommentDAL>(REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentDAL)
  .to(RepostCommentDAL);
container
  .bind<IRepostCommentService>(REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentService)
  .to(RepostCommentService);
container
  .bind<IRepostCommentCrawler>(REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentCrawler)
  .to(RepostCommentCrawler)
  .inSingletonScope();

//comment
container.bind<ICommentDAL>(COMMENT_IOC_SYMBOLS.ICommentDAL).to(CommentDAL);
container
  .bind<ICommentService>(COMMENT_IOC_SYMBOLS.ICommentService)
  .to(CommentService);
container
  .bind<ICommentCrawler>(COMMENT_IOC_SYMBOLS.ICommentCrawler)
  .to(CommentCrawler)
  .inSingletonScope();

//post
container.bind<IPostDAL>(POST_IOC_SYMBOLS.IPostDAL).to(PostDAL);
container.bind<IPostService>(POST_IOC_SYMBOLS.IPostService).to(PostService);
container
  .bind<IPostCrawler>(POST_IOC_SYMBOLS.IPostCrawler)
  .to(PostCrawler)
  .inSingletonScope();

// account
container
  .bind<IAccountService>(ACCOUNT_IOC_SYMBOLS.IAccountService)
  .to(AccountService)
  .inSingletonScope();

//monitor
container
  .bind<IMonitorService>(MONITOR_IOC_SYMBOLS.IMonitorService)
  .to(MonitorService)
  .inSingletonScope();

export { container };
