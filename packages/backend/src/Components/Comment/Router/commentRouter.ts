import { MangoQuery } from 'rxdb';
import express, { Request, Response } from 'express';
import { container } from '../../../Config/inversify.config';
import { BadRequestError, NotFoundError } from '../../../Error/ErrorClass';
import asyncHandler from 'express-async-handler';
import {
  COMMENT_IOC_SYMBOLS,
  ICommentService,
  ICommentPopulated,
} from '../Types/';
import path from 'path';
import os from 'os';
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });
const commentRouter = express.Router();

commentRouter.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (request: Request, response: Response) => {
    const batchSize: number = parseInt(request.body.batchSize) || 100;
    const version: number = parseInt(request.body.version) || 0;
    const commentService: ICommentService = container.get<ICommentService>(
      COMMENT_IOC_SYMBOLS.ICommentService,
    );

    const file = (request as any).file;
    
    const uploadFolder = file?.destination;
    const fileName = file?.filename;
    if (!uploadFolder || !fileName) {
      throw new BadRequestError('Failed to upload file');
    }
    const filePath = path.join(uploadFolder, fileName);

    commentService.importData(filePath, version, batchSize);
    response.send('importing comments');
  }),
);

commentRouter.get(
  '/',
  asyncHandler(async (request: Request, response: Response) => {
    const postId: string = request.query.postId as string;
    const page: number = parseInt(request.query.page as string) - 1 || 0;
    const pageSize: number = parseInt(request.query.pageSize as string) || 10;
    const commentService: ICommentService = container.get<ICommentService>(
      COMMENT_IOC_SYMBOLS.ICommentService,
    );
    const query: MangoQuery = {
      skip: page * pageSize,
      limit: pageSize,
      selector: { postId },
    };
    const commentsPopulated: ICommentPopulated[] =
      await commentService.queryPopulated(query);
    const totalNumber: number = await commentService.count(query.selector);
    response.send({ comments: commentsPopulated, totalNumber });
  }),
);

commentRouter.get(
  '/export',
  asyncHandler(async (request: Request, response: Response) => {
    const commentService: ICommentService = container.get<ICommentService>(
      COMMENT_IOC_SYMBOLS.ICommentService,
    );
    const fileName: string = `comment-v${commentService.getVersion()}.json`;
    const data = JSON.stringify(await commentService.exportData());
    response.setHeader(
      'Content-disposition',
      `attachment; filename=${fileName}`,
    );
    response.setHeader('Content-type', 'application/json');
    response.write(data, function (err) {
      if (err) {
        throw err;
      }
      response.end();
    });
  }),
);

commentRouter.get(
  '/:commentId',
  asyncHandler(async (request: Request, response: Response) => {
    const { commentId } = request.params;

    const commentService: ICommentService = container.get<ICommentService>(
      COMMENT_IOC_SYMBOLS.ICommentService,
    );

    const commentPopulated: ICommentPopulated | null =
      await commentService.getOneByIdPopulated(commentId);

    if (commentPopulated) {
      response.send({ result: commentPopulated });
    } else {
      throw new NotFoundError(`comment with id ${commentId} not found`);
    }
  }),
);

export { commentRouter };
