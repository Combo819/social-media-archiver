# Monitor

The monitor component is used to monitor the collection of the platform. When a new post is added to the monitored collection, the monitor component will trigger the backing up of the post.

## Types

First, we need to define the types of the collection. There are many different types of collections in different platforms. For example, favorite, watchLater, history, chat, like, etc. You should define the types in two different places.
In `packages/backend/src/Components/Monitor/Types/monitorTypes.ts`

```typescript
type CollectionTypes = 'favorite' | 'chat'; //override the types here
```

In `packages/backend/src/Components/Monitor/Service/monitorService.ts`

```typescript
private collectionTypes: CollectionTypes[] = ['chat', 'favorite']; //override the types here, keep them the same as CollectionTypes
```

## Handler

Each type of collection has a handler. The handler will do things for all the specific type of collections added by user. Basically, it just request the collection url, get the last post id, and archive the new posts. You should add handler in `collectionHandlers` in `packages/backend/src/Components/Monitor/Service/monitorApi.ts`
For example:  
The platform has a collection type called `favorite`. And the favorite collection url has such format: `http://www.example.com/api/favorite/{favoriteId}`. Then in `collectionHandlers` you can define a handler for this type of collection.

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

The user will add some favorite url, and then the `favorite` handler will trigger archiving of the posts that new added into the `favorite` collection.
