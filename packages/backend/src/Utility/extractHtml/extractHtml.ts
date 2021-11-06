import cheerio from 'cheerio';
import _ from 'lodash';
import { getUrlLastSegment } from '../urlParse';

/**
 * extract the target html from the clean html, replace the image src to the local path.
 * return the target html and the image original urls
 * @param cleanHtml
 * @returns
 */
const extractHtml = (
  cleanHtml: string,
  imageUrlSkip?: (url: string) => boolean,
): { html: string; embedImages: string[] } => {
  const $ = cheerio.load(cleanHtml);
  const embedImages: string[] = [];
  $('img').each(function (index: number, element: any) {
    const oldSrc = $(element).attr('src');
    if (oldSrc) {
      if (_.isFunction(imageUrlSkip) && imageUrlSkip(oldSrc)) return true; // skip this image
      const fileName: string = getUrlLastSegment(oldSrc);
      const newSrc = '/images/' + fileName;
      $(element).attr('src', newSrc);
      embedImages.push(oldSrc);
    }
  });
  return {
    html: $.html(),
    embedImages,
  };
};

export { extractHtml };
