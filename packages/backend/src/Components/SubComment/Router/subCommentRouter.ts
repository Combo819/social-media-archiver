import { MangoQuery } from 'rxdb';
import express, { Request, Response } from 'express';
import { container } from '../../../Config/inversify.config';
import asyncHandler from 'express-async-handler';
import {
  ISubCommentService,
  SUB_COMMENT_IOC_SYMBOLS,
  ISubCommentPopulated,
} from '../Types';
import { BadRequestError } from '../../../Error/ErrorClass';
import path from 'path';
import os from 'os';
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });
const subCommentRouter = express.Router();

subCommentRouter.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (request: Request, response: Response) => {
    const batchSize: number = parseInt(request.body.batchSize) || 100;
    const version: number = parseInt(request.body.version) || 0;
    const subCommentService = container.get<ISubCommentService>(
      SUB_COMMENT_IOC_SYMBOLS.ISubCommentService,
    );
    const file = (request as any).file;

    const uploadFolder = file?.destination;
    const fileName = file?.filename;
    if (!uploadFolder || !fileName) {
      throw new BadRequestError('Failed to upload file');
    }
    const filePath = path.join(uploadFolder, fileName);
    subCommentService.importData(filePath, version, batchSize);
    response.send('importing subComments');
  }),
);

subCommentRouter.get(
  '/',
  asyncHandler(async (request: Request, response: Response) => {
    const commentId: string = request.query.commentId as string;
    const page: number = parseInt(request.query.page as string) - 1 || 0;
    const pageSize: number = parseInt(request.query.pageSize as string) || 10;
    const subCommentService = container.get<ISubCommentService>(
      SUB_COMMENT_IOC_SYMBOLS.ISubCommentService,
    );

    const query: MangoQuery = {
      skip: page * pageSize,
      limit: pageSize,
      selector: { commentId },
    };

    const subCommentsPopulated: ISubCommentPopulated[] =
      await subCommentService.queryPopulated(query);

    const totalNumber: number = await subCommentService.count(query.selector);

    response.send({
      subComments: subCommentsPopulated,
      totalNumber,
    });
  }),
);

subCommentRouter.get(
  '/export',
  asyncHandler(async (request: Request, response: Response) => {
    const subCommentService = container.get<ISubCommentService>(
      SUB_COMMENT_IOC_SYMBOLS.ISubCommentService,
    );
    const fileName: string = `subComment-v${subCommentService.getVersion()}.json`;
    const data = JSON.stringify(await subCommentService.exportData());
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

export { subCommentRouter };
