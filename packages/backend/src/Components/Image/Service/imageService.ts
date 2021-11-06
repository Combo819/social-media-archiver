import { injectable } from 'inversify';
import 'reflect-metadata';
import { ParamsQueue, ImageServiceInterface } from '../Types';
import { downloadImageApi } from './imageApi';
import fs from 'fs';
import path from 'path';
import { asyncPriorityQueuePush } from '../../../Jobs/Queue';
import { Q_PRIORITY, staticPath } from '../../../Config';
import { ResourceError } from '../../../Error/ErrorClass';
import { getUrlLastSegment } from '../../../Utility/urlParse';

@injectable()
class ImageService implements ImageServiceInterface {
  downloadImage(imageUrl: string, priority?: number) {
    if (!priority) {
      priority = Q_PRIORITY.DOWNLOAD_IMAGE;
    }
    const params: ParamsQueue = {
      url: imageUrl,
      staticPath,
    };

    asyncPriorityQueuePush(this.imageQueueFunc, params, priority).catch(
      (error) => {
        throw new ResourceError(`Failed to fetch image ${imageUrl}:${error}`);
      },
    );
  }
  private imageQueueFunc(queueParams: ParamsQueue): Promise<any> {
    const { url, staticPath } = queueParams;
    return new Promise((resolve, reject) => {
      downloadImageApi(url)
        .then((res) => {
          const { data } = res;
          if (!fs.existsSync(path.resolve(staticPath, 'images'))) {
            fs.mkdirSync(path.resolve(staticPath, 'images'));
          }
          const writer = fs.createWriteStream(
            path.resolve(staticPath, 'images', getUrlLastSegment(url)),
          );

          data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', (err) => {
            reject(err);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export { ImageService };
