import async, { AsyncPriorityQueue } from 'async';
import { MAX_ITEM_WINDOW, Q_CONCURRENCY } from '../../Config';
import { TimeWindow } from './timeWindow';
const { priorityQueue } = async;

interface QueueTask<Params, ReturnType> {
  params: Params;
  handler(params: Params): Promise<ReturnType>;
}

const worker = (task: QueueTask<unknown, unknown>, callback: any): void => {
  timeWindow.execute();
  const { params, handler } = task;
  handler(params)
    .then((res: any) => {
      callback(null, res);
    })
    .catch((err: Error) => {
      callback(err);
    });
};

/**
 * https://caolan.github.io/async/v3/docs.html#priorityQueue
 */
const pq: AsyncPriorityQueue<QueueTask<unknown, unknown>> = priorityQueue(
  worker,
  Q_CONCURRENCY,
);

const timeWindow = new TimeWindow(pq, 30, MAX_ITEM_WINDOW);

/**
 * push a task into the async priority queue
 * @param handler an async function to be executed in the priority queue
 * @param params the params object that the handler will take
 * @param priority
 * @returns a promise that will be resolved when the handler is resolved, or be rejected when the handler reject an error.
 */
function asyncPriorityQueuePush<Params, ReturnType>(
  handler: (params: Params) => Promise<ReturnType>,
  params: Params,
  priority: number,
): Promise<ReturnType> {
  return new Promise((resolve, reject) => {
    const task = {
      handler,
      params,
    };
    pq.push(task, priority, (err: Error | null | undefined, result: any) => {
      // this callback function will be called after the `callback` in worker is called?
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export { asyncPriorityQueuePush, QueueTask };
