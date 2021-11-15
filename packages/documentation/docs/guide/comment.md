# Comment

## API

Usually, comments are queried with the post id, and returned in batch.
In `packages/backend/src/Components/Comment/Service/commentApi.ts`

```typescript
function getCommentApi(/* params here */): AxiosPromise {
  /* axios config here */
  throw new NotImplementedError('getCommentApi is not implemented');
}
```

You need to specify the params you need, and make the API call. For example,

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

## Type

in `packages/backend/src/Components/Comment/Types/commentTypes.ts`,
fills in the type of the params to `CommentCrawlParams`,

```typescript
type CommentCrawlParams = {
  postId: string;
  /* possible other properties */
};
```

for example:

```typescript
type CommentCrawlParams = {
  postId: string;
  page: number;
  pageSize: number;
};
```

## Crawl

in `packages/backend/src/Components/Comment/Service/commentCrawler.ts`
`crawl` is the function that crawls the comments. It takes a `params`, which is from the previous `crawl` call.

![](./comment-crawler.drawio.svg)

You should deconstruct the parameters from `params` first, and pass the parameters to the `getCommentApi` function.

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

Example:

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

## Next Params

in `packages/backend/src/Components/Comment/Service/commentCrawler.ts`, `transformNextParams` is a function that transforms the `res` from the API call and the current `params` to the `nextParams`. If there is no next request, returns `null`.

```typescript
  private transformNextParams(
    res: any,
    params: CommentCrawlParams,
  ): CommentCrawlParams | null {
    throw new NotImplementedError('Not implemented');
  }
```

example:

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

## Transform

You should transform the data from the API call response `res` to the `IComment` type so that the comments can be saved to the database, and also return their corresponding user objects `usersRaw`.

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

example:

```typescript
  private scrapeData(
    res: any,
    postId: string,
  ): {
  infos: IComment[];
  usersRaw: unknown[];
} {
  const { data } = res;
  const infos: IComment[] = data.map((comment: any) => {
    return {
      id: comment.id,
      floorNumber: comment.floorNumber, // or -1 if not exist
      content: comment.content,
      subCommentsCount: comment.subCommentsCount,
      user: comment.user, // user id
      upvotesCount: comment.upvotesCount,
      createTime: number,
      subComments: comment.subComments, // sub comment ids
      postId,
      saveTime: dayjs().unix(),
    };
  });
  const usersRaw: unknown[] = data.map((comment: any) => comment.user);
  return {
    infos,
    usersRaw,
  };
}
```
