import _ from 'lodash';
import { URL, URLSearchParams } from 'url';
import { crawlerAxios } from '../../../Config';
import { CollectionTypes, MonitorCollection } from '../Types';

const collectionHandlers: {
  [key in CollectionTypes]?: (
    collection: MonitorCollection,
  ) => Promise<string[]>;
} = {};

export { collectionHandlers };
