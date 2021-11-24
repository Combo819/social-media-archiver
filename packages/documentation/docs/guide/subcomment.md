# Sub Comment

sub comments are the second level of comments. Maybe called reply.

## API

Usually, sub comments are queried with the parent comment id, and returned in batch.
In `packages/backend/src/Components/SubComment/Service/subCommentApi.ts`

```typescript
function getSubCommentApi(): AxiosPromise {
  throw new NotImplementedError('getSubCommentApi is not implemented');
}
```

You need to specify the params you need, and make the API call. For example,

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

## Type

In `packages/backend/src/Components/SubComment/Types/subCommentTypes.ts`,

```typescript
type SubCommentCrawlerParams = {
  commentId: string;
  /* possible other properties */
};
```

fills in the type of the params to `SubCommentCrawlerParams`,  
Example:

```typescript
type SubCommentCrawlerParams = {
  commentId: string;
  page: number;
  pageSize: number;
};
```

## Crawl

In `packages/backend/src/Components/SubComment/Service/subCommentCrawler.ts`
`crawl` is the function that crawls the sub comments. It takes a `params`, which is from the previous `crawl` call.

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

Example:

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

## Next Params

In `packages/backend/src/Components/SubComment/Service/subCommentCrawler.ts`,
`transformNextParams` is a function that transforms the `res` from the API call and the current `params` to the `nextParams`. If there is no next request, returns `null`.

```typescript
  private transformNextParams(
    res: any,
    prevParams: SubCommentCrawlerParams,
  ): SubCommentCrawlerParams | null {
    throw new NotImplementedError('Not implemented');
  }
```

Example:

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

## Transform

You should transform the data from the API call response `res` to the `ISubComment` type so that the sub comments can be saved to the database.  
This method should also return their corresponding user objects `usersRaw`.

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

Example:

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
