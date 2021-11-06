import { MangoQuery } from 'rxdb';
import express, { Request, Response } from 'express';
import { container } from '../../../Config/inversify.config';
import { REPOST_COMMENT_IOC_SYMBOLS, IRepostCommentService } from '../Types';
import asyncHandler from 'express-async-handler';
import os from 'os';
import { BadRequestError } from '../../../Error/ErrorClass';
import path from 'path';
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });
const repostCommentRouter = express.Router();

repostCommentRouter.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (request: Request, response: Response) => {
    const batchSize: number = parseInt(request.body.batchSize) || 100;
    const version: number = parseInt(request.body.version) || 0;

    const repostCommentService: IRepostCommentService =
      container.get<IRepostCommentService>(
        REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentService,
      );
    const file = (request as any).file;

    const uploadFolder = file?.destination;
    const fileName = file?.filename;
    if (!uploadFolder || !fileName) {
      throw new BadRequestError('Failed to upload file');
    }
    const filePath = path.join(uploadFolder, fileName);
    repostCommentService.importData(filePath, version, batchSize);

    response.send('importing repostComments');
  }),
);

repostCommentRouter.get(
  '/',
  asyncHandler(async (request: Request, response: Response) => {
    const repostedId: string = request.query.repostedId as string;
    const page: number = parseInt(request.query.page as string) - 1 || 0;
    const pageSize: number = parseInt(request.query.pageSize as string) || 10;
    const repostCommentService: IRepostCommentService =
      container.get<IRepostCommentService>(
        REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentService,
      );
    const query: MangoQuery = {
      skip: page * pageSize,
      limit: pageSize,
      selector: { repostedId },
    };
    const repostCommentsPopulated = await repostCommentService.queryPopulated(
      query,
    );
    const totalNumber = await repostCommentService.count(query.selector);
    response.send({ repostComments: repostCommentsPopulated, totalNumber });
  }),
);

repostCommentRouter.get(
  '/export',
  asyncHandler(async (request: Request, response: Response) => {
    const repostCommentService: IRepostCommentService =
      container.get<IRepostCommentService>(
        REPOST_COMMENT_IOC_SYMBOLS.IRepostCommentService,
      );
    const fileName: string = `repostComment-v${repostCommentService.getVersion()}.json`;
    const data = JSON.stringify(await repostCommentService.exportData());
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

export { repostCommentRouter };
