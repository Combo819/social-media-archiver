import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, List, Avatar, Pagination } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import { getRepostCommentsApi } from '../../Api';
import HtmlParser from 'react-html-parser';
import 'react-photo-view/dist/index.css';
import { getImageUrl } from '../../Utility/parseUrl';
import { IRepostComment } from '../../types';
import { useQuery } from '../../Utility/route';

export default function RepostCommentList(props: React.Props<any>) {
  let listRef = useRef<any>(null);
  const history = useHistory();
  const query = useQuery();

  const { postId: repostedId } = useParams<{ postId: string }>();

  const [repostComments, setRepostComments] = useState<IRepostComment[]>([]);
  const [totalNumber, setTotalNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const page = parseInt(query.get('page') || '1');
  const pageSize = parseInt(query.get('pageSize') || '10');
  const { pathname, search } = history.location;

  useEffect(() => {
    setLoading(true);
    getRepostCommentsApi(repostedId, search)
      .then((res) => {
        const { repostComments, totalNumber } = res.data;
        setRepostComments(repostComments);
        setTotalNumber(totalNumber);
        setLoading(false);
      })
      .catch((err) => {});
  }, [repostedId, page, pageSize]);

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
          <List<IRepostComment>
            style={{ backgroundColor: 'white' }}
            bordered
            split
            loading={loading}
            itemLayout="vertical"
            dataSource={repostComments || []}
            renderItem={(repostComment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={getImageUrl(repostComment?.user?.image?.name || '')}
                    />
                  }
                  title={
                    <a
                      target="_blank"
                      href={repostComment.user.profileUrl}
                    >{`@${
                      repostComment.user && repostComment.user.username
                    }`}</a>
                  }
                  description={HtmlParser(repostComment.content)}
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
            className="p-2"
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
