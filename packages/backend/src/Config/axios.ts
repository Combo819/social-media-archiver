import axios, { AxiosInstance } from 'axios';
import {
  IAccountService,
  ACCOUNT_IOC_SYMBOLS,
} from '../Components/Account/Types';
import { BASE_URL } from './';
import { container } from './inversify.config';

interface Headers {
  'User-Agent': String;
}

interface DownloadHeader {
  'User-Agent': string;
}

const header: Headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
};

const downloadHeader: DownloadHeader = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
};

const crawlerAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  //headers: header,
});

const downloadAxios: AxiosInstance = axios.create({
  //headers:downloadHeader,
});

[crawlerAxios, downloadAxios].forEach((item: AxiosInstance) => {
  item.interceptors.request.use((request) => {
    const accountService = container.get<IAccountService>(
      ACCOUNT_IOC_SYMBOLS.IAccountService,
    );
    if (accountService.getMode() === 'cookie') {
      request.headers['cookie'] = accountService.getCookie();
    }
    return request;
  });
});

export { crawlerAxios, downloadAxios, axios };
