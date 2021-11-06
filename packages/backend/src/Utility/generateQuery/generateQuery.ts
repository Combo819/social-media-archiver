import { MangoQuery, MangoQuerySelector } from 'rxdb';

function generateQuery(
  page: number,
  pageSize: number,
  orderBy: string,
  orderType: 'asc' | 'desc',
  createdAt: number[],
  saveTime: number[],
  users: string[],
  text: string,
) {
  const selector: MangoQuerySelector = {};
  const query: MangoQuery = { selector };

  if (!page) {
    page = 0;
  }
  if (!pageSize) {
    pageSize = 10;
  }
  query.skip = page * pageSize;
  query.limit = pageSize;

  if (orderBy) {
    query.sort = [{ [orderBy]: orderType === 'asc' ? 'asc' : 'desc' }];
  }

  if (createdAt.length === 1) {
    selector.createdAt = { $gt: createdAt[0] };
  }
  if (createdAt.length === 2) {
    selector.createdAt = { $gte: createdAt[0], $lte: createdAt[1] };
  }

  if (saveTime.length === 1) {
    selector.saveTime = { $gt: saveTime[0] };
  }
  if (saveTime.length === 2) {
    selector.saveTime = { $gte: saveTime[0], $lte: saveTime[1] };
  }

  if (users.length > 0) {
    selector.user = { $in: users };
  }

  if (text) {
    selector.text = { $regex: text };
  }

  return query;
}

export { generateQuery };
