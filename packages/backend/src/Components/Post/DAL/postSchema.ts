import { RxJsonSchema } from 'rxdb';
import { IPost } from '../Types';

const version: number = 0;

const postSchema: RxJsonSchema<IPost> = {
  title: 'post schema',
  version: version,
  description: 'post schema',
  type: 'object',
  properties: {
    id: { type: 'string', primary: true },
    createTime: { type: 'number' },
    content: { type: 'string' },
    repostsCount: { type: 'number' },
    commentsCount: { type: 'number' },
    upvotesCount: { type: 'number' },
    user: { type: 'string', ref: 'user' },
    comments: { type: 'array', ref: 'comment', items: { type: 'string' } },
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, originUrl: { type: 'string' } },
      },
    },
    videos: {
      type: 'array',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, originUrl: { type: 'string' } },
      },
    },
    saveTime: { type: 'number' },
    repostingId: { type: 'string', ref: 'post' },
    repostComments: {
      type: 'array',
      ref: 'repostcomment',
      items: { type: 'string' },
    },
  },
  required: ['id', 'user',"content","createTime",'saveTime'],
  indexes: ['saveTime', 'createTime', 'user'],
};

export { postSchema, version };
