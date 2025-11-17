import type { ClassValue } from "clsx"
import type { Ref } from "vue"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(advancedFormat);
dayjs.extend(weekday);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends any>(updaterOrValue: T, ref: Ref) {
  ref.value
    = typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

export function formatTime(timeString: string | undefined): string {
  if (!timeString) return ''
  
  const parts = timeString.split(':')
  if (parts.length !== 2) return timeString
  
  const hours = Number(parts[0])
  const minutes = Number(parts[1])
  
  if (isNaN(hours) || isNaN(minutes)) return timeString
  
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}


export function formatSmartDate(date: string | Date) {
  const d = dayjs(date);
  const now = dayjs();

  // 🔥 If it's in the past, return fixed text
  if (d.isBefore(now)) {
    return "Throughout the day";
  }

  // 1. Today
  if (d.isSame(now, "day")) {
    return `Today, ${d.format("h:mm A")}`;
  }

  // 2. Tomorrow
  if (d.isSame(now.add(1, "day"), "day")) {
    return `Tomorrow, ${d.format("h:mm A")}`;
  }

  // 3. Within next 7 days (future)
  if (d.diff(now, "day") < 7) {
    return `${d.format("dddd")}, ${d.format("h:mm A")}`;
  }

  // 4. Outside week
  return d.format("D MMM, h:mm A");
}
