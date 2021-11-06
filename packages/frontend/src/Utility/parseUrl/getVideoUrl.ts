import _ from 'lodash';
import { BASE_URL } from '../../Api/config';
const getVideoUrl = (fileName:string): string => {
  return `${BASE_URL}/videos/${fileName}`;
};

export { getVideoUrl };
