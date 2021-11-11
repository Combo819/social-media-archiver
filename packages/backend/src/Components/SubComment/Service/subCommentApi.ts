import { crawlerAxios } from '../../../Config';
import { AxiosPromise } from 'axios';
import { NotImplementedError } from '../../../Error/ErrorClass';

function getSubCommentApi(): AxiosPromise {
  throw new NotImplementedError('getSubCommentApi is not implemented');
}

export { getSubCommentApi };
