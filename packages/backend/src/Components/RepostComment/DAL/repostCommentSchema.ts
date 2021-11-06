import { RxJsonSchema } from 'rxdb';
import { IRepostComment } from '../Types';

export const version = 0;
export const repostCommentSchema: RxJsonSchema<IRepostComment> = {
  title: 'repostComment schema',
  version: version,
  description: 'repostComment schema',
  type: 'object',
  properties: {
    id: { type: 'string', primary: true },
    content: { type: 'string' },
    createTime: { type: 'number' },
    user: { type: 'string', ref: 'user' },
    repostedId: { type: 'string', ref: 'post' }, //the parent post id
    saveTime: { type: 'number' },
  },
  required: ['id', 'content', 'user', 'createTime', 'repostedId', 'saveTime'],
  indexes: ['repostedId', 'user'],
};
