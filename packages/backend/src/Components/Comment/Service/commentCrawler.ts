import { getCommentApi } from './commentApi';
import { IPostService, PostDocument, POST_IOC_SYMBOLS } from '../../Post/Types';
import camelcaseKeys from 'camelcase-keys';
import {
  ICommentService,
  CommentCrawlParams,
  IComment,
  COMMENT_IOC_SYMBOLS,
} from '../Types';
import { asyncPriorityQueuePush } from '../../../Jobs/Queue';
import { Q_PRIORITY } from '../../../Config';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import dayjs from 'dayjs';
import { IAccountService, ACCOUNT_IOC_SYMBOLS } from '../../Account/Types';
import { IUserService, USER_IOC_SYMBOLS } from '../../User/Types';
import {
  ISubCommentService,
  SUB_COMMENT_IOC_SYMBOLS,
} from '../../SubComment/Types';
import { ImageServiceInterface, IMAGE_IOC_SYMBOLS } from '../../Image/Types';
import { container } from '../../../Config/inversify.config';
import { getUrlLastSegment } from '../../../Utility/urlParse';
import { NotImplementedError } from '../../../Error/ErrorClass';
@injectable()
class CommentCrawler {
  private postService!: IPostService;
  private commentService!: ICommentService;
  private userService: IUserService;
  private subCommentService: ISubCommentService;
  private imageService: ImageServiceInterface;
  constructor(
    @inject(ACCOUNT_IOC_SYMBOLS.IAccountService)
    accountService: IAccountService,
    @inject(USER_IOC_SYMBOLS.IUserService)
    userService: IUserService,
    @inject(SUB_COMMENT_IOC_SYMBOLS.ISubCommentService)
    subCommentService: ISubCommentService,
    @inject(IMAGE_IOC_SYMBOLS.ImageServiceInterface)
    imageService: ImageServiceInterface,
  ) {
    this.userService = userService;
    this.subCommentService = subCommentService;
    this.imageService = imageService;
  }

  lazyInject() {
    this.postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
    this.commentService = container.get<ICommentService>(
      COMMENT_IOC_SYMBOLS.ICommentService,
    );
  }

  startCrawling = (postId: string) => {
    asyncPriorityQueuePush(
      this.crawl,
      {
        postId /* other initial params here */,
      },
      Q_PRIORITY.CRAWLER_COMMENT,
    );
  };

  private crawl = async (params: CommentCrawlParams) => {
    const { postId /* deconstruct other params for the API here  */ } = params;
    const res = await getCommentApi(/* API params here */);

    const { infos, usersRaw } = this.scrapeData(res, postId);
    const nextParams = this.transformNextParams(res, params);

    // save comment to database
    infos.forEach(async (comment: IComment) => {
      if (comment.image) {
        this.imageService.downloadImage(comment.image.originUrl);
      }
      const commentDoc = await this.commentService.save(comment);

      //trigger the sub comment crawling
      //this.subCommentService.startCrawling(commentDoc.get('id'));
    });

    usersRaw.forEach((userRaw: any) => {
      this.userService.save(this.userService.transformUserResponse(userRaw));
    });

    const commentIds: string[] = infos.map(
      (commentInfo: IComment) => commentInfo.id,
    );

    this.postService.addComments(commentIds, postId);

    //if there is next request to go
    if (nextParams) {
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_COMMENT,
      );
    }
  };

  private scrapeData(
    res: any,
    postId: string,
  ): {
    infos: IComment[];
    usersRaw: unknown[];
  } {
    throw new NotImplementedError('Not implemented');
  }

  private transformNextParams(
    res: any,
    params: CommentCrawlParams,
  ): CommentCrawlParams | null {
    throw new NotImplementedError('Not implemented');
  }
}

export { CommentCrawler };
