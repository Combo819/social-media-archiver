import { BASE_URL } from '../../Api/config';
const getImageUrl = (fileName: string): string => {
  return `${BASE_URL}/images/${fileName}`;
};

export { getImageUrl };
