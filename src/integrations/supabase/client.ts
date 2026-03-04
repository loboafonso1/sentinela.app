import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let client: any;
if (SUPABASE_URL && SUPABASE_KEY) {
  client = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    }
  });
} else {
  client = {
    auth: {
      onAuthStateChange: (cb: any) => {
        cb(null, { user: null });
        return { data: { subscription: { unsubscribe() {} } } };
      },
      getSession: async () => ({ data: { session: null } }),
      signOut: async () => ({})
    },
    from: () => ({
      select: () => ({ data: null, error: null }),
      eq: () => ({ data: null, error: null }),
      order: () => ({ data: null, error: null }),
      limit: () => ({ data: null, error: null }),
      maybeSingle: () => ({ data: null, error: null })
    })
  };
}
export const supabase = client as ReturnType<typeof createClient<Database>>;
