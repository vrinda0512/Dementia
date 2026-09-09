require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

process.on("uncaughtException", (err) => {
  console.error("❌ [Process UncaughtException]:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ [Process UnhandledRejection]:", reason);
});

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.options("*", cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ─── TWILIO WHATSAPP HELPER ────────────────────────────────
async function sendWhatsAppMessage(to, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM || "+14155238886";

  if (!accountSid || !authToken) {
    console.warn("[WhatsApp] WARNING: TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is missing!");
    console.log(`[WhatsApp Mock] Would send to whatsapp:${to}: "${message}"`);
    return { success: true, mock: true, sid: "MOCK_SID_" + Date.now() };
  }

  const client = twilio(accountSid, authToken);
  const formattedFrom = fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`;
  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  console.log(`\n==================================================`);
  console.log(`📱 [WhatsApp Send] Dispatching immediate message...`);
  console.log(`   To:   ${formattedTo}`);
  console.log(`   From: ${formattedFrom}`);
  console.log(`   Body: "${message}"`);
  console.log(`==================================================\n`);

  const res = await client.messages.create({
    body: message,
    from: formattedFrom,
    to: formattedTo,
  });

  console.log(`✅ [WhatsApp] Delivered successfully! SID: ${res.sid}\n`);
  return { success: true, sid: res.sid };
}

// ─── API ROUTES ────────────────────────────────────────────

// Health check
app.get(["/", "/health"], (req, res) => {
  res.json({
    status: "ok",
    service: "WhatsApp Reminder Instant Service",
    twilio: process.env.TWILIO_ACCOUNT_SID ? "configured" : "unconfigured (mock mode)",
    timestamp: new Date().toISOString(),
  });
});

// Immediate WhatsApp message endpoint
app.post("/send-now", async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    if (!phoneNumber || !message) {
      return res.status(400).json({ error: "phoneNumber and message are required" });
    }
    const cleanPhone = phoneNumber.replace("whatsapp:", "").trim();
    const formattedMsg = message.startsWith("⏰") ? message : `⏰ Reminder: ${message}`;
    const result = await sendWhatsAppMessage(cleanPhone, formattedMsg);
    res.json({ ok: true, result });
  } catch (err) {
    console.error("[API /send-now] Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Alias for backwards compatibility
app.post("/schedule-reminder", async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    if (!phoneNumber || !message) {
      return res.status(400).json({ error: "phoneNumber and message are required" });
    }
    const cleanPhone = phoneNumber.replace("whatsapp:", "").trim();
    const formattedMsg = message.startsWith("⏰") ? message : `⏰ Reminder: ${message}`;
    const result = await sendWhatsAppMessage(cleanPhone, formattedMsg);
    res.json({ ok: true, result });
  } catch (err) {
    console.error("[API /schedule-reminder] Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Incoming Twilio Webhook Handler
app.all("/webhook", express.urlencoded({ extended: true }), (req, res) => {
  console.log("\n==================================================");
  console.log("📩 [Twilio Webhook] Incoming WhatsApp Message Received!");
  console.log("   From:", req.body?.From || "Unknown");
  console.log("   Body:", req.body?.Body || "(No Body)");
  console.log("==================================================\n");

  res.type("text/xml").send("<Response></Response>");
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 WhatsApp Instant Messaging Service running on port ${PORT}`);
  console.log(`   Health endpoint: http://localhost:${PORT}/health`);
  console.log(`   Send endpoint:   POST http://localhost:${PORT}/send-now`);
  console.log(`==================================================\n`);
});
