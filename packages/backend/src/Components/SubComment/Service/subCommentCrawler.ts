import { getSubCommentApi } from './subCommentApi';
import camelcaseKeys from 'camelcase-keys';
import {
  CommentDocument,
  COMMENT_IOC_SYMBOLS,
  ICommentService,
} from '../../Comment/Types';
import { map, asyncify } from 'async';
import {
  SubCommentCrawlerParams,
  ISubCommentService,
  ISubCommentCrawler,
  ISubComment,
  SUB_COMMENT_IOC_SYMBOLS,
} from '../Types';
import { asyncPriorityQueuePush } from '../../../Jobs/Queue';
import { Q_PRIORITY } from '../../../Config';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import dayjs from 'dayjs';
import { IUserService, USER_IOC_SYMBOLS } from '../../User/Types';
import { container } from '../../../Config/inversify.config';
import { NotImplementedError } from '../../../Error/ErrorClass';
@injectable()
class SubCommentCrawler implements ISubCommentCrawler {
  private commentService!: ICommentService;
  private subCommentService!: ISubCommentService;
  private userService: IUserService;
  constructor(
    @inject(USER_IOC_SYMBOLS.IUserService)
    userService: IUserService,
  ) {
    this.userService = userService;
  }

  lazyInject() {
    this.commentService = container.get<ICommentService>(
      COMMENT_IOC_SYMBOLS.ICommentService,
    );
    this.subCommentService = container.get<ISubCommentService>(
      SUB_COMMENT_IOC_SYMBOLS.ISubCommentService,
    );
  }

  startCrawling = (commentId: string) => {
    asyncPriorityQueuePush(
      this.crawl,
      { commentId /* other initial params here */ },
      Q_PRIORITY.CRAWLER_SUB_COMMENT,
    );
  };

  private crawl = async (params: SubCommentCrawlerParams) => {
    const { commentId /* deconstruct other params for the API here  */ } =
      params;
    const res = await getSubCommentApi(/* API params here */);

    const { infos, usersRaw } = this.scrapeInfoUser(res, commentId);
    const nextParams = this.transformNextParams(res, params);
    await map(infos, asyncify(this.subCommentService.save));
    await map(
      usersRaw.map((userRaw) =>
        this.userService.transformUserResponse(userRaw),
      ),
      asyncify(this.userService.save),
    );

    const newSubComments: string[] = infos.map(
      (subCommentInfo: ISubComment) => subCommentInfo.id,
    );

    this.commentService.addSubComments(newSubComments, commentId);

    if (nextParams) {
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_SUB_COMMENT,
      );
    }
  };

  private scrapeInfoUser(
    res: any,
    commentId: string,
  ): {
    infos: ISubComment[];
    usersRaw: unknown[];
  } {
    throw new NotImplementedError('Not implemented');
  }

  private transformNextParams(
    res: any,
    prevParams: SubCommentCrawlerParams,
  ): SubCommentCrawlerParams | null {
    throw new NotImplementedError('Not implemented');
  }
}

export { SubCommentCrawler };
