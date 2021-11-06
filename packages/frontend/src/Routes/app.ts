import { FunctionComponent, ComponentClass } from 'react';
import { Home } from '../Pages/Home';
import { PostContent } from '../Pages/PostContent';
import { CommentContent } from '../Pages/CommentContent';

export interface Route {
  path: string;
  component: FunctionComponent | ComponentClass;
  exact?: boolean;
}

const routes: Route[] = [
  { path: '/post/:postId', component: PostContent },
  { path: '/comment/:commentId', component: CommentContent },
  {
    path: '/',
    component: Home,
    exact: true,
  },
];

export default routes;
