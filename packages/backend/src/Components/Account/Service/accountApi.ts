import { AxiosPromise } from 'axios';
import { axios, BASE_URL } from '../../../Config';

function getLoginStatusApi(cookie: string): any {
  return {
    data: {
      login: false,
      uid: '',
    },
  };
}

export { getLoginStatusApi };
