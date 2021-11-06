import React, { useState } from 'react';
import { Button, Layout, Modal } from 'antd';
import { PostQuery } from '../PostQuery/PostQuery';
import styles from './AppSider.module.scss';
import { Collapser } from './Collapser';
import { useMedia } from 'react-use';
import { SearchOutlined } from '@ant-design/icons';

const { Sider } = Layout;
function AppSider() {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const isShort = useMedia('(max-height: 810px)');

  return (
    <>
      {isShort ? (
        <>
          {' '}
          <Button
            className={styles['search-button']}
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              setVisible(true);
            }}
          ></Button>
          <Modal
            onCancel={() => {
              setVisible(false);
            }}
            footer={null}
            visible={visible}
          >
            <PostQuery />
          </Modal>
        </>
      ) : (
        <>
          <Sider
            collapsedWidth={1}
            collapsed={collapsed}
            theme="light"
            className={styles['app-sider-fix']}
          >
            <Collapser collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className={styles['sider-content']}>
              <PostQuery />
            </div>
          </Sider>
        </>
      )}
    </>
  );
}

export { AppSider };
