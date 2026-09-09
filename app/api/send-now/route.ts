import { NextResponse } from "next/server";

const WHATSAPP_SERVICE_URL =
  process.env.WHATSAPP_SERVICE_URL ||
  process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL ||
  "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    let baseUrl = WHATSAPP_SERVICE_URL.replace(/\/$/, "");
    if (baseUrl.includes("trycloudflare.com") || baseUrl.includes(":3000")) {
      baseUrl = "http://localhost:5000";
    }

    const serviceEndpoint = `${baseUrl}/send-now`;
    console.log(`[API /api/send-now] Forwarding to WhatsApp service: ${serviceEndpoint}`);

    const res = await fetch(serviceEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[API /api/send-now] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
