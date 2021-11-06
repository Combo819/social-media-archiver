import { axios } from './config';

export function importData(
  data: FormData,
  type: 'post' | 'user' | 'comment' | 'subComment' | 'repostComment',
) {
  return axios({
    method: 'post',
    url: `/${type}/import`,
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
