import { supabase } from "@/integrations/supabase/client";

type EntitlementRow = {
  email: string;
  status: "active" | "canceled" | "expired" | string;
  expires_at: string | null;
} | null;

export async function checkEntitlementByEmail(userEmail: string): Promise<boolean> {
  if (!userEmail) {
    console.log("ACCESS BLOCKED: no session email");
    return false;
  }
  console.log("USER EMAIL:", userEmail);

  const { data, error } = await (supabase as any)
    .from("subscription_entitlements")
    .select("*")
    .eq("email", userEmail)
    .eq("status", "active")
    .maybeSingle();

  console.log("ENTITLEMENT FOUND:", data);
  console.log("ENTITLEMENT STATUS:", (data as any)?.status);
  console.log("ENTITLEMENT EXPIRES_AT:", (data as any)?.expires_at);

  if (error || !data) {
    console.log("ACCESS BLOCKED");
    return false;
  }
  const expiresAt = (data as any)?.expires_at ? new Date((data as any).expires_at) : null;
  if (!expiresAt || expiresAt <= new Date()) {
    console.log("ACCESS BLOCKED: expired");
    return false;
  }
  console.log("ACCESS GRANTED");
  return true;
}
