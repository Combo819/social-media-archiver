import { axios } from './config';
import { AxiosPromise } from 'axios';

function getUsersByNameApi(username: string): AxiosPromise<any> {
  return axios({
    url: '/user',
    params: { username },
  });
}

export { getUsersByNameApi };
