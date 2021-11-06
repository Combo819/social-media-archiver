import { CronJob } from 'cron';

/**
 *
 * @param cronCommand the function to be executed in the cron
 * @param interval the interval of the cronjob in seconds
 * @returns
 */
const startCronJob = (cronCommand: () => any, interval: number) => {
  const job = new CronJob(
    `*/${interval} * * * * *`,
    cronCommand,
    null,
    true,
    'America/New_York',
  );

  return job;
};

export { startCronJob };
