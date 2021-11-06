import React from 'react';
import { Layout, BackTop } from 'antd';
import { Switch, Route } from 'react-router-dom';
import { routes } from './Routes';

import { UpCircleOutlined } from '@ant-design/icons';
import { AppHeader } from './Component/AppHeader/AppHeader';
import { AppSider } from './Component/AppSider/AppSider';
import styles from './App.module.scss';

const { Content, Sider } = Layout;
function App(): JSX.Element {
  return (
    <Layout>
      <AppHeader />
      <Content>
        <Switch>
          {routes.map((item): React.ReactNode => {
            return (
              <Route
                path={item.path}
                render={(props: any) => (
                  <item.component {...props}></item.component>
                )}
              ></Route>
            );
          })}
        </Switch>
      </Content>
      <BackTop>
        <UpCircleOutlined
          style={{ fontSize: 30, color: 'rgba(0, 0, 0, 0.45)' }}
        />
      </BackTop>
    </Layout>
  );
}

export default App;
