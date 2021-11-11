import { crawlerAxios } from '../../../Config';
import { NotImplementedError } from '../../../Error/ErrorClass';

function getUserInfoByIdApi(userId: string) {
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
