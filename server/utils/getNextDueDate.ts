import { Frequency } from '@prisma/client'

/**
 * Calculate next due date based on habit frequency
 */
function calculateNextDueDate(frequency: Frequency, currentDate: Date = new Date()): Date {
  const nextDate = new Date(currentDate)
  
  switch (frequency) {
    case Frequency.daily:
      nextDate.setDate(nextDate.getDate() + 1)
      break
    case Frequency.weekly:
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case Frequency.monthly:
      nextDate.setMonth(nextDate.getMonth() + 1)
      break
    default:
      nextDate.setDate(nextDate.getDate() + 1)
  }
  
  return nextDate
}

export default calculateNextDueDate