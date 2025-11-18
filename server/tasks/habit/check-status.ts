import { checkAndCreateMissedHabits, doIt } from '../../utils/checkMissedHabits'

export default defineTask({
  meta: {
    name: "habit:check-status",
    description: "Check the status of habits every midnight to create missed logs",
  },
  async run({ payload, context }) {
    checkAndCreateMissedHabits()
    return { result: "Habits checked successfully" };
  },
});