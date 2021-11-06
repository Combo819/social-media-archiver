import { axios } from './config';
import { AxiosPromise } from 'axios';

type MonitorCollection = {
  url: string;
  type: string;
};

function validateCollectionApi(
  collectionUrl: string,
  type: string,
): AxiosPromise<boolean> {
  return axios({
    url: '/monitor/validate',
    method: 'POST',
    data: {
      url: collectionUrl,
      type,
    },
  });
}

function addCollectionApi(
  collectionUrl: string,
  type: string,
): AxiosPromise<boolean> {
  return axios({
    url: '/monitor',
    method: 'POST',
    data: {
      url: collectionUrl,
      type,
    },
  });
}

function removeCollectionApi(collectionUrl: string): AxiosPromise<boolean> {
  return axios({
    url: '/monitor',
    method: 'DELETE',
    data: {
      url: collectionUrl,
    },
  });
}

function getCollectionsApi(): AxiosPromise<MonitorCollection[]> {
  return axios({
    method: 'GET',
    url: '/monitor',
  });
}

function getCollectionTypesApi(): AxiosPromise<string[]> {
  return axios({
    method: 'GET',
    url: '/monitor/types',
  });
}

export {
  validateCollectionApi,
  addCollectionApi,
  removeCollectionApi,
  getCollectionsApi,
  getCollectionTypesApi,
};
