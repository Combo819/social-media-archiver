import { AxiosPromise } from 'axios';
import { IUser } from '../types';
import { axios } from './config';

function getAccountProfileApi(): AxiosPromise<{ result: IUser }> {
  return axios({
    url: '/account/profile',
  });
}

function getCookieApi(): AxiosPromise<{ result: string }> {
  return axios({
    url: '/account/cookie',
  });
}

function validateCookieApi(cookie: string): AxiosPromise<{ result: boolean }> {
  return axios({
    url: '/account/cookie/validate',
    method: 'post',
    data: { cookie },
  });
}

function setCookieApi(cookie: string): AxiosPromise<any> {
  return axios({
    url: '/account/cookie',
    method: 'post',
    data: { cookie },
  });
}
export { getAccountProfileApi, getCookieApi, validateCookieApi, setCookieApi };
