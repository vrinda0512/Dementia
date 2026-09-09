"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Smartphone, Languages, RefreshCw, CheckCircle2, Shield } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { PATIENT_LANGUAGES } from "@/lib/voice/languages";
import Link from "next/link";

export default function CaregiverSettingsPage() {
  const { patient, activeLanguage, setLanguage } = useAppStore();
  const [pairedDevice, setPairedDevice] = useState("Tablet-MEENA-01 (Active)");
  const [isPairingSuccess, setIsPairingSuccess] = useState(false);

  const handlePairNewDevice = () => {
    setPairedDevice("Tablet-MEENA-02 (Pairing Code: 8492)");
    setIsPairingSuccess(true);
    setTimeout(() => setIsPairingSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-700" />
          <span>Platform & Device Settings</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Manage patient pairing, offline caching parameters, and voice assistant language defaults.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Patient Device Pairing */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-sky-600" />
            <span>Patient Device Pairing</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Patients do not log in directly. Pair a dedicated mobile/tablet device for Meena.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Paired Device</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Connected
              </span>
            </div>
            <span className="text-sm font-black text-slate-900 block">{pairedDevice}</span>
          </div>

          {isPairingSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>New pairing code generated!</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePairNewDevice}
              className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800"
            >
              Re-pair New Device
            </button>
            <Link
              href="/patient/home"
              className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 text-center"
            >
              Launch Patient App
            </Link>
          </div>
        </div>

        {/* Language & Voice Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Languages className="w-5 h-5 text-purple-600" />
            <span>Language & Audio Settings</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Set default language for patient audio prompts and text labels.
          </p>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Patient Preferred Language
            </label>
            <select
              value={activeLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
            >
              {PATIENT_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label} ({language.nativeLabel})
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600 shrink-0" />
            <p className="text-xs text-purple-900 font-medium">
              Sarvam voice services are used for supported patient languages. Assamese remains available for speech-to-text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
