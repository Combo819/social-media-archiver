import { RxJsonSchema } from 'rxdb';
import { IComment } from '../Types';

const version = 0;
const commentSchema: RxJsonSchema<IComment> = {
  title: 'userSchema',
  version: version,
  description: 'user schema',
  type: 'object',
  properties: {
    id: { type: 'string', primary: true },
    floorNumber: { type: 'number' },
    content: { type: 'string' },
    subCommentsCount: { type: 'number' },
    upvotesCount: { type: 'number' },
    createTime: { type: 'number' },
    postId: { type: 'string', ref: 'post' },
    user: { type: 'string', ref: 'user' },
    subComments: {
      type: 'array',
      ref: 'subcomment',
      items: { type: 'string' },
    },
    image: {
      type: 'object',
      properties: { name: { type: 'string' }, originUrl: { type: 'string' } },
    },
    saveTime: { type: 'number' },
  },
  required: ['id', 'content', 'user', 'createTime', 'postId', 'saveTime'],
  indexes: ['user', 'postId'],
};

export { commentSchema, version };
