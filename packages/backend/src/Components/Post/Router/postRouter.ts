import express, { Request, Response } from 'express';
import { container } from '../../../Config/inversify.config';
import { IPostService, POST_IOC_SYMBOLS, IPostPopulated } from '../Types';
import { parsePostId } from '../../../Utility/parsePostId';
import { BadRequestError, NotFoundError } from '../../../Error/ErrorClass';
import asyncHandler from 'express-async-handler';
import { MangoQuery } from 'rxdb';
import { generateQuery } from '../../../Utility/generateQuery';
import os from 'os';
import path from 'path';
const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });
const postRouter = express.Router();

postRouter.post(
  '/',
  asyncHandler(async (request: Request, response: Response) => {
    const postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
    const { postIdUrl }: { postIdUrl: string } = request.body;
    let postId: string;
    postId = await parsePostId(postIdUrl);
    postService.startCrawling(postId);
    response.sendStatus(200);
  }),
);

// https://picnature.de/how-to-upload-files-in-nodejs-using-multer-2-0/
postRouter.post(
  '/import',
  upload.single('file'),
  asyncHandler(async (request: Request, response: Response) => {
    const file = (request as any).file;

    const uploadFolder = file?.destination;
    const fileName = file?.filename;
    if (!uploadFolder || !fileName) {
      throw new BadRequestError('Failed to upload file');
    }
    const filePath = path.join(uploadFolder, fileName);

    const batchSize: number = 100;
    const version: number = parseInt(request.body.version) || 0;
    const postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
    postService.importData(filePath, version, batchSize);

    response.send('importing post');
  }),
);

postRouter.get(
  '/export',
  asyncHandler(async (request: Request, response: Response) => {
    const postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
    const fileName: string = `post-v${postService.getVersion()}.json`;
    const data = JSON.stringify(await postService.exportData());
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

postRouter.get(
  '/:postId',
  asyncHandler(async (request: Request, response: Response) => {
    const postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
    const { postId } = request.params;
    const post: IPostPopulated | null =
      await postService.getOneByIdPopulated(postId);
    if (post) {
      response.send({ post, totalNumber: 1 });
    } else {
      throw new NotFoundError(`post with id ${postId} is not found`);
    }
  }),
);

postRouter.delete(
  '/:postId',
  asyncHandler(async (request: Request, response: Response) => {
    const { postId } = request.params;
    const postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
    const hasDeleteSucceed: boolean = await postService.deleteDoc(postId);
    if (!hasDeleteSucceed) {
      throw new BadRequestError(
        `Failed to delete post with id ${postId} or the post doesn't exist`,
      );
    }
    response.send({ result: hasDeleteSucceed });
  }),
);

postRouter.get(
  '/',
  asyncHandler(async (request: Request, response: Response) => {
    const page: number = parseInt(request.query.page as string) - 1 || 0;
    const pageSize: number = parseInt(request.query.pageSize as string) || 10;
    const users: string[] = JSON.parse(
      decodeURIComponent((request.query.users || '%5B%5D') as string),
    );

    const orderBy: string = (request.query.orderBy || 'saveTime') as string;
    const orderType: 'desc' | 'asc' = (request.query.orderType || 'desc') as
      | 'desc'
      | 'asc';

    const createdAt: number[] = JSON.parse(
      decodeURIComponent((request.query.createdAt || '%5B%5D') as string),
    );

    const saveTime: number[] = JSON.parse(
      decodeURIComponent((request.query.saveTime || '%5B%5D') as string),
    );

    const text: string = (request.query.text || '') as string;

    const postService = container.get<IPostService>(
      POST_IOC_SYMBOLS.IPostService,
    );
    const query: MangoQuery = generateQuery(
      page,
      pageSize,
      orderBy,
      orderType,
      createdAt,
      saveTime,
      users,
      text,
    );
    const postsPopulated: IPostPopulated[] =
      await postService.queryPopulated(query);

    const totalNumber: number = await postService.count(query.selector);
    response.send({ post: postsPopulated, totalNumber });
  }),
);

export { postRouter };
