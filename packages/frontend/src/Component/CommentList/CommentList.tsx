import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, List, Avatar, Pagination } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { getCommentsApi } from '../../Api';
import HtmlParser from 'react-html-parser';
import { LikeOutlined, PictureOutlined } from '@ant-design/icons';
import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
import { getImageUrl } from '../../Utility/parseUrl';
import { IComment } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, routeStateCreators } from '../../Store';
import { PostContentState } from '../../Store/reducers/routeState';
import { useQuery } from '../../Utility/route';
import styles from './CommentList.module.scss';
export default function CommentList() {
  const { postId } = useParams<{ postId: string }>();

  const [comments, setComments] = useState<IComment[]>([]);
  const [totalNumber, setTotalNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const { postContent } = useSelector((state: RootState) => state.routeState);

  const dispatch = useDispatch();
  const query = useQuery();
  let listRef = useRef<any>(null);
  const history = useHistory();

  const { pathname } = history.location;

  const page = parseInt(query.get('page') || '1');
  const pageSize = parseInt(query.get('pageSize') || '10');

  useEffect(() => {
    setLoading(true);
    getCommentsApi(postId, history.location.search)
      .then((res) => {
        const { comments, totalNumber } = res.data;
        setComments(comments);
        setTotalNumber(totalNumber);
        setLoading(false);
      })
      .catch((err) => {});
  }, [postId, page, pageSize]);

  useEffect(() => {
    if (postContent.id && comments.length) {
      setTimeout(() => {
        const dom = document.getElementById(postContent.id);
        dom && dom.scrollIntoView();
      }, 0);
    }
  }, [comments.length, postContent.id]);

  const onShowSizeChange = (currentPage: number, pageSize: number) => {
    onPaginationChange(currentPage, pageSize);
  };

  const changePage = (currentPage: number, pageSize: number | undefined) => {
    onPaginationChange(currentPage, pageSize || 10);
  };

  const toSubComments = (commentId: string) => {
    const newState: PostContentState = {
      queryString: history.location.search,
      id: commentId,
    };
    dispatch(routeStateCreators.setPostContentState(newState));
    history.push({
      pathname: `/comment/${commentId}`,
    });
  };

  const repliesStyle = (num: number) => {
    if (num > 0) {
      return { color: '#1890ff' };
    }
    return { cursor: 'default' };
  };
  return (
    <>
      <Row justify="center">
        <Col ref={listRef} xs={24} sm={20} md={12} lg={12} xl={8}>
          <List<IComment>
            style={{ backgroundColor: 'white' }}
            bordered
            split
            loading={loading}
            itemLayout="vertical"
            dataSource={comments || []}
            renderItem={(comment) => (
              <List.Item
                id={comment && comment.id}
                actions={[
                  <>
                    <span> {comment?.upvotesCount}</span>
                    <LikeOutlined key="like"></LikeOutlined>
                  </>,
                  <a
                    onClick={() => {
                      if (
                        comment.subComments?.length &&
                        comment.subComments?.length > 0
                      ) {
                        toSubComments(comment && comment.id);
                      }
                    }}
                    key="list-loadmore-edit"
                    style={repliesStyle(comment.subComments?.length || 0)}
                  >
                    {comment.subComments?.length || 0} replies
                  </a>,
                  comment.image && (
                    <PhotoProvider>
                      <PhotoConsumer src={getImageUrl(comment.image.name)}>
                        <PictureOutlined
                          style={{ color: '#1890ff', cursor: 'pointer' }}
                        />
                      </PhotoConsumer>
                    </PhotoProvider>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={getImageUrl(comment?.user?.image?.name || '')}
                    />
                  }
                  title={
                    <a target="_blank" href={comment?.user?.profileUrl}>{`@${
                      comment.user && comment.user.username
                    }`}</a>
                  }
                  description={
                    comment.replyTo && (
                      <div>
                        reply to{' '}
                        <a
                          href={`https://www.zhihu.com/people/${comment.replyTo.id}`}
                        >
                          {comment.replyTo.username}
                        </a>
                      </div>
                    )
                  }
                />
                {HtmlParser(comment.content)}
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col xs={24} sm={20} md={12} lg={12} xl={8}>
          <Pagination
            onChange={changePage}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={page}
            total={totalNumber}
            pageSize={pageSize}
            className={styles['comment-list-pagination']}
          ></Pagination>
        </Col>
      </Row>
    </>
  );

  function onPaginationChange(currentPage: number, pageSize: number) {
    const newPage = currentPage <= 0 ? 1 : currentPage;
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set('page', String(newPage));
    searchParams.set('pageSize', String(pageSize));
    history.push({
      pathname: pathname,
      search: `?${searchParams.toString()}`,
    });
    if (listRef && listRef.current) {
      listRef.current.scrollIntoView();
    }
  }
}
