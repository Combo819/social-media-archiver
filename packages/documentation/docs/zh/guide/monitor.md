# Monitor

monitor 组件用于监控平台的集合。 当一个新的帖子被添加到被监控的集合中时，monitor 组件会触发该帖子的备份。

## 类型

首先，我们需要定义集合的类型。 不同平台有许多不同类型的集合。 例如，收藏夹、稍后观看、历史记录、私信、点赞等。你需要在两个地方定义类型。
在`packages/backend/src/Components/Monitor/Types/monitorTypes.ts`  
只写你打算支持的类型。

```typescript
type CollectionTypes = 'favorite' | 'chat'; //override the types here
```

In `packages/backend/src/Components/Monitor/Service/monitorService.ts`

```typescript
private collectionTypes: CollectionTypes[] = ['chat', 'favorite']; //override the types here, keep them the same as CollectionTypes
```

## 处理方法

每种类型的集合都有一个处理方法。 处理方法将为用户添加的所有特定类型的集合执行操作。 基本上，它只是请求集合 url，在本次请求的集合下，找到新添加的 post 的 id，并将新 post 爬下来。 您可以在 `packages/backend/src/Components/Monitor/Service/monitorApi.ts` 的 `collectionHandlers` 中添加处理方法
例如：
该平台有一个名为“收藏夹”`favorite`的集合类型。 并且收藏夹网址具有这样的格式：`http://www.example.com/api/favorite/{favoriteId}`。 然后在`collectionHandlers` 中你可以为这种类型的集合定义一个处理方法。

```typescript
const collectionHandlers: {
  [key in CollectionTypes]?: (
    collection: MonitorCollection,
  ) => Promise<string[]>;
} = {
  favorite: async (collection: MonitorCollection) => {
    const url = collection.url;
    const id = getUrlLastSegment(url);

    const { data } = await crawlerAxios.get(`api/favorite/${id}`);
    return data.map((post: any) => String(post.id));
  },
};
```

用户将添加一些收藏夹的 url，然后处理方法会定期地请求这些收藏夹的 url，当发现有新的 post 时，就会触发爬虫，把新的 post 爬到数据库中。
