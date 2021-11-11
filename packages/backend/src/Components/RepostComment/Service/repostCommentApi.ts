import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';

/**
 *
 */
function getRepostCommentApi(): AxiosPromise {
  throw new NotImplementedError('getRepostCommentApi is not implemented');
}

export { getRepostCommentApi };
