export const PREDEFINED_METRICS = [
  { value: 'sessions', label: 'Sessions' },
  { value: 'days', label: 'Days' },
  { value: 'hours', label: 'Hours' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'repetitions', label: 'Repetitions' },
  { value: 'pages', label: 'Pages' },
  { value: 'miles', label: 'Miles' },
  { value: 'custom', label: 'Custom' }
] as const

export const PREDEFINED_METRIC_VALUES = PREDEFINED_METRICS.map(m => m.value)

/**
 * Check if a goal metric is a custom value (not in predefined list)
 */
export function isCustomGoalMetric(goalMetric: string | undefined | null): boolean {
  if (!goalMetric) return false
  return !PREDEFINED_METRIC_VALUES.includes(goalMetric as any)
}

/**
 * Prepare goal metric for API submission
 * If goalMetric is 'custom', replace it with customGoalMetric value
 * Returns the final goalMetric value to send to API
 */
export function prepareGoalMetricForApi(goalMetric: string, customGoalMetric?: string): string {
  if (goalMetric === 'custom' && customGoalMetric?.trim()) {
    return customGoalMetric.trim()
  }
  return goalMetric
}

/**
 * Parse goal metric from API response
 * If goalMetric is not in predefined list, return { goalMetric: 'custom', customGoalMetric: originalValue }
 * Otherwise return { goalMetric: originalValue, customGoalMetric: '' }
 */
export function parseGoalMetricFromApi(goalMetric: string | undefined | null): {
  goalMetric: string
  customGoalMetric: string
} {
  if (!goalMetric) {
    return { goalMetric: 'sessions', customGoalMetric: '' }
  }

  if (isCustomGoalMetric(goalMetric)) {
    return {
      goalMetric: 'custom',
      customGoalMetric: goalMetric
    }
  }

  return {
    goalMetric,
    customGoalMetric: ''
  }
}

