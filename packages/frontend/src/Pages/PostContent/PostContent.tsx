import React, { useEffect, useState } from 'react';
import { Col, Row, PageHeader } from 'antd';
import { PostCard } from '../../Component/PostCard';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { getSinglePostApi } from '../../Api';
import { CommentList } from '../../Component/CommentList';
import { IPost } from '../../types';
import { Switch, Route } from 'react-router-dom';
import { RepostCommentList } from '../../Component/RepostCommentList';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { EnterOutlined } from '@ant-design/icons';
import _ from 'lodash';

function PostContent() {
  const { home } = useSelector((state: RootState) => state.routeState);
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const history = useHistory();
  const { postId } = useParams<{ postId: string }>();
  const query = useQuery();
  const [post, setPost] = useState<IPost>({ comments: [] } as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSinglePostApi(
      postId,
      parseInt(query.get('page') || '1'),
      parseInt(query.get('pageSize') || '10'),
    )
      .then((res) => {
        const { post } = res.data;
        setPost(post);
        setLoading(false);
      })
      .catch((err) => {});
  }, [postId]);

  return (
    <>
      <Row justify="center">
        <Col xs={24} sm={20} md={12} lg={12} xl={8}>
          <PageHeader
            backIcon={<EnterOutlined rotate={90} />}
            className="site-page-header"
            onBack={() => {
              history.push({
                pathname: `/`,
                search: home.queryString,
              });
            }}
            title="Back"
            subTitle="Back to post list"
          />
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} sm={20} md={12} lg={12} xl={8}>
          <PostCard loading={loading} post={post}></PostCard>
        </Col>
      </Row>
      <Switch>
        <Route path="/post/:postId/comments">
          <CommentList />
        </Route>
        <Route path="/post/:postId/reposts">
          <RepostCommentList />
        </Route>
      </Switch>
    </>
  );
}

export default PostContent;
