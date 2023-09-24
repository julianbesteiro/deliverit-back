import { CronJob } from 'cron';
import User from '../models/User';

//Schedule a task to run every day at 12am

export const resetUserEnabledStatus = new CronJob('0 0 0 * * *', async () => {
  try {
    await User.updateMany({}, { enabled: false });
    console.log("Reset user's enabled status successfully");
  } catch (error) {
    console.error("Error resetting user's enabled status");
  }
});
