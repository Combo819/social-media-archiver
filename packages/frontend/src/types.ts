type IUser = {
  id: string;
  username: string;
  profileUrl?: string;
  gender: string;
  followersCount: number;
  followingCount: number;
  image: { name: string; originUrl: string }; // profile image filename,
};
type ISubComment = {
  id: string; //id for subComment
  floorNumber?: number;
  content: string; // unicode and html
  user: IUser;
  upvotesCount?: number;
  createTime: number;
  commentId: string;
  saveTime: number;
};

type IComment = {
  id: string;
  floorNumber?: number;
  content: string; // unicode and html
  subCommentsCount?: number; // the number of sub comments shown on client
  user: IUser;
  upvotesCount?: number;
  createTime: number;
  subComments?: string[];
  image?: { name: string; originUrl: string };
  postId: string;
  saveTime: number;
  replyTo?: IUser;
};

type IPost = {
  id: string;
  createTime: number;
  content: string;
  repostsCount?: number;
  commentsCount?: number;
  upvotesCount?: number;
  user: IUser;
  comments?: string[] | IComment[];
  images?: { name: string; originUrl: string }[];
  videos?: { name: string; originUrl: string }[];
  saveTime: number;
  reposting?: IPost;
  repostComments?: string[];
};

type IRepostComment = {
  id: string;
  content: string; // unicode and html
  user: IUser;
  createTime: number;
  repostedId: string;
  saveTime: number;
};

type Image = {
  name: string;
  originUrl: string;
};

export type { IPost, IUser, ISubComment, IComment, IRepostComment, Image };
