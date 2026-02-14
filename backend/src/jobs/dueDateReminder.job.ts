import cron from 'node-cron';
import prisma from '../config/database';
import notificationService from '../services/notification.service';

export function startDueDateReminderJob() {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running due date reminder job...');
    
    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Find tasks due tomorrow
      const tasksDueTomorrow = await prisma.task.findMany({
        where: {
          status: { not: 'DONE' },
          dueDate: {
            gte: now,
            lte: tomorrow,
          },
          assigneeId: { not: null },
        },
        include: {
          project: { select: { name: true } },
        },
      });
      
      // Create notifications for due soon tasks
      for (const task of tasksDueTomorrow) {
        if (task.assigneeId) {
          await notificationService.createNotification({
            userId: task.assigneeId,
            type: 'TASK_DUE_SOON',
            title: 'Task Due Tomorrow',
            message: `Task "${task.title}" in project "${task.project.name}" is due tomorrow`,
            taskId: task.id,
            projectId: task.projectId,
          });
        }
      }
      
      // Find overdue tasks
      const overdueTasks = await prisma.task.findMany({
        where: {
          status: { not: 'DONE' },
          dueDate: { lt: now },
          assigneeId: { not: null },
        },
        include: {
          project: { select: { name: true } },
        },
      });
      
      // Create notifications for overdue tasks
      for (const task of overdueTasks) {
        if (task.assigneeId) {
          // Check if notification already sent today
          const existingNotification = await prisma.notification.findFirst({
            where: {
              userId: task.assigneeId,
              taskId: task.id,
              type: 'TASK_OVERDUE',
              createdAt: { gte: new Date(now.setHours(0, 0, 0, 0)) },
            },
          });
          
          if (!existingNotification) {
            await notificationService.createNotification({
              userId: task.assigneeId,
              type: 'TASK_OVERDUE',
              title: 'Task Overdue',
              message: `Task "${task.title}" in project "${task.project.name}" is overdue`,
              taskId: task.id,
              projectId: task.projectId,
            });
          }
        }
      }
      
      console.log(`Due date reminder job completed. Processed ${tasksDueTomorrow.length} due soon, ${overdueTasks.length} overdue.`);
    } catch (error) {
      console.error('Error in due date reminder job:', error);
    }
  });
  
  console.log('Due date reminder job scheduled (daily at 9:00 AM)');
}
