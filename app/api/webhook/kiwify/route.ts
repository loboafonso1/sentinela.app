import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("Kiwify webhook payload:", payload);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("Kiwify webhook error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "unknown" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: "kiwify webhook alive" },
    { status: 200 }
  );
}
