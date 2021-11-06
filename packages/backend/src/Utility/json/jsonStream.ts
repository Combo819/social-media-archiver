import Batch from 'stream-json/utils/Batch';
import StreamArray from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';
import { Writable } from 'stream';
import fs from 'fs';

/**
 * https://stackoverflow.com/questions/42896447/parse-large-json-file-in-nodejs-and-handle-each-object-independently
 * Read json stream from local file and pass a batch of records to the worker function
 * @param jsonPath the local json file path
 * @param batchSize
 * @param worker
 * @returns
 */
function processJsonAsStream<T>(
  jsonPath: string,
  batchSize: number,
  worker: (value: any[]) => Promise<any>,
) {
  return new Promise((res, rej) => {
    const processingStream = new Writable({
      write(value: { key: string; value: T }[], encoding, callback) {
        //Save to mongo or do any other async actions
        worker(value).then(callback).catch(callback);
      },
      //Don't skip this, as we need to operate with objects, not buffers
      objectMode: true,
    });

    const pipeline = chain([
      fs.createReadStream(jsonPath),
      StreamArray.withParser(),
      new Batch({ batchSize }),
      processingStream,
    ]);

    pipeline.on('end', res);

    pipeline.on('error', rej);
  });
}

export { processJsonAsStream };
