//defined the collection types like 'favorite' | 'watchLater' | 'chat' | 'history' | 'upvote'
type CollectionTypes = 'favorite' | 'chat';

type MonitorCollection = {
  url: string;
  type: CollectionTypes;
  postIds: Set<string>;
  [key: string]: any;
};

interface IMonitorService {
  //interface for collection service
  loadFromJson(): void;
  getHandler(
    collectionType: CollectionTypes,
  ): (collection: MonitorCollection) => Promise<string[]>;
  proceed(): void;
  add(collectionUrl: string, collectionType: CollectionTypes): boolean;
  remove(collectionUrl: string): boolean;
  validate(
    collectionUrl: string,
    collectionType: CollectionTypes,
  ): Promise<boolean>;
  getCollectionTypes(): CollectionTypes[];
  getMonitorCollections(): MonitorCollection[];
  getMaxCollectionSize(): number;
}

export { CollectionTypes, IMonitorService, MonitorCollection };
