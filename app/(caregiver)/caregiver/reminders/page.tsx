"use client";

import { useState } from "react";
import { useReminders } from "@/lib/hooks/use-reminders";
import { useAppStore } from "@/lib/stores/app-store";

export default function CaregiverRemindersPage() {
  const { data: reminders, toggleReminder, addReminder, deleteReminder } = useReminders();
  const { patient, patients } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const patientList = patients.length > 0 ? patients : patient ? [patient] : [];

  const [selectedPatientId, setSelectedPatientId] = useState(patient?.id || "");
  const [title, setTitle] = useState("Take your medicine");
  const [description, setDescription] = useState("Blood pressure medication");
  const [type, setType] = useState("medicine");

  const selectedPatient = patientList.find((p) => p.id === selectedPatientId) || patient;
  const targetPhone = selectedPatient?.phone || "+919876543210";

  const handleSendInstant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);
    setStatusMessage("Sending instant WhatsApp message...");

    try {
      const nowFormattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Add to UI / Supabase state
      addReminder.mutate({
        type,
        title,
        description,
        scheduledTime: nowFormattedTime,
      });

      // Trigger instant WhatsApp send via backend API
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient?.id,
          patientPhone: targetPhone,
          title,
          message: title,
          description,
          scheduledTime: nowFormattedTime,
          type,
        }),
      });

      const resData = await response.json();
      console.log("[Instant Reminder UI] API response:", resData);

      setStatusMessage(`Instant WhatsApp message sent to ${targetPhone}!`);
      setTimeout(() => {
        setIsModalOpen(false);
        setStatusMessage("");
      }, 1800);
    } catch (err: any) {
      console.error("[Instant Reminder UI] Error:", err);
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Patient Daily Reminders (Instant WhatsApp Alerts)
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Send medication alerts, hydration reminders, and routine notifications instantly to patient&apos;s WhatsApp via Twilio.
          </p>
        </div>

        <button
          onClick={() => {
            setStatusMessage("");
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          Send Instant WhatsApp
        </button>
      </div>

      {/* Reminders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reminders?.map((rem) => (
          <div
            key={rem.id}
            className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
              rem.completed ? "border-slate-200 bg-slate-50/50" : "border-emerald-200"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                  {rem.type || "reminder"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Sent
                  </span>
                  <button
                    onClick={() => deleteReminder.mutate(rem.id)}
                    className="px-2 py-0.5 text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-black ${rem.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                  {rem.title}
                </h3>
                {rem.description && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{rem.description}</p>
                )}
              </div>

              <div className="space-y-1.5 pt-1 text-xs font-bold">
                <div className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                  Time: {rem.scheduledTime}
                </div>
                <div className="text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200/60">
                  WhatsApp: {rem.patientPhone || targetPhone}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleReminder.mutate(rem.id)}
              className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center transition-all cursor-pointer ${
                rem.completed
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
              }`}
            >
              <span>{rem.completed ? "Mark as Pending" : "Mark Completed"}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add / Send Instant WhatsApp Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Send Instant WhatsApp Alert</h3>
            </div>

            <form onSubmit={handleSendInstant} className="space-y-4">
              {/* Select Patient */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Patient & Phone
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  {patientList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phone || "+919876543210"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reminder Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="medicine">Medicine</option>
                  <option value="hydration">Hydration</option>
                  <option value="activity">Walk / Activity</option>
                </select>
              </div>

              {/* Title / Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Message / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Take your medicine"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {statusMessage && (
                <div className="p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 border border-slate-200">
                  {statusMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Send WhatsApp Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
