import React, { useEffect, useState, useRef } from 'react';
import { Col, Row, Pagination, Empty, Layout, Collapse, Card } from 'antd';
import { PostCard } from '../../Component/PostCard';
import { getPostsApi } from '../../Api';
import { useHistory } from 'react-router-dom';
import { IPost as PostType } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { useQuery } from '../../Utility/route';
import { PostQuery } from '../../Component/PostQuery/PostQuery';
import styles from './Home.module.scss';

const { Content } = Layout;
const { Panel } = Collapse;

function Home(Props: React.Props<any>) {
  let listRef = useRef<any>(null);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const { home } = useSelector((state: RootState) => state.routeState);

  const history = useHistory();
  const query = useQuery();

  const { search, pathname } = history.location;

  const page = parseInt(query.get('page') || '1');
  const pageSize = parseInt(query.get('pageSize') || '10');

  useEffect(() => {
    getPostsApi(history.location.search)
      .then((res) => {
        const { post, totalNumber } = res.data;
        setPosts(post);
        setTotalNumber(totalNumber);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [search]);

  useEffect(() => {
    if (home.id && posts.length) {
      setTimeout(() => {
        const dom = document.getElementById(home.id);
        dom && dom.scrollIntoView();
      }, 0);
    }
  }, [home.id, posts.length]);

  const onShowSizeChange = (currentPage: number, pageSize: number) => {
    onPaginationChange(currentPage, pageSize);
  };

  const changePage = (currentPage: number, pageSize: number | undefined) => {
    onPaginationChange(currentPage, pageSize || 10);
  };

  return (
    <>
      <Layout>
        <Content>
          <Row justify="center" align="middle">
            <Col xs={24} sm={20} md={12} lg={12} xl={8}>
              <Card>
                <Collapse ghost>
                  <Panel header="Query" key="1">
                    <PostQuery />
                  </Panel>
                </Collapse>
              </Card>
            </Col>
          </Row>
          <Row justify="center" align="middle">
            <Col ref={listRef} xs={24} sm={20} md={12} lg={12} xl={8}>
              {posts.length > 0 ? (
                posts.map((item: any) => {
                  return (
                    <div
                      className={styles['home-card']}
                      id={item.id}
                      key={item.id}
                    >
                      <PostCard
                        page={page}
                        pageSize={pageSize}
                        post={item}
                      ></PostCard>
                    </div>
                  );
                })
              ) : (
                <Empty />
              )}
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
                className={styles['home-pagination']}
              ></Pagination>
            </Col>
          </Row>
        </Content>
      </Layout>
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

export default Home;
