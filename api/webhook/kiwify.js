import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const payload = req.body;

    console.log("Webhook Kiwify recebido:");
    console.log(payload);

    const email =
      (payload && (payload.customer?.email || payload.email || payload?.data?.customer?.email)) || "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const eventType =
      (payload && (payload.event || payload.type || payload?.data?.event)) || "unknown";

    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY;

    if (SUPABASE_URL && SERVICE_ROLE && normalizedEmail && eventType) {
      const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      let userId = null;
      try {
        const { data: usersData, error: usersErr } = await admin.auth.admin.listUsers();
        if (!usersErr && usersData?.users?.length) {
          const found = usersData.users.find(
            (u) => u.email && u.email.toLowerCase() === normalizedEmail
          );
          userId = found?.id || null;
        }
      } catch (_) {
        userId = null;
      }

      if (userId) {
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const status = eventType === "sale.approved" ? "active" : "canceled";
        try {
          await admin
            .from("subscriptions")
            .upsert(
              [{ user_id: userId, status, expires_at: expires }],
              { onConflict: "user_id" }
            );
        } catch (_) {
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook recebido com sucesso",
    });
  } catch (error) {
    console.error("Erro webhook:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno",
    });
  }
}
