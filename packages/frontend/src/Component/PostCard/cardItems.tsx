import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  RetweetOutlined,
  CommentOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { IPost } from '../../types';
import styles from './cardItems.module.scss';
import { HomeState } from '../../Store/reducers/routeState';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { routeStateCreators } from '../../Store';

type ActionItemProps = {
  post: IPost;
};

function RepostActionItem(props: ActionItemProps) {
  const { post } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const pathname = history.location.pathname;
  const isHomePage = pathname === '/' || pathname === '';
  const isRouteMatch = pathname === `/post/${post.id}/reposts`;

  const className = isRouteMatch ? 'card-item-icon-selected' : '';

  return (
    <div
      onClick={() => {
        if (isHomePage) {
          const newState: HomeState = {
            queryString: history.location.search,
            id: post.id,
          };
          dispatch(routeStateCreators.setHomeRoute(newState));
        }
        history.push({
          pathname: `/post/${post.id}/reposts`,
          search: `?page=1&pageSize=10`,
        });
      }}
      className={styles[className]}
    >
      <RetweetOutlined
        className={styles['icon']}
        key="repost"
      ></RetweetOutlined>
      <span>{post && post.repostsCount}</span>
    </div>
  );
}

function CommentActionItem(props: ActionItemProps) {
  const { post } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const pathname = history.location.pathname;
  const isHome = pathname === '/' || pathname === '';
  const isRouteMatch = pathname === `/post/${post.id}/comments`;

  const className = isRouteMatch ? 'card-item-icon-selected' : 'card-item-icon';

  return (
    <div
      onClick={() => {
        if (isHome) {
          const newState: HomeState = {
            queryString: history.location.search,
            id: post.id,
          };
          dispatch(routeStateCreators.setHomeRoute(newState));
        }
        history.push({
          pathname: `/post/${post.id}/comments`,
          search: `?page=1&pageSize=10`,
        });
      }}
      className={styles[className]}
    >
      <CommentOutlined
        className={styles['icon']}
        key="comment"
      ></CommentOutlined>
      <span>{post && post.commentsCount}</span>
    </div>
  );
}

function LikeActionItem(props: ActionItemProps) {
  const { post } = props;
  return (
    <div>
      <LikeOutlined key="like"></LikeOutlined>
      <span> {post && post.upvotesCount}</span>
    </div>
  );
}

const getActionItems = (post: IPost) => {
  const props = {
    post,
  };
  return [
    <RepostActionItem {...props} />,
    <CommentActionItem {...props} />,
    <LikeActionItem post={post} />,
  ];
};

export { getActionItems };
