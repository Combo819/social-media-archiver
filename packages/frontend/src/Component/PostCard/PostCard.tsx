import React from 'react';
import { Card, Avatar, Row, Col, Modal, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import HtmlParser from 'react-html-parser';
import ReactPlayer from 'react-player';
import 'react-medium-image-zoom/dist/styles.css';
import { getVideoUrl, getImageUrl } from '../../Utility/parseUrl';
import { IPost } from '../../types';
import styles from './index.module.scss';
import { deletePostApi } from '../../Api';
import { useDispatch } from 'react-redux';
import { getActionItems } from './cardItems';
import { PhotosPreviewer } from './PhotosPreviewer';
import dayjs from 'dayjs';

type CardProps = {
  post: IPost;
  page?: number | null;
  pageSize?: number | null;
  loading?: boolean;
};
const { confirm } = Modal;
export default function PostCard(props: CardProps) {
  const { post, loading, page, pageSize } = props;
  const chunkImages: any[][] = _.chunk(post?.images, 3);

  const deletePost = () => {
    confirm({
      title: `Are you sure delete post ${post?.id}`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async function () {
        let result: boolean = false;
        try {
          const { data } = await deletePostApi(post?.id);
          result = data.result;
        } catch (err) {
          console.log(err);
        }
        if (result) {
          message.success(`Post ${post.id} deleted`);
        } else {
          message.error(`Failed to delete post ${post.id}`);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const title = (
    <div>
      <a
        target="_blank"
        href={`#`}
      >{`@${post?.user?.username}`}</a>

      <DeleteOutlined onClick={deletePost} className={styles.deleteButton} />
    </div>
  );
  return (
    <Card
      loading={loading || false}
      actions={getActionItems(post)}
      style={{ width: '100%' }}
    >
      {' '}
      <Card.Meta
        style={{ marginBottom: 10 }}
        avatar={<Avatar src={getImageUrl(post?.user?.image?.name || '')} />}
        title={title}
        description={HtmlParser(post && post.content)}
      />
      {post?.reposting && (
        <PostCard
          page={page}
          pageSize={pageSize}
          loading={loading || false}
          post={post?.reposting as IPost}
        />
      )}
      {post?.images && (
        <Row justify="center" align="middle">
          <Col>
            <PhotosPreviewer images={chunkImages} />
          </Col>
        </Row>
      )}
      {post?.videos?.map((video) => {
        return (
          <Row justify="center" align="middle">
            <Col>
              <ReactPlayer
                url={getVideoUrl(video.name)}
                controls
                width="100%"
              />
            </Col>
          </Row>
        );
      })}
      <div className={styles['time']}>
        created at:{' '}
        {dayjs(post?.createTime).format('YYYY-MM-DD, dddd, YYYY HH:mm')}
      </div>
      <div className={styles['time']}>
        backup at:{' '}
        {dayjs(post?.saveTime).format('YYYY-MM-DD, dddd, YYYY HH:mm')}
      </div>
    </Card>
  );
}
