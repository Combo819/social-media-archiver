import _ from "lodash";

export const parseFollowersCount = (countStr: string) => {
  if(_.isNumber(countStr)) return countStr;
  let base: number = 1;
  if (countStr.includes('万')) {
    base = 10 ** 4;
  }
  if (countStr.includes('亿')) {
    base = 10 ** 8;
  }

  return parseFloat(countStr) * base;
};
