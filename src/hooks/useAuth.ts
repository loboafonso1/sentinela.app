import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearLocalProgressForUserChange = () => {
    try {
      const keys = [
        "sentinela_last_active_day",
        "sentinela_next_unlock_at",
        "sentinela_last_completed_day",
        "sent_unlock_max",
      ];
      keys.forEach((k) => localStorage.removeItem(k));
      for (let d = 1; d <= 30; d++) {
        localStorage.removeItem(`sent_video_day${d}_done`);
        localStorage.removeItem(`sent_quiz_day${d}_done`);
      }
    } catch {
      void 0;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      try {
        const prevEmail = (localStorage.getItem("sentinela_email") || "").toLowerCase();
        const nextEmail = (session?.user?.email || "").toLowerCase();
        if (prevEmail !== nextEmail) {
          clearLocalProgressForUserChange();
          if (nextEmail) localStorage.setItem("sentinela_email", nextEmail);
          else localStorage.removeItem("sentinela_email");
        }
        if (session?.user?.id) localStorage.setItem("sentinela_user_id", session.user.id);
        else localStorage.removeItem("sentinela_user_id");
      } catch { void 0; }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      try {
        const prevEmail = (localStorage.getItem("sentinela_email") || "").toLowerCase();
        const nextEmail = (session?.user?.email || "").toLowerCase();
        if (prevEmail !== nextEmail) {
          clearLocalProgressForUserChange();
          if (nextEmail) localStorage.setItem("sentinela_email", nextEmail);
          else localStorage.removeItem("sentinela_email");
        }
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
