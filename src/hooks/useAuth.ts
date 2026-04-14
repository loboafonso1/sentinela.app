import { useCallback, useEffect, useMemo, useState } from "react";

type LocalUser = {
  id: string;
  email: string;
};

const STORAGE_KEY = "sentinela_local_user";

export function useAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
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
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const id = typeof parsed.id === "string" ? parsed.id : "";
        const email = typeof parsed.email === "string" ? parsed.email : "";
        if (id && email) {
          setUser({ id, email });
          localStorage.setItem("sentinela_email", email.toLowerCase());
          localStorage.setItem("sentinela_user_id", id);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback((emailInput?: string) => {
    const nextEmail = (emailInput || "").trim() || "usuario@sentinela.local";
    const prevEmail = (localStorage.getItem("sentinela_email") || "").toLowerCase();
    const emailLower = nextEmail.toLowerCase();
    if (prevEmail && prevEmail !== emailLower) clearLocalProgressForUserChange();

    const id =
      localStorage.getItem("sentinela_user_id") ||
      (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
    const nextUser: LocalUser = { id, email: nextEmail };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem("sentinela_email", emailLower);
    localStorage.setItem("sentinela_user_id", id);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("sentinela_email");
      localStorage.removeItem("sentinela_user_id");
    } catch {
      void 0;
    }
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
}
