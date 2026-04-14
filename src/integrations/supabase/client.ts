import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const FALLBACK_PROJECT_REF = "caygekeonqhaycjxppel";
const SUPABASE_URL =
  typeof import.meta.env.VITE_SUPABASE_URL === "string" &&
  import.meta.env.VITE_SUPABASE_URL.includes(FALLBACK_PROJECT_REF)
    ? import.meta.env.VITE_SUPABASE_URL
    : `https://${FALLBACK_PROJECT_REF}.supabase.co`;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type SupabaseClient = ReturnType<typeof createClient<Database>>;

let client: SupabaseClient;
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
  client = ({
    auth: {
      onAuthStateChange: (cb: (...args: unknown[]) => void) => {
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
  } as unknown) as SupabaseClient;
}
export const supabase = client as ReturnType<typeof createClient<Database>>;
