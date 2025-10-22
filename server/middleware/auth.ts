import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { node } = event;
  const url = node.req.url || '';
  
  // If path does *not* start with /api/, skip the auth check
  if (!url.startsWith('/api/')) {
    return;   // do nothing, allow route to proceed
  }

  // Only APIs get protected:
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
});
