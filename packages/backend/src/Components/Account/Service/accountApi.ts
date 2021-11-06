import { AxiosPromise } from 'axios';
import { axios, BASE_URL } from '../../../Config';
import { LoginStatusApi } from '../Types';

function getLoginStatusApi(cookie: string): AxiosPromise<LoginStatusApi> {
  return axios({
    url: BASE_URL + '/api/config',
    headers: { cookie },
  });
}

export { getLoginStatusApi };
