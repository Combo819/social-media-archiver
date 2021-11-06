import { Modal, Avatar, Button, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { IUser } from '../../types';
import { getImageUrl } from '../../Utility/parseUrl';
import styles from './accountModal.module.scss';
import { CookieBox } from '../CookieBox';
import { setCookieApi } from '../../Api';
import { useDispatch } from 'react-redux';
import { accountCreators } from '../../Store';

type AccountModalProps = {
  visible: boolean;
  account: IUser | null;
  setVisible: (value: boolean) => void;
};

const getAvatar = (account: IUser | null) => {
  if (account) {
    return <Avatar src={account?.image && getImageUrl(account.image.name)} />;
  } else {
    return <Avatar icon={<UserOutlined />} />;
  }
};

const getUsername = (account: IUser | null) => {
  if (account) {
    return (
      <a target="_blank" href={`#`}>{`@${
        account && account.username
      }`}</a>
    );
  } else {
    return <span>Not login</span>;
  }
};

export function AccountModal(props: AccountModalProps) {
  const { visible, account, setVisible } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onLogout = async () => {
    setLoading(true);
    try {
      const isCookieSet: boolean = await (await setCookieApi('')).data.result;

      if (isCookieSet) {
        message.success('logout succeeded');
        dispatch(accountCreators.setAccount(null));
        setVisible(false);
      } else {
        message.error('failed to logout');
      }
    } catch (err) {
      message.error('failed to logout');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      onCancel={() => setVisible(false)}
      footer={[
        <Tooltip title="the local cookie will be delete">
          <Button
            disabled={account === null}
            loading={loading}
            onClick={onLogout}
            danger
          >
            Logout
          </Button>
        </Tooltip>,
      ]}
      title="The Account to crawl web"
      visible={visible}
    >
      <div className={styles['profile']}>
        <div className={styles['avatar']}>{getAvatar(account)}</div>
        <div className={styles['username']}>{getUsername(account)}</div>
      </div>
      <CookieBox account={account} />
    </Modal>
  );
}
