# Sub Comment

子评论是第二级评论。有些平台可能叫做回复。

## API

通常，子评论通过评论 id 查询，并批量返回。
在`packages/backend/src/Components/SubComment/Service/subCommentApi.ts`

```typescript
function getSubCommentApi(): AxiosPromise {
  throw new NotImplementedError('getSubCommentApi is not implemented');
}
```

你需要指定所需的参数，并进行 API 调用。 例如，

```typescript
function getSubCommentApi(commentId: string): AxiosPromise {
  return crawlerAxios({
    url: `/api/subcomment/${commentId}`,
    params: {
      page,
      pageSize,
    },
  });
}
```

## 类型

在 `packages/backend/src/Components/SubComment/Types/subCommentTypes.ts`,

```typescript
type SubCommentCrawlerParams = {
  commentId: string;
  /* possible other properties */
};
```

将参数的类型填入`SubCommentCrawlerParams`，
例子：

```typescript
type SubCommentCrawlerParams = {
  commentId: string;
  page: number;
  pageSize: number;
};
```

## 爬取

在`packages/backend/src/Components/SubComment/Service/subCommentCrawler.ts`
`crawl` 是抓取子评论的方法。 它需要一个 `params`，本次的`params`来自上一次的 `crawl` 调用。

```typescript
  startCrawling = (commentId: string) => {
    asyncPriorityQueuePush(
      this.crawl,
      { commentId /* other initial params here */ },
      Q_PRIORITY.CRAWLER_SUB_COMMENT,
    );
  };

    private crawl = async (params: SubCommentCrawlerParams) => {
    const { commentId /* deconstruct other params for the API here  */ } =
      params;
    const res = await getSubCommentApi(/* API params here */);

    const { infos, usersRaw } = this.scrapeInfoUser(res, commentId);
    const nextParams = this.transformNextParams(res, params);

    if (nextParams) {
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_SUB_COMMENT,
      );
    }
  };
```

例如：

```typescript
  startCrawling = (commentId: string) => {
    asyncPriorityQueuePush(
      this.crawl,
      { commentId, page: 0, pageSize: 10 },
      Q_PRIORITY.CRAWLER_SUB_COMMENT,
    );
  };

  private crawl = async (params: SubCommentCrawlerParams) => {
    const { commentId, page, pageSize } =
      params;
    const res = await getSubCommentApi(commentId, page, pageSize);

    const { infos, usersRaw } = this.scrapeInfoUser(res, commentId);
    const nextParams = this.transformNextParams(res, params);

    if (nextParams) {
      asyncPriorityQueuePush(
        this.crawl,
        nextParams,
        Q_PRIORITY.CRAWLER_SUB_COMMENT,
      );
    }
  };
```

## 下一组评论

在`packages/backend/src/Components/SubComment/Service/subCommentCrawler.ts`中，
`transformNextParams` 是一个将 API 返回的 `res` 和当前的 `params` 转换为下一组参数 `nextParams` 的函数。 如果没有下一个请求，则返回 `null`。

```typescript
  private transformNextParams(
    res: any,
    prevParams: SubCommentCrawlerParams,
  ): SubCommentCrawlerParams | null {
    throw new NotImplementedError('Not implemented');
  }
```

例如：

```typescript
  private transformNextParams(
    res: any,
    prevParams: SubCommentCrawlerParams,
  ): SubCommentCrawlerParams | null {
    const { commentId, page, pageSize } = params;
    const { data } = res;
    if(data.length === 0) { // no more sub comments
      return null;
    }
    return {
      commentId,
      page: page + 1,
      pageSize,
    };
  }
```

## 转换

你要将数据从 API 返回结果 `res` 转换为 `ISubComment` 类型，以便可以将子评论保存到数据库中。
此方法还应返回其相应的用户对象 `usersRaw`。

```typescript
  private scrapeData(
    res: any,
    commentId: string,
  ): {
    infos: ISubComment[];
    usersRaw: unknown[];
  } {
    throw new NotImplementedError('Not implemented');
  }
```

例如：

```typescript
  private scrapeData(
    res: any,
    commentId: string,
  ): {
  infos: ISubComment[];
  usersRaw: unknown[];
} {

  const { data } = res;
  const infos = data.map(
    (raw: any): ISubComment => {
      return {
        id: raw.id,
        commentId,
        floorNumber: -1,
        content: raw.content,
        user: user.id,
        upvotesCount: raw.upvotesCount,
        createTime: dayjs(commentRaw.createTime).valueOf(),
        commentId: raw.commentId,
        saveTime: dayjs().valueOf(),
        replyTo: raw.replyTo,
      };
    },
  );
  const usersRaw: unknown[] = data.map((commentRaw: any) => commentRaw.user);
  return {
    infos,
    usersRaw,
  };
}
```
