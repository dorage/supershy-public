import { Cron, CronOptions } from 'croner';

const schedule = (options: {
  quartz: {
    [key in NodeJS.ProcessEnv['MODE']]?: string;
  };
  func: Function;
  options?: CronOptions;
}) => Cron(options.quartz[process.env.MODE]!, options.func, options.options);

const CronHelper = { schedule };

export default CronHelper;
