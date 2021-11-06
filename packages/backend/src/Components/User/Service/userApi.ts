import { crawlerAxios } from '../../../Config';

function getUserInfoByIdApi(userId: string) {
  return crawlerAxios({});
}

/**
 * get the user id by the user name from the platform server
 * @param username unique username
 * @returns the promise resolved to the user id
 */
function getUserIdByUsernameApi(username: string): Promise<string> {}

export { getUserInfoByIdApi, getUserIdByUsernameApi };
