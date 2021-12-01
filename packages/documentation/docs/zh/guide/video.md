# Video
The video component can download video media file. It accepts a video file url and download the video file as a static resource to the local file system. However, videos in some of the platforms are not static video files. The video is download and played segment by segment. In this scenario, you have to override the video component.  
In `packages/backend/src/Components/Video/Service/videoService.ts`:  
You can override the code inside `then` function. You can use third-party library like `youtube-dl-exec` or write your own code manually.
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