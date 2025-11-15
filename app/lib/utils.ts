import type { Updater } from "@tanstack/vue-table"
import type { ClassValue } from "clsx"
import type { Ref } from "vue"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
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
