import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      try {
        if (session?.user?.id) localStorage.setItem("sentinela_user_id", session.user.id);
        else localStorage.removeItem("sentinela_user_id");
      } catch { void 0; }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      try {
        if (session?.user?.id) localStorage.setItem("sentinela_user_id", session.user.id);
        else localStorage.removeItem("sentinela_user_id");
      } catch { void 0; }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
