import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, List, Avatar, Pagination } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { getSubCommentsApi } from '../../Api';
import HtmlParser from 'react-html-parser';
import { LikeOutlined } from '@ant-design/icons';
import { getImageUrl } from '../../Utility/parseUrl';
import { ISubComment } from '../../types';
import { useQuery } from '../../Utility/route';
import styles from './SubCommentList.module.scss';

export default function CommentList() {
  let listRef = useRef<any>(null);
  const history = useHistory();
  const query = useQuery();

  const { pathname, search } = history.location;
  const { commentId } = useParams<{ commentId: string }>();

  const [subComments, setSubComments] = useState<ISubComment[]>([]);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const page = parseInt(query.get('page') || '1');
  const pageSize = parseInt(query.get('pageSize') || '10');

  useEffect(() => {
    setLoading(true);
    getSubCommentsApi(commentId, search)
      .then((res) => {
        const { subComments, totalNumber } = res.data;
        setSubComments(subComments);
        setTotalNumber(totalNumber);
        setLoading(false);
      })
      .catch((err) => {});
  }, [commentId, page, pageSize]);
  const onShowSizeChange = (currentPage: number, pageSize: number) => {
    onPaginationChange(currentPage, pageSize);
  };

  const changePage = (currentPage: number, pageSize: number | undefined) => {
    onPaginationChange(currentPage, pageSize || 10);
  };
  return (
    <>
      <Row justify="center">
        <Col ref={listRef} xs={24} sm={20} md={12} lg={12} xl={8}>
          <List<ISubComment>
            style={{ backgroundColor: 'white' }}
            bordered
            split
            loading={loading}
            itemLayout="horizontal"
            dataSource={(subComments || []) as ISubComment[]}
            renderItem={(subComment) => (
              <List.Item
                actions={[
                  <>
                    <span> {subComment && subComment.upvotesCount}</span>
                    <LikeOutlined key="like"></LikeOutlined>
                  </>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={getImageUrl(subComment?.user?.image?.name || '')}
                    />
                  }
                  title={
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={subComment?.user?.profileUrl}
                    >{`@${subComment.user && subComment.user.username}`}</a>
                  }
                  description={HtmlParser(subComment.content)}
                />
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
            className={styles['sub-comment-list-pagination']}
            pageSize={pageSize}
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
