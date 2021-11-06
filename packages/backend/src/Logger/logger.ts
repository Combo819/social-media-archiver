import path from 'path';
import pino from 'pino';
import { logFolderPath } from '../Config';
import pretty from 'pino-pretty';

const logFilePath: string = path.resolve(
  logFolderPath,
  'social-media-archiver.log',
);
const fs = require('fs');
if (!fs.existsSync(logFolderPath)) {
  console.log('creating log folder ' + logFolderPath);
  fs.mkdirSync(logFolderPath, { recursive: true });
}

const streams: any[] = [{ stream: fs.createWriteStream(logFilePath) }];

if (process.env.NODE_ENV === 'development') {
  streams.push({
    stream: pretty({}),
  });
}

var logger = pino(
  {
    level: 'debug', // this MUST be set at the lowest level of the
    // destinations
  },
  pino.multistream(streams, {}),
);

export { logger };
