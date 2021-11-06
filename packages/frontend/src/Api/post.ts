import { axios } from './config';
import { AxiosPromise } from 'axios';
import { IPost } from '../types';
function getPostsApi(
  queryString: string,
): AxiosPromise<{ post: IPost[]; totalNumber: number }> {
  return axios({
    url: `/post${queryString}`,
  });
}

/**
 * get a single post with comments by postId
 * @param postId the comments are under this postId
 * @param page page of comments
 * @param pageSize comments each page
 */
function getSinglePostApi(
  postId: string,
  page: number,
  pageSize: number,
): AxiosPromise<{ post: IPost; totalNumber: number }> {
  return axios({
    url: `/post/${postId}`,
    params: { page: page - 1, pageSize },
  });
}

function savePostApi(postIdUrl: string): AxiosPromise {
  return axios({
    method: 'post',
    url: `/post`,
    data: { postIdUrl },
  });
}

function deletePostApi(postId: string): AxiosPromise<{ result: boolean }> {
  return axios({
    method: 'delete',
    url: `/post/${postId}`,
  });
}

export { getPostsApi, getSinglePostApi, savePostApi, deletePostApi };
