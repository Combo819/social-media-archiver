import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';

function getSubCommentApi(): AxiosPromise {
  return crawlerAxios({});
}

export { getSubCommentApi };
