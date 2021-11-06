import {
  collectionPath,
  MAX_MONITOR_COLLECTION,
  Q_PRIORITY,
} from '../../../Config';
import { asyncPriorityQueuePush } from '../../../Jobs/Queue';
import { CollectionTypes, IMonitorService, MonitorCollection } from '../Types';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IPostService, POST_IOC_SYMBOLS } from '../../Post/Types';
import _ from 'lodash';
import { collectionHandlers } from './monitorApi';
import { readJson, writeJson } from '../../../Utility/json';
import { logger } from '../../../Logger';

@injectable()
export class MonitorService implements IMonitorService {
  private monitorCollections: MonitorCollection[] = [];
  private postService: IPostService;
  private maxCollectionSize = MAX_MONITOR_COLLECTION;
  private collectionTypes: CollectionTypes[] = ['chat', 'favorite'];

  constructor(
    @inject(POST_IOC_SYMBOLS.IPostService) postService: IPostService,
  ) {
    this.postService = postService;
  }

  private saveToJson() {
    return writeJson(collectionPath, {
      monitorCollections: this.monitorCollections.map(
        (collection: MonitorCollection) => {
          return _.pick(collection, ['url', 'type']);
        },
      ),
    });
  }

  async loadFromJson() {
    const json: any = await readJson(collectionPath);
    if (json && json.monitorCollections) {
      this.monitorCollections = _.take(
        json.monitorCollections,
        this.maxCollectionSize,
      ).map((collection: any) => {
        return {
          url: collection.url,
          type: collection.type,
          postIds: new Set(),
        } as MonitorCollection;
      });
    } else {
      this.monitorCollections = [];
    }
  }

  getHandler(
    collectionType: CollectionTypes,
  ): (collection: MonitorCollection) => Promise<string[]> {
    const handler = collectionHandlers[collectionType];
    if (!_.isFunction(handler)) {
      throw new Error(`no handler for ${collectionType}`);
    }
    return handler;
  }

  proceed = () => {
    this.monitorCollections.forEach(async (collection: MonitorCollection) => {
      const handler = this.getHandler(collection.type);

      const newPostIds = await asyncPriorityQueuePush(
        handler,
        collection,
        Q_PRIORITY.FETCH_COLLECTION,
      );

      const postIds = collection.postIds;
      const logMessage = `Collection ${collection.url}: ${newPostIds.join(
        ', ',
      )}`;
      logger.info(logMessage);
      newPostIds.forEach((postId) => {
        if (!postIds.has(postId)) {
          this.postService.startCrawling(postId);
        }
        postIds.add(postId);
      });
    });
  }

  add(collectionUrl: string, collectionType: CollectionTypes): boolean {
    if (this.monitorCollections.length >= this.maxCollectionSize) {
      return false;
    }
    if (
      this.monitorCollections.find(
        (monitorCollection: MonitorCollection) =>
          monitorCollection.url === collectionUrl,
      )
    ) {
      return false;
    }
    this.monitorCollections.push({
      url: collectionUrl,
      type: collectionType,
      postIds: new Set(),
    });
    this.saveToJson();
    return true;
  }

  remove(collectionUrl: string): boolean {
    const collectionIndex = this.monitorCollections.findIndex(
      (monitorCollection: MonitorCollection) =>
        monitorCollection.url === collectionUrl,
    );
    if (collectionIndex === -1) {
      return false;
    }
    this.monitorCollections.splice(collectionIndex, 1);
    this.saveToJson();
    return true;
  }

  async validate(
    collectionUrl: string,
    collectionType: CollectionTypes,
  ): Promise<boolean> {
    try {
      const handler = this.getHandler(collectionType);
      const collection: MonitorCollection = {
        url: collectionUrl,
        type: collectionType,
        postIds: new Set(),
      };
      const postIds = await handler(collection);
      return _.isArray(postIds) && _.every(postIds, _.isString);
    } catch (e) {
      return false;
    }
  }

  getCollectionTypes(): CollectionTypes[] {
    return this.collectionTypes;
  }

  getMonitorCollections(): MonitorCollection[] {
    return this.monitorCollections;
  }

  getMaxCollectionSize(): number {
    return this.maxCollectionSize;
  }
}
