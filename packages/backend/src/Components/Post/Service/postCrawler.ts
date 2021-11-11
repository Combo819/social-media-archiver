import {
  IPost,
  IPostService,
  PostDocument,
  POST_IOC_SYMBOLS,
  IPostCrawler,
} from '../Types';
import { getPostApi } from './postApi';
import cheerio from 'cheerio';
import camelcaseKeys from 'camelcase-keys';
import { IUserService, USER_IOC_SYMBOLS } from '../../User/Types';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../../Logger';
import { asyncPriorityQueuePush } from '../../../Jobs/Queue';
import { Q_PRIORITY } from '../../../Config';
import { NotFoundError } from '../../../Error/ErrorClass';
import dayjs from 'dayjs';
import { ImageServiceInterface, IMAGE_IOC_SYMBOLS } from '../../Image/Types';
import { IVideoService, VIDEO_IOC_SYMBOLS } from '../../Video/Types';
import { COMMENT_IOC_SYMBOLS, ICommentService } from '../../Comment/Types';
import {
  IRepostCommentService,
  REPOST_COMMENT_IOC_SYMBOLS,
} from '../../RepostComment/Types';
import { container } from '../../../Config/inversify.config';
import { getUrlLastSegment } from '../../../Utility/urlParse/getLastSegment';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';

@injectable()
class PostCrawler implements IPostCrawler {
  private postService!: IPostService;
  private userService: IUserService;
  private imageService: ImageServiceInterface;
  private videoService: IVideoService;
  private commentService: ICommentService;
  private repostCommentService: IRepostCommentService;
  constructor(
    @inject(USER_IOC_SYMBOLS.IUserService)
    userService: IUserService,
    @inject(IMAGE_IOC_SYMBOLS.ImageServiceInterface)
    imageService: ImageServiceInterface,
    @inject(VIDEO_IOC_SYMBOLS.IVideoService)
    videoService: IVideoService,
    @inject(COMMENT_IOC_SYMBOLS.ICommentService)
    commentService: ICommentService,
    @inject(REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentService)
    repostCommentService: IRepostCommentService,
  ) {
    this.userService = userService;
    this.imageService = imageService;
    this.videoService = videoService;
    this.commentService = commentService;
    this.repostCommentService = repostCommentService;
  }

  lazyInject() {
    this.postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
  }

  startCrawling = async (postId: string): Promise<PostDocument | null> => {
    let postDoc: PostDocument | null;
    postDoc = await this.postService.getPostById(postId);
    if (postDoc) {
      logger.info(`${postId} already exist`);
      return postDoc;
    }
    logger.info(`start crawling post ${postId}`);

    postDoc = await asyncPriorityQueuePush<string, PostDocument | null>(
      this.crawl,
      postId,
      Q_PRIORITY.CRAWLER_POST,
    );

    if (!postDoc) {
      throw new NotFoundError(`post with post id ${postId} doesn't exist`);
    }

    logger.info(`post ${postId} is crawled`);

    return postDoc;
  };

  private crawl = async (postId: string): Promise<PostDocument | null> => {
    let postDoc: PostDocument | null = null;
    try {
      const res = await getPostApi(postId);
      const { postInfo, userRaw, repostingId, embedImages } =
        this.transformData(res);

      postDoc = await this.postService.save(postInfo);
      const userInfo = this.userService.transformUserResponse(userRaw);
      this.userService.save(userInfo);

      // save the embed images
      embedImages.forEach(async (imageUrl) => {
        await this.imageService.downloadImage(
          imageUrl,
          Q_PRIORITY.DOWNLOAD_POST_IMAGE,
        );
      });

      const images = postDoc.get('images');
      if (images && images.length > 0) {
        images.forEach((pic: { name: string; originUrl: string }) => {
          this.imageService.downloadImage(
            pic.originUrl,
            Q_PRIORITY.DOWNLOAD_POST_IMAGE,
          );
        });
      }

      const videos = postDoc.get('videos');
      if (videos?.length > 0) {
        videos.forEach((video: { name: string; originUrl: string }) => {
          this.videoService.downloadVideo(video.originUrl);
        });
      }

      this.commentService.startCrawling(postDoc);
      this.repostCommentService.startCrawling(postDoc);

      if (repostingId) {
        this.startCrawling(repostingId);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      return postDoc;
    }
  };

  /**
   * take in the response from the API and transform it into the nextParams for the next request, and the infos of the comments,and the users
   * @param res the axios api response object
   * @param prevParams previous params
   * @returns {nextParams, infos, usersRaw ,embedImages}
   */
  private transformData(res: any): {
    repostingId: string;
    postInfo: IPost;
    userRaw: unknown;
    embedImages: string[];
  } {
    /* extract the information here. If it's a html document, 
    try to manipulate the html with cheerio */
    throw new Error('Not implemented');
  }
}

export { PostCrawler };
