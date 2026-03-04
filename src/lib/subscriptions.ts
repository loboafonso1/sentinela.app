import { supabase } from "@/integrations/supabase/client";

export type SubscriptionStatus = "active" | "canceled" | "expired";
type SubscriptionRow = { status?: SubscriptionStatus | null; expires_at?: string | null };

export async function checkUserSubscription(userId: string): Promise<boolean> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    if (import.meta.env.DEV) return true;
  }
  if (!userId) return false;

  const { data, error } = await (supabase as any)
    .from("subscriptions")
    .select("status, expires_at")
    .eq("user_id", userId)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return false;
  }
  const row = data as SubscriptionRow | null;
  if (!row) return false;
  const isActive = row.status === "active";
  const expiresAt = row.expires_at ? new Date(row.expires_at) : null;
  const notExpired = expiresAt ? expiresAt.getTime() > Date.now() : false;
  return isActive && notExpired;
}
