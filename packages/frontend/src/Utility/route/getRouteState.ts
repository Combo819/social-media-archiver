import _ from 'lodash';
import { HomeState, PostContentState } from '../../Store/reducers/routeState';

/**
 * generate the new home state based on the query string. You will update this returned state to redux
 * @param {string} search the query string in url
 * @param {HomeState} oldState  old home state in redux
 * @param {string} postId
 * @returns {HomeState}
 */
const getNewHomeState = (
  search: string,
  oldState: HomeState,
  postId: String,
): HomeState => {
  const searchParams = new URLSearchParams(search);
  const state: any = _.cloneDeep(oldState);
  searchParams.forEach((value: any, key: any) => {
    if (!value) {
      return false;
    }
    const strings = [
      'page',
      'pageSize',
      'content',
      'orderBy',
      'orderType',
      'id',
    ];
    let decodedValue = decodeURIComponent(value);
    const arr = ['users', 'createdAt', 'saveTime'];
    if (strings.includes(key)) {
      state[key] = decodedValue;
    }
    if (arr.includes(key)) {
      state[key] = JSON.parse(decodedValue);
    }
  });
  state['id'] = postId;
  return state;
};

const getNewPostContentState = (
  search: string,
  oldState: PostContentState,
  postId: string,
) => {
  const searchParams = new URLSearchParams(search);
  const state: any = _.cloneDeep(oldState);
  searchParams.forEach((value: any, key: any) => {
    if (!value) {
      return false;
    }
    let decodedValue = decodeURIComponent(value);
    state[key] = decodedValue;
  });
  state['id'] = postId;
  return state;
};

export { getNewHomeState, getNewPostContentState };
