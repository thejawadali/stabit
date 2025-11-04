export const useHabitData = () => {
  type CustomField = {
    id: string
    title: string
    type: "text" | "number" | "select" | "boolean"
    options?: string[]
    required: boolean
  }

  type FormData = {
    name: string
    category: string
    description: string
    icon: string
    recurrenceType: "daily" | "weekly" | "monthly"
    customRecurrence: string
    timeOfDay: string
    startDate: string
    endDate: string
    initialValue: number
    difficultyRate: number
    autoGrowth: boolean
    goalValue: number
    goalMetric: string
    estimatedDate: string
    notificationsEnabled: boolean
    reminderTimes: string[]
    smartReminders: {
      missedYesterday: boolean
      streakContinuation: boolean
    }
  }

  const fetchHabit = async (habitId: string) => {
    try {
      // Replace with actual API call
      // const response = await $fetch(`/api/habits/${habitId}`)
      // return response.data
      
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockData = {
        "1": {
          name: "Daily Reading",
          category: "Learning",
          description: "Read for at least 30 minutes every day",
          icon: "📚",
          recurrenceType: "daily" as const,
          customRecurrence: "",
          timeOfDay: "20:00",
          startDate: "2024-01-01",
          endDate: "",
          initialValue: 30,
          difficultyRate: 1,
          autoGrowth: false,
          goalValue: 50,
          goalMetric: "minutes",
          estimatedDate: "2024-06-01",
          notificationsEnabled: true,
          reminderTimes: ["20:00"],
          smartReminders: {
            missedYesterday: true,
            streakContinuation: false,
          },
        },
        "2": {
          name: "Morning Run",
          category: "Health",
          description: "Run for 30 minutes every morning",
          icon: "🏃",
          recurrenceType: "daily" as const,
          customRecurrence: "",
          timeOfDay: "06:00",
          startDate: "2024-01-15",
          endDate: "",
          initialValue: 30,
          difficultyRate: 1,
          autoGrowth: false,
          goalValue: 60,
          goalMetric: "minutes",
          estimatedDate: "2024-08-01",
          notificationsEnabled: true,
          reminderTimes: ["06:00"],
          smartReminders: {
            missedYesterday: true,
            streakContinuation: true,
          },
        },
        "3": {
          name: "Meditation",
          category: "Mindfulness",
          description: "Practice mindfulness meditation",
          icon: "🧘",
          recurrenceType: "daily" as const,
          customRecurrence: "",
          timeOfDay: "07:00",
          startDate: "2024-01-01",
          endDate: "",
          initialValue: 10,
          difficultyRate: 1,
          autoGrowth: false,
          goalValue: 20,
          goalMetric: "minutes",
          estimatedDate: "2024-05-01",
          notificationsEnabled: true,
          reminderTimes: ["07:00"],
          smartReminders: {
            missedYesterday: false,
            streakContinuation: false,
          },
        }
      }
      
      return mockData[habitId as keyof typeof mockData] || null
    } catch (error) {
      console.error('Error fetching habit:', error)
      throw error
    }
  }

  const fetchHabitCustomFields = async (habitId: string): Promise<CustomField[]> => {
    try {
      // Replace with actual API call
      // const response = await $fetch(`/api/habits/${habitId}/custom-fields`)
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockCustomFields = {
        "1": [
          {
            id: "1",
            title: "Book Title",
            type: "text" as const,
            required: false
          },
          {
            id: "2",
            title: "Pages Read",
            type: "number" as const,
            required: true
          }
        ],
        "2": [
          {
            id: "1",
            title: "Distance (km)",
            type: "number" as const,
            required: true
          },
          {
            id: "2",
            title: "Weather",
            type: "select" as const,
            options: ["Sunny", "Cloudy", "Rainy", "Snowy"],
            required: false
          }
        ],
        "3": [
          {
            id: "1",
            title: "Meditation Type",
            type: "select" as const,
            options: ["Mindfulness", "Breathing", "Body Scan", "Loving Kindness"],
            required: true
          }
        ]
      }
      
      return mockCustomFields[habitId as keyof typeof mockCustomFields] || []
    } catch (error) {
      console.error('Error fetching custom fields:', error)
      throw error
    }
  }

  const updateHabit = async (habitId: string, data: FormData) => {
    try {
      // Replace with actual API call
      // const response = await $fetch(`/api/habits/${habitId}`, {
      //   method: 'PUT',
      //   body: data
      // })
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Updating habit:', habitId, data)
      return data
    } catch (error) {
      console.error('Error updating habit:', error)
      throw error
    }
  }

  const createHabit = async (data: FormData) => {
    try {
      // Replace with actual API call
      // const response = await $fetch('/api/habits', {
      //   method: 'POST',
      //   body: data
      // })
      // return response.data
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating habit:', data)
      return { ...data, id: Date.now().toString() }
    } catch (error) {
      console.error('Error creating habit:', error)
      throw error
    }
  }

  return {
    fetchHabit,
    fetchHabitCustomFields,
    updateHabit,
    createHabit
  }
}
