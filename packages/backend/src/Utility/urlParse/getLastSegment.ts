import { URL } from 'url';

function getUrlLastSegment(url: string) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const pathnameArray = pathname.split('/');
  const lastSegment = pathnameArray[pathnameArray.length - 1];
  return lastSegment;
}

export { getUrlLastSegment };
