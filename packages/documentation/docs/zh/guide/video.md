# Video
Video组件可以下载视频媒体文件。 它接受视频文件 url 并将视频文件作为静态资源下载到本地文件系统。 但是，某些平台中的视频不是静态视频文件。 视频是逐段下载和播放的。 在这种情况下，你需要自己重写Video组件。  
在`packages/backend/src/Components/Video/Service/videoService.ts`中：
您需要重写 `then` 函数中的代码。 您可以使用第三方库，如 `youtube-dl-exec` 或手动编写自己的代码。
```typescript
  private videoQueueFunc(queueParams: ParamsQueue): Promise<any> {
    const { url, staticPath } = queueParams;
    return new Promise((resolve, reject) => {
      downloadVideoApi(url)
        .then((res) => {
          // override the download code here
        })
        .catch(reject);
    });
  }
```