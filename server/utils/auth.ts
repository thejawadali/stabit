// TODO: Replace this with your new auth system's user type
export interface AuthUser {
  id: string // User ID (replaces user.sub from Supabase)
  email?: string
  name?: string
  // Add other user properties as needed
}

// Helper function to get user from event context
export function getUserFromEvent(event: any): AuthUser | null {
  return event.context.user || null
}

// Helper function to require authentication (throws if no user)
export function requireAuth(event: any): AuthUser {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  return user
}

