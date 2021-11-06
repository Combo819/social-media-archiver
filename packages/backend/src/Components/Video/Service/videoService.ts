import { injectable } from 'inversify';
import 'reflect-metadata';
import { IVideoService, ParamsQueue } from '../Types';
import { downloadVideoApi } from './videoApi';
import fs from 'fs';
import path from 'path';
import { asyncPriorityQueuePush, QueueTask } from '../../../Jobs/Queue';
import { Q_PRIORITY, staticPath } from '../../../Config';
import { ResourceError } from '../../../Error/ErrorClass';
import { getUrlLastSegment } from '../../../Utility/urlParse';

@injectable()
class VideoService implements IVideoService {
  downloadVideo(videoUrl: string) {
    const params: ParamsQueue = {
      url: videoUrl,
      staticPath,
    };

    asyncPriorityQueuePush(
      this.videoQueueFunc,
      params,
      Q_PRIORITY.DOWNLOAD_VIDEO,
    ).catch((error) => {
      throw new ResourceError(
        `Failed to fetch video ${videoUrl}:${error.response?.status}`,
      );
    });
  }

  private videoQueueFunc(queueParams: ParamsQueue): Promise<any> {
    const { url, staticPath } = queueParams;
    return new Promise((resolve, reject) => {
      downloadVideoApi(url)
        .then((res) => {
          const { data } = res;
          if (!fs.existsSync(path.resolve(staticPath, 'videos'))) {
            fs.mkdirSync(path.resolve(staticPath, 'videos'));
          }
          const writer = fs.createWriteStream(
            path.resolve(staticPath, 'videos', getUrlLastSegment(url)),
          );
          data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        })
        .catch(reject);
    });
  }
}

export { VideoService };
