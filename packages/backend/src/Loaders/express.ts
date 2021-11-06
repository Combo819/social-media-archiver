import express, { NextFunction, Request, Response } from 'express';
import { staticPath, PORT } from '../Config';
import path from 'path';
import getPort from 'get-port';
import { ErrorHandler } from '../Error/ErrorHandler';
import { logger } from '../Logger';
import { monitorRouter } from '../Components/Monitor/Router/monitorRouter';
import { userRouter } from '../Components/User/Router';
import { commentRouter } from '../Components/Comment/Router';
import { repostCommentRouter } from '../Components/RepostComment/Router';
import { subCommentRouter } from '../Components/SubComment/Router';
import { postRouter } from '../Components/Post/Router';
import { accountRouter } from '../Components/Account/Router';
const open = require('open');

const expressLoader = (app: express.Application) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/api/user', userRouter);
  app.use('/api/comment', commentRouter);
  app.use('/api/repostComment', repostCommentRouter);
  app.use('/api/subComment', subCommentRouter);
  app.use('/api/post', postRouter);
  app.use('/api/account', accountRouter);
  app.use('/api/monitor', monitorRouter);

  app.use(express.static(staticPath));

  app.use(
    express.static(path.resolve(__dirname, '../../../', 'frontend', 'build')),
  );

  // Error handling middleware, we delegate the handling to the centralized error handler
  app.use(
    async (err: Error, req: Request, res: Response, next: NextFunction) => {
      const errorHandler = new ErrorHandler();
      await errorHandler.handleError(err, res);
    },
  );

  app.use('*', (request: Request, response: Response) => {
    response.sendFile(
      path.resolve(__dirname, '../../../', 'frontend', 'build', 'index.html'),
    );
  });

  getPort({ port: [PORT, PORT + 1, PORT + 2] }).then((res: number) => {
    const availblePort: number = res;
    app.listen(availblePort || 5000, () => {
      const listeningInfo: string = `listening on port ${
        availblePort || 5000
      } \n`;
      logger.info(listeningInfo);
      try {
        if (process.env.NODE_ENV !== 'development') {
          open(`http://localhost:${availblePort}`);
          console.log(`Opening http://localhost:${availblePort}`);
        } else {
          console.log(`Development mode, Listening on port ${availblePort}`);
        }
      } catch (err) {
        console.log(
          `please open http://localhost:${availblePort} in your browser`,
        );
      }
    });
  });
};

export { expressLoader };
