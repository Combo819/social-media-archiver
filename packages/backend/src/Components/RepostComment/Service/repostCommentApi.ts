import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';

/**
 *
 */
function getRepostCommentApi(): AxiosPromise {
  return crawlerAxios({});
}

export { getRepostCommentApi };
