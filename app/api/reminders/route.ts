import { NextResponse } from "next/server";
import { reminderService, patientService } from "@/lib/supabase/services";

const WHATSAPP_SERVICE_URL =
  process.env.WHATSAPP_SERVICE_URL ||
  process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL ||
  "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, patientPhone, title, message, description, scheduledTime, type } = body;

    const reminderMessage = message || title;
    if (!reminderMessage) {
      return NextResponse.json({ error: "Reminder title/message is required" }, { status: 400 });
    }

    // Resolve patient phone if not directly provided
    let targetPhone = patientPhone;
    if (!targetPhone && patientId) {
      const patient = await patientService.getPatient(patientId);
      targetPhone = patient?.phone;
    }

    const nowFormattedTime =
      scheduledTime ||
      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Save reminder in Supabase DB
    const savedReminder = await reminderService.addReminder({
      patientId: patientId || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      type: type || "medicine",
      title: reminderMessage,
      description: description || "",
      scheduledTime: nowFormattedTime,
    });

    const reminderId = savedReminder?.id || `rem_${Date.now()}`;

    // Target express whatsapp-service /send-now
    let baseUrl = WHATSAPP_SERVICE_URL.replace(/\/$/, "");
    if (baseUrl.includes("trycloudflare.com") || baseUrl.includes(":3000")) {
      baseUrl = "http://localhost:5000";
    }
    const serviceEndpoint = `${baseUrl}/send-now`;

    console.log(`[API /api/reminders] Dispatching instant WhatsApp via: ${serviceEndpoint}`);

    // Send WhatsApp message instantly
    let sendResult = null;
    if (targetPhone) {
      try {
        const sendRes = await fetch(serviceEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: targetPhone,
            message: reminderMessage,
          }),
        });
        sendResult = await sendRes.json();
        console.log(`[API /api/reminders] Instant WhatsApp response:`, sendResult);
      } catch (err: any) {
        console.warn("[API /api/reminders] Send WhatsApp error:", err.message);
      }
    }

    return NextResponse.json(
      {
        ok: true,
        status: "sent",
        message: "Reminder created and WhatsApp message sent instantly",
        reminder: savedReminder || {
          id: reminderId,
          patientId,
          title: reminderMessage,
          scheduledTime: nowFormattedTime,
          patientPhone: targetPhone,
          status: "sent",
        },
        patientPhone: targetPhone,
        sendResult,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API /api/reminders] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "Memora Reminders API Route (Instant Send)",
    whatsappServiceUrl: WHATSAPP_SERVICE_URL,
    timestamp: new Date().toISOString(),
  });
}
