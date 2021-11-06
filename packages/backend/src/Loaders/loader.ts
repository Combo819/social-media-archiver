import { MonitorService } from './../Components/Monitor/Service/monitorService';
import express from 'express';

import { expressLoader } from './express';
import { connectDB } from './rxdb';
import { startCronJob } from '../Jobs/Scheduler';
import { container } from '../Config/inversify.config';
import {
  IAccountService,
  ACCOUNT_IOC_SYMBOLS,
} from '../Components/Account/Types';

import { initFolders } from './initFolders';
import { ErrorHandler } from '../Error/ErrorHandler';
import { IPostCrawler, POST_IOC_SYMBOLS } from '../Components/Post/Types';
import {
  COMMENT_IOC_SYMBOLS,
  ICommentCrawler,
} from '../Components/Comment/Types';
import {
  ISubCommentCrawler,
  SUB_COMMENT_IOC_SYMBOLS,
} from '../Components/SubComment/Types';
import {
  IRepostCommentCrawler,
  REPOST_COMMENT_IOC_SYMBOLS,
} from '../Components/RepostComment/Types';
import { MONITOR_IOC_SYMBOLS } from '../Components/Monitor/Types';
import { MONITOR_INTERVAL } from '../Config';

async function loader() {
  //create necessary file and folders, folder for image, video, database, etc.
  initFolders();

  //connect to database
  const database = await connectDB();

  //lazy inject after the container is created https://github.com/inversify/InversifyJS/issues/865#issuecomment-945335313
  const postCrawler = container.get<IPostCrawler>(
    POST_IOC_SYMBOLS.IPostCrawler,
  );
  const commentCrawler = container.get<ICommentCrawler>(
    COMMENT_IOC_SYMBOLS.ICommentCrawler,
  );
  const subCommentCrawler = container.get<ISubCommentCrawler>(
    SUB_COMMENT_IOC_SYMBOLS.ISubCommentCrawler,
  );
  const repostCommentCrawler = container.get<IRepostCommentCrawler>(
    REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentCrawler,
  );

  [
    postCrawler,
    commentCrawler,
    subCommentCrawler,
    repostCommentCrawler,
  ].forEach((crawlerInstance: any) => {
    crawlerInstance.lazyInject();
  });

  //init the account service and start monitoring the collections, who will notify this app to crawler post
  const accountService = container.get<IAccountService>(
    ACCOUNT_IOC_SYMBOLS.IAccountService,
  );
  const MonitorService = container.get<MonitorService>(
    MONITOR_IOC_SYMBOLS.IMonitorService,
  );

  await accountService.init();
  await MonitorService.loadFromJson();

  startCronJob(MonitorService.proceed, MONITOR_INTERVAL);

  //start the express server
  const app = express();

  expressLoader(app);

  //handle the uncaughtExceptions and rejections
  const errorHandler = new ErrorHandler();

  process.on('uncaughtException', (error: Error) => {
    errorHandler.handleError(error);
  });

  process.on('unhandledRejection', (reason) => {
    errorHandler.handleError(reason as any);
  });
}

export { loader };
