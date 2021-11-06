const BASE_URL: string = '';

const Q_CONCURRENCY: number = 1;

//small number has higher priority
const Q_PRIORITY = {
  CRAWLER_POST: 1,
  DOWNLOAD_VIDEO: 2,
  DOWNLOAD_POST_IMAGE: 2,
  FETCH_MESSAGE: 2,
  FETCH_COLLECTION: 2,
  SEND_MESSAGE: 2, //send message is not implemented
  CRAWLER_COMMENT: 3,
  CRAWLER_SUB_COMMENT: 3,
  CRAWLER_REPOST_COMMENT: 3,
  DOWNLOAD_IMAGE: 3, //download other images, like avatar
};

const MAX_MONITOR_COLLECTION = 5;

const PORT = 5000;

const MONITOR_INTERVAL: number = 120; //in second

export {
  BASE_URL,
  Q_CONCURRENCY,
  Q_PRIORITY,
  MAX_MONITOR_COLLECTION,
  PORT,
  MONITOR_INTERVAL,
};
