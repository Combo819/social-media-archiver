import { RxJsonSchema } from 'rxdb';
import { ISubComment } from '../Types';

export const version = 0;
export const subCommentSchema: RxJsonSchema<ISubComment> = {
  title: 'subcomment schema',
  version: version,
  description: 'subcomment schema',
  type: 'object',
  properties: {
    id: { type: 'string', primary: true },
    floorNumber: { type: 'number' },
    content: { type: 'string' },
    upvotesCount: { type: 'number' },
    createTime: { type: 'number' },
    user: { type: 'string', ref: 'user' },
    commentId: { type: 'string', ref: 'comment' },
    saveTime: { type: 'number' },
    replyTo: { type: 'string', ref: 'user' },
  },
  required: ['id', 'user', 'createTime', 'commentId', 'saveTime', 'content'],
  indexes: ['commentId', 'user'],
};
