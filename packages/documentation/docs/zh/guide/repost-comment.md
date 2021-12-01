# Repost Comment

当用户转发一个 post 时，他们通常会为该转发添加一条评论。这就是转发评论。例如，在微博中转发另一条微博。

## API

in `packages/backend/src/Components/RepostComment/Service/repostCommentApi.ts`,

```typescript
function getRepostCommentApi(): AxiosPromise {
  throw new NotImplementedError('getRepostCommentApi is not implemented');
}
```

实现这个函数以从平台获取转发评论。
例如,

```typescript
function getRepostCommentApi(
  postId: string,
  page: number,
  pageSize: number,
): AxiosPromise {
  return crawlerAxios({
    url: `/repost`,
    method: 'get',
    params: {
      postId,
      page,
      pageSize,
    },
  });
}
```

## 类型

在 `packages/backend/src/Components/RepostComment/Types/repostCommentTypes.ts`,

```typescript
type RepostCommentCrawlerParams = {
  postId: string;
  /* possible other properties */
};
```

你需要填写其他需要的参数的类型。
例如:

```typescript
type RepostCommentCrawlerParams = {
  postId: string;
  page: number;
  pageSize: number;
};
};
```

## 爬取

在`packages/backend/src/Components/RepostComment/Service/repostCommentCrawler.ts`中，
`crawl` 是抓取评论的函数。 它需要一个 `params`，本次的`param`来自上一次的 `crawl` 调用。

```typescript
  startCrawling = (postId: string) => {
    asyncPriorityQueuePush(
      this.crawl,
      { postId /* other initial params here */ },
      Q_PRIORITY.CRAWLER_REPOST_COMMENT,
    );
  };

  private crawl = async (params: RepostCommentCrawlerParams) => {
    const { postId /* deconstruct other params for the API here  */ } = params;
    const res = await getRepostCommentApi(/* API params here */);
    const { usersRaw, infos } = this.scrapeInfoUser(res, postId);
    const nextParams = this.transformNextParams(res, params);

    if (nextParams) {
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_REPOST_COMMENT,
      );
    }
  };
```

然后你应该从 `params` 中解构参数，并将参数传递给 `getRepostCommentApi` 函数。

例如：

```typescript
  startCrawling = (postId: string) => {
    asyncPriorityQueuePush(
      this.crawl,
      { postId, page: 0, pageSize: 10 },
      Q_PRIORITY.CRAWLER_REPOST_COMMENT,
    );
  };

  private crawl = async (params: RepostCommentCrawlerParams) => {
    const { postId, page, pageSize  } = params;
    const res = await getRepostCommentApi(postId, page, pageSize);
    const { usersRaw, infos } = this.scrapeInfoUser(res, postId);
    const nextParams = this.transformNextParams(res, params);

    if (nextParams) {
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_REPOST_COMMENT,
      );
    }
  };
```

## 下一组评论

在`packages/backend/src/Components/RepostComment/Service/repostCommentCrawler.ts`中，`transformNextParams`是转换下一组参数的函数。

```typescript
  private transformNextParams(
    res: any,
    prevParams: RepostCommentCrawlerParams,
  ): RepostCommentCrawlerParams | null {
    throw new NotImplementedError('Not implemented');
  }
```

例如：

```typescript
  private transformNextParams(
    res: any,
    prevParams: RepostCommentCrawlerParams,
  ): RepostCommentCrawlerParams | null {
    const { postId, page, pageSize } = params;
    const { data } = res;
    if(data.length === 0) { // no more repost comment
      return null;
    }
    return {
      postId,
      page: page + 1,
      pageSize,
    };
  }
```

## 转换

您应该将数据从 API 调用结果 `res` 转换为 `IRepostComment` 类型，以便可以将转发评论保存到数据库中。
此方法还应返回其相应的用户对象 `usersRaw`。

```typescript
  private scrapeInfoUser(
    res: any,
    postId: string,
  ): {
    infos: IRepostComment[];
    usersRaw: unknown[];
  } {
    throw new NotImplementedError('Not implemented');
  }
```

例如：

```typescript
  private scrapeInfoUser(
    res: any,
    postId: string,
  ): {
    infos: IRepostComment[];
    usersRaw: unknown[];
  } {
  const { data } = res;
  const infos: IRepostComment[] = data.map((repostCommentRaw: any) => {
    return {
      id: repostCommentRaw.id,
      content: repostCommentRaw.content,
      user: repostCommentRaw.user.id,
      createTime: repostCommentRaw.createTime,
      repostedId: postId,
      saveTime: dayjs().valueOf(),
    };
  });
  const usersRaw: unknown[] = data.map((comment: any) => comment.user);
  return {
    infos,
    usersRaw,
  };
  }
```
