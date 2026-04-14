import { useCallback, useEffect, useState } from "react";

type LocalUser = {
  id: string;
  email: string;
};

const STORAGE_KEY = "sentinela_local_user";

const safeUuid = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random()}`;
};

export function useAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setUser(null);
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const id = typeof parsed.id === "string" ? parsed.id : "";
      const email = typeof parsed.email === "string" ? parsed.email : "";
      if (!id || !email) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser({ id, email });
      setLoading(false);
    } catch {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const signIn = useCallback((emailInput?: string) => {
    const nextEmail = (emailInput || "").trim() || "usuario@sentinela.local";
    const id = safeUuid();
    const nextUser: LocalUser = { id, email: nextEmail };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      void 0;
    }
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
}

