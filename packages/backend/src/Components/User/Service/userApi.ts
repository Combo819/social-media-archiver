import { AxiosPromise } from 'axios';
import { crawlerAxios } from '../../../Config';
import { NotImplementedError } from '../../../Error/ErrorClass';

/**
 * this should return a promise resolved to be the userRaw object
 * to meet the format of userService.transformUserResponse parameter.
 * If not, transform it to the userRaw object in then and return it.
 * @param userId the user id
 */
function getUserInfoByIdApi(userId: string): Promise<unknown> {
  throw new NotImplementedError('getUserInfoByIdApi is not implemented');
}

/**
 * get the user id by the user name from the platform server
 * @param username unique username
 * @returns the promise resolved to the user id
 */
function getUserIdByUsernameApi(username: string): Promise<string> {
  throw new NotImplementedError('getUserIdByUsernameApi is not implemented');
}

export { getUserInfoByIdApi, getUserIdByUsernameApi };
