import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';
function getPostApi(postId: string): AxiosPromise {
  throw new NotImplementedError('getPostApi is not implemented');
}

export { getPostApi };
