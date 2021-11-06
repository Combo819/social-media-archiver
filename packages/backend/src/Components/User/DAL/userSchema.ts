import { RxJsonSchema } from 'rxdb';
import { IUser } from '../Types';

const version = 0;
const userSchema: RxJsonSchema<IUser> = {
  title: 'userSchema',
  version: version,
  description: 'user schema',
  type: 'object',
  properties: {
    id: { type: 'string', primary: true },
    username: { type: 'string' }, // the name shown on posts
    gender: { type: 'string' },
    followersCount: { type: 'number' },
    followingCount: { type: 'number' },
    image: {
      type: 'object',
      properties: { name: { type: 'string' }, originUrl: { type: 'string' } },
    }, // a larger profile image,
    profileUrl: { type: 'string' },
  },
  required: ['id', 'gender', 'followersCount', 'followingCount', 'image'],
  indexes: ['username'],
};

export { userSchema, version };
