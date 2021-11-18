# Repost Comment

When users repost a post, usually they add a comment to that repost. That is repost comment. For example, the quote tweets in twitter.

## API

in `packages/backend/src/Components/RepostComment/Service/repostCommentApi.ts`,

```typescript
function getRepostCommentApi(): AxiosPromise {
  throw new NotImplementedError('getRepostCommentApi is not implemented');
}
```

You should implement this function to fetch repost comments from the platform.
For example,

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

## Type

in `packages/backend/src/Components/RepostComment/Types/repostCommentTypes.ts`,

```typescript
type RepostCommentCrawlerParams = {
  postId: string;
  /* possible other properties */
};
```

You need to fill in the other parameters.  
For example:

```typescript
type RepostCommentCrawlerParams = {
  postId: string;
  page: number;
  pageSize: number;
};
};
```

## Crawl

In `packages/backend/src/Components/RepostComment/Service/repostCommentCrawler.ts`,
`crawl` is the function that crawls the comments. It takes a `params`, which is from the previous `crawl` call.

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

You should deconstruct the parameters from `params` then, and pass the parameters to the `getRepostCommentApi` function.

For example:

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

## Next Params

In `packages/backend/src/Components/RepostComment/Service/repostCommentCrawler.ts`, `transformNextParams` is the function that transforms the next parameters.

```typescript
  private transformNextParams(
    res: any,
    prevParams: RepostCommentCrawlerParams,
  ): RepostCommentCrawlerParams | null {
    throw new NotImplementedError('Not implemented');
  }
```

Example:

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

## Transform

You should transform the data from the API call response `res` to the `IRepostComment` type so that the repost comments can be saved to the database.  
This method should also return their corresponding user objects `usersRaw`.

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

Example:

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
