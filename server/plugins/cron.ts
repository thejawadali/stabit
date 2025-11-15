// import cron from 'node-cron'
// import { checkAndCreateMissedHabits } from '../utils/checkMissedHabits'

// /**
//  * Server plugin that sets up cron job to check for missed habits
//  * Runs every day at 12:00 AM (midnight)
//  */
export default defineNitroPlugin(() => {
//   // Schedule task to run every day at midnight (00:00)
//   // Cron expression: '0 0 * * *' means:
//   // - 0 minutes
//   // - 0 hours (midnight)
//   // - * any day of month
//   // - * any month
//   // - * any day of week
//   cron.schedule('0 0 * * *', async () => {
//     console.log('Running scheduled task: Checking for missed habits at', new Date().toISOString())
//     try {
//       await checkAndCreateMissedHabits()
//     } catch (error) {
//       console.error('Error in scheduled task for missed habits:', error)
//     }
//   })

//   console.log('Cron job scheduled: Checking for missed habits daily at 12:00 AM')
})

