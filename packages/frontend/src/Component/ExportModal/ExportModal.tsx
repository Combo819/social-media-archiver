import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};
export function ExportModal(props: Props) {
  const { visible, setVisible } = props;
  return (
    <Modal title='Download data as json files' visible={visible} onCancel={() => setVisible(false)}>
      <ul>
        <li>
          <a href="/api/post/export">post</a>
        </li>
        <li>
          <a href="/api/comment/export">comment</a>
        </li>
        <li>
          <a href="/api/subComment/export">subComment</a>
        </li>
        <li>
          <a href="/api/repostComment/export">repostComment</a>
        </li>
        <li>
          <a href="/api/user/export">user</a>
        </li>
      </ul>
    </Modal>
  );
}
