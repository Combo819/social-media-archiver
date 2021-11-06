import { axios } from './config';
import { AxiosPromise } from 'axios';
import { IComment } from '../types';
/**
 * get comments from postId
 * @param postId the comments are under this postId
 * @param page
 * @param pageSize
 */
function getCommentsApi(
  postId: string,
  queryString: string,
): AxiosPromise<{ comments: IComment[]; totalNumber: number }> {
  return axios({
    url: `/comment${queryString}`,
    params: { postId },
  });
}

function getRepostCommentsApi(repostedId: string, queryString: string) {
  return axios({
    url: `/repostComment${queryString}`,
    params: { repostedId },
  });
}

function getSingleCommentApi(
  commentId: string,
): AxiosPromise<{ result: IComment }> {
  return axios({
    url: `/comment/${commentId}`,
  });
}

function getSubCommentsApi(commentId: string, queryString: string) {
  return axios({
    url: `/subComment${queryString}`,
    params: { commentId },
  });
}

export {
  getCommentsApi,
  getSingleCommentApi,
  getSubCommentsApi,
  getRepostCommentsApi,
};
