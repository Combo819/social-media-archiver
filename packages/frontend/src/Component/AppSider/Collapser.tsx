import React, { Dispatch, SetStateAction } from 'react';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './Collapser.module.scss';
type CollapserProps = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

function Collapser(props: CollapserProps) {
  const { collapsed, setCollapsed } = props;
  return (
    <div
      onClick={() => {
        setCollapsed(!collapsed);
      }}
      className={styles['collapser']}
    >
      {collapsed ? (
        <RightOutlined style={{ color: 'white' }} />
      ) : (
        <LeftOutlined style={{ color: 'white' }} />
      )}
    </div>
  );
}

export { Collapser };
