import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';

/**
 * get a batch of comments
 */
function getCommentApi(): AxiosPromise {
  return crawlerAxios({
    /* axios config here */
  });
}

export { getCommentApi };
