import { createRxDatabase, RxDatabase, addRxPlugin } from 'rxdb';
import { commentSchema, commentMigration } from '../Components/Comment/DAL';
import { CommentCollection } from '../Components/Comment/Types';
import {
  repostCommentSchema,
  repostCommentMigration,
} from '../Components/RepostComment/DAL';
import { RepostCommentCollection } from '../Components/RepostComment/Types';
import {
  subCommentMigration,
  subCommentSchema,
} from '../Components/SubComment/DAL';
import { SubCommentCollection } from '../Components/SubComment/Types';
import { userMigration, userSchema } from '../Components/User/DAL';
import { UserCollection } from '../Components/User/Types';
import { postMigration, postSchema } from '../Components/Post/DAL';
import { PostCollection } from '../Components/Post/Types';

import { rxdbPath } from '../Config';

type DataBaseCollections = {
  user: UserCollection;
  post: PostCollection;
  comment: CommentCollection;
  subcomment: SubCommentCollection;
  repostcomment: RepostCommentCollection;
};

type DatabaseType = RxDatabase<DataBaseCollections>;

addRxPlugin(require('pouchdb-adapter-leveldb'));
const leveldown = require('leveldown');

let database: DatabaseType;

const connectDB = async () => {
  database = await createRxDatabase<DataBaseCollections>({
    name: rxdbPath,
    adapter: leveldown,
  });
  await database.addCollections({
    post: {
      schema: postSchema,
      migrationStrategies: postMigration,
    },
    user: { schema: userSchema, migrationStrategies: userMigration },
    comment: { schema: commentSchema, migrationStrategies: commentMigration },
    subcomment: {
      schema: subCommentSchema,
      migrationStrategies: subCommentMigration,
    },
    repostcomment: {
      schema: repostCommentSchema,
      migrationStrategies: repostCommentMigration,
    },
  });

  return database;
};

export { connectDB, database };
