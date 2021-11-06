import React from 'react';
import { Modal } from 'antd';

function showMonitorIntro() {
  Modal.info({
    icon: null,
    content: (
      <div>
        <div>
          <h3>What does monitor do?</h3>
          <p>
            Monitor can monitor the collections. You can add the api url of a
            collection, like a upvote, watch later, favorite, and so on, as long
            as it's supported. Once you add the api url, the monitor module will
            request the api periodically, and catch the new added post in the
            collection, and then backup that post.
          </p>
          <p>
            First, select the collection type, and then copy the api url from
            the Chrome debug tool to the collection url input box.
          </p>
        </div>
        <div>
          <h3>什么是monitor？</h3>
          <p>
            Monitor可以监控集合。你可以添加集合（比如点赞，收藏，稍后观看，喜爱等等，只要程序支持这种集合）的api
            url。添加后，monitor模块会定时请求api，当监测到有新的贴文被添加进这个集合后，本程序就会把这个新的贴文备份下来。
          </p>
          <p>
            首先，选择collection
            type，然后复制Chrome调试工具中的api的url到collection url输入框中。
          </p>
        </div>
      </div>
    ),
  });
}

export { showMonitorIntro };
