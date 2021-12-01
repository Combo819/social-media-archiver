# Comment

## API

通常，评论通过 post id 查询，并批量返回。
在`packages/backend/src/Components/Comment/Service/commentApi.ts`

```typescript
function getCommentApi(/* params here */): AxiosPromise {
  /* axios config here */
  throw new NotImplementedError('getCommentApi is not implemented');
}
```

您需要指定所需的参数，然后调用平台的 API。 例如，

```typescript
function getCommentApi(
  postId: string,
  page: number,
  pageSize: number,
): AxiosPromise {
  return crawlerAxios({
    url: `/api/comment/${postId}`,
    params: {
      page,
      pageSize,
    },
  });
}
```

## 类型

在`packages/backend/src/Components/Comment/Types/commentTypes.ts`中，
将参数的类型填入`CommentCrawlParams`，

```typescript
type CommentCrawlParams = {
  postId: string;
  /* possible other properties */
};
```

例如：

```typescript
type CommentCrawlParams = {
  postId: string;
  page: number;
  pageSize: number;
};
```

## 爬取

在`packages/backend/src/Components/Comment/Service/commentCrawler.ts`
`crawl` 是抓取评论的函数。 它需要一个 `params`，本次的`param`来自上一次的 `crawl` 调用。

![](./comment-crawler.drawio.svg)
您得首先在`startCrawling`中指定初始参数，以获取第一批评论。

```typescript
startCrawling = (postId: string) => {
  asyncPriorityQueuePush(
    this.crawl,
    {
      postId /* other initial params here */,
    },
    Q_PRIORITY.CRAWLER_COMMENT,
  );
};
```

例如：

```typescript
startCrawling = (postId: string) => {
  asyncPriorityQueuePush(
    this.crawl,
    {
      postId,
      page: 0,
      pageSize: 10,
    },
    Q_PRIORITY.CRAWLER_COMMENT,
  );
};
```

然后从 `params` 中解构参数，并将参数传递给 `getCommentApi` 函数。

```typescript
  private crawl = async (params: CommentCrawlParams) => {
    const { postId /* deconstruct other params for the API here  */ } = params;
    const res = await getCommentApi(/* API params here */);
    const nextParams = this.transformNextParams(res, params);
    // ...

    //if there is next request to go
    if (nextParams) {
        // start the next crawl call to get the next batch of comments
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_COMMENT,
      );
    }
}
```

例如：

```typescript
  private crawl = async (params: CommentCrawlParams) => {
    const { postId, page, pageSize } = params;
    const res = await getCommentApi(postId,page, pageSize);
    const nextParams = this.transformNextParams(res, params);
    // ...

    //if there is next request to go
    if (nextParams) {
        // start the next crawl call to get the next batch of comments
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_COMMENT,
      );
    }
}
```

## 下一组参数

在`packages/backend/src/Components/Comment/Service/commentCrawler.ts`中，`transformNextParams`是一个将 API 调用中的`res`和当前`params`转换为`nextParams`的函数。 如果没有下一个请求，则返回 `null`。

```typescript
  private transformNextParams(
    res: any,
    params: CommentCrawlParams,
  ): CommentCrawlParams | null {
    throw new NotImplementedError('Not implemented');
  }
```

例如：

```typescript
private transformNextParams(
    res: any,
    params: CommentCrawlParams,
  ): CommentCrawlParams | null {
    const { postId, page, pageSize } = params;
    const { data } = res;
    if(data.length === 0) { // no more comments
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

您应该将数据从 API 返回的 `res` 转换为 `IComment` 类型，以便可以将评论保存到数据库中。
此方法还应返回其相应的用户对象 `usersRaw`。

```typescript
  private scrapeData(
    res: any,
    postId: string,
  ): {
    infos: IComment[];
    usersRaw: unknown[];
  } {
    throw new NotImplementedError('Not implemented');
  }
```

例如：

```typescript
  private scrapeData(
    res: any,
    postId: string,
  ): {
  infos: IComment[];
  usersRaw: unknown[];
} {
  const { data } = res;
  const infos: IComment[] = data.map((commentRaw: any) => {
    return {
      id: commentRaw.id,
      floorNumber: commentRaw.floorNumber, // or -1 if not exist
      content: commentRaw.content,
      subCommentsCount: commentRaw.subCommentsCount,
      user: commentRaw.user.id, // user id
      upvotesCount: commentRaw.upvotesCount,
      createTime: dayjs(commentRaw.createTime).valueOf(),
      subComments: commentRaw.subComments, // sub comment ids
      postId,
      saveTime: dayjs().valueOf(),
    };
  });
  const usersRaw: unknown[] = data.map((commentRaw: any) => commentRaw.user);
  return {
    infos,
    usersRaw,
  };
}
```
