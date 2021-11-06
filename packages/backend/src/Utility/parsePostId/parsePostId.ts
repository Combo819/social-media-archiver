import isUrl from 'is-url';
import cheerio from 'cheerio';
import { URL } from 'url';
import _ from 'lodash';
import { BadRequestError, NotImplementedError } from '../../Error/ErrorClass';

/**
 * get post id from url
 * @param urlStr possible post url
 * @returns the post id, if it's not a valid post url, return empty string ""
 */
export async function parsePostId(urlStr: string): Promise<string> {
  //if the string contains only digits, then it's a post id
  /* take in the urlStr, return the  */
  throw new NotImplementedError('parsePostId not implemented yet');
}
