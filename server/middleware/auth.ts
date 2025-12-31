import type { AuthUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const { node } = event;
  const url = node.req.url || '';
  
  // If path does *not* start with /api/, skip the auth check
  if (!url.startsWith('/api/')) {
    return;   // do nothing, allow route to proceed
  }

  // Skip auth check for auth endpoints
  if (url.startsWith('/api/auth/')) {
    return;
  }

  // TODO: Replace with your new auth system's user verification
  // Example: Get user from session/token
  const user = await getUserFromRequest(event); // Replace with your auth function
  
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  
  // Attach user to event context for use in API routes
  event.context.user = user;
});

// TODO: Implement this function based on your new auth system
async function getUserFromRequest(event: any): Promise<AuthUser | null> {
  // Example implementation - replace with your auth system's logic
  // This might check cookies, JWT tokens, session, etc.
  try {
    // Example implementations:
    // Option 1: JWT Token from cookie/header
    // const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
    // if (!token) return null
    // const user = await verifyJWT(token) // Your JWT verification function
    // return { id: user.id, email: user.email, name: user.name }
    
    // Option 2: Session from cookie
    // const sessionId = getCookie(event, 'session-id')
    // if (!sessionId) return null
    // const session = await getSession(sessionId) // Your session lookup
    // return session?.user || null
    
    // Placeholder - replace with actual implementation
    return null;
  } catch {
    return null;
  }
}
