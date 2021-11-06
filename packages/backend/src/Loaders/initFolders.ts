import { staticPath, rxdbBasePath, logFolderPath } from '../Config';
import { logger } from '../Logger';
const fs = require('fs');

function initFolders() {
  if (!fs.existsSync(staticPath)) {
    logger.info('creating folder ' + staticPath);
    fs.mkdirSync(staticPath, { recursive: true });
  }

  if (!fs.existsSync(rxdbBasePath)) {
    logger.info('creating folder ' + rxdbBasePath);
    fs.mkdirSync(rxdbBasePath, { recursive: true });
  }
}

export { initFolders };
