import _ from 'lodash';

/**
 * hide part of the sensitive string
 * @param str sensitive string
 * @param keep keep the n trailing digits
 * @returns a partially hidden string
 */
const hideString = (str: string, keep: number) => {
  const len: number = str.length;
  if (len <= keep) {
    return '*'.repeat(len);
  }
  const showString: string = str.slice(len - keep);
  return '*'.repeat(len - keep) + showString;
};

export { hideString };
