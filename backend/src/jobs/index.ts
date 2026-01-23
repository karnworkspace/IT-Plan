import { startDueDateReminderJob } from './dueDateReminder.job';

export function startAllJobs() {
  startDueDateReminderJob();
  console.log('All background jobs started');
}
