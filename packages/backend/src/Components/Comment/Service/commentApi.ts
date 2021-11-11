import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';

/**
 * get a batch of comments
 */
function getCommentApi(): AxiosPromise {
  /* axios config here */
  throw new NotImplementedError('getCommentApi is not implemented');
}

export { getCommentApi };
