"use client";

import { useState } from "react";
import { useReminders } from "@/lib/hooks/use-reminders";
import { Bell, Plus, Clock, Trash2, CheckCircle2, RefreshCw } from "lucide-react";
import type { Reminder } from "@/lib/types";

export default function CaregiverRemindersPage() {
  const { data: reminders, toggleReminder, addReminder, deleteReminder } = useReminders();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState("10:00 AM");
  const [type, setType] = useState("medicine");
  const [recurring, setRecurring] = useState("Daily");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addReminder.mutate({
      type,
      title,
      description,
      scheduledTime,
      recurring,
      active: true,
    });

    setTitle("");
    setDescription("");
    setIsModalOpen(false);
  };

  const getEmoji = (t: string) => {
    switch (t) {
      case "medicine": return "💊";
      case "hydration": return "💧";
      case "activity": return "🚶";
      default: return "⏰";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            <span>Patient Daily Reminders</span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Configure medication schedules, hydration alerts, and daily routine walk reminders for Meena.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Reminders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reminders?.map((rem) => (
          <div
            key={rem.id}
            className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
              rem.completed ? "border-slate-200 bg-slate-50/50" : "border-amber-200"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-3xl p-2.5 bg-amber-50 rounded-2xl border border-amber-100">
                  {getEmoji(rem.type)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                  <button
                    onClick={() => deleteReminder.mutate(rem.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-black ${rem.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                  {rem.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{rem.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold pt-1">
                <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {rem.scheduledTime}
                </span>
                {rem.recurring && (
                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                    {rem.recurring}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleReminder.mutate(rem.id)}
              className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all ${
                rem.completed
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{rem.completed ? "Mark as Pending" : "Mark Completed"}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Add Reminder</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="medicine">💊 Medicine</option>
                  <option value="hydration">💧 Hydration</option>
                  <option value="activity">🚶 Walk / Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Medicine"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Blood pressure medicine"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="10:00 AM"
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Recurrence
                  </label>
                  <input
                    type="text"
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value)}
                    placeholder="Daily"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-amber-600"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
