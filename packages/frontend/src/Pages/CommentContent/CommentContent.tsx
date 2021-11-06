import React, { useEffect, useState } from 'react';
import { Col, Row, PageHeader, Card, Avatar } from 'antd';
import { LikeOutlined, EnterOutlined } from '@ant-design/icons';
import { useParams, useHistory } from 'react-router-dom';
import { getSingleCommentApi } from '../../Api';
import { SubCommentList } from '../../Component/SubCommentList';
import HtmlParser from 'react-html-parser';
import { getImageUrl } from '../../Utility/parseUrl';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { IComment } from '../../types';
function CommentContent() {
  const { postContent } = useSelector((state: RootState) => state.routeState);
  const history = useHistory();
  const { commentId } = useParams<{ commentId: string }>();
  const [comment, SetComment] = useState<IComment>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSingleCommentApi(commentId)
      .then((res) => {
        const { result } = res.data;
        SetComment(result);
        setLoading(false);
      })
      .catch((err) => {});
  }, [commentId]);

  return (
    <>
      <Row justify="center">
        <Col xs={24} sm={20} md={12} lg={12} xl={8}>
          <PageHeader
            backIcon={<EnterOutlined rotate={90} />}
            className="site-page-header"
            onBack={() => {
              history.push({
                pathname: `/post/${comment?.postId}/comments`,
                search: postContent.queryString,
              });
            }}
            title="Back"
            subTitle="Back to comment list"
          />
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} sm={20} md={12} lg={12} xl={8}>
          <Card
            actions={[
              <>
                <LikeOutlined
                  style={{ position: 'relative', top: -3 }}
                  key="like"
                ></LikeOutlined>
                <span> {comment?.upvotesCount}</span>
              </>,
            ]}
            loading={loading}
          >
            <Card.Meta
              style={{ marginBottom: 10 }}
              avatar={
                <Avatar src={getImageUrl(comment?.user?.image?.name || '')} />
              }
              title={`@${comment?.user?.username}`}
              description={HtmlParser(comment?.content || '')}
            />
          </Card>
        </Col>
      </Row>
      <SubCommentList></SubCommentList>
    </>
  );
}

export default CommentContent;
