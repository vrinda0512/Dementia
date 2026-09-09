"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Lock, Mail, ArrowRight, ShieldCheck, User } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";
import { caregiverService, patientService } from "@/lib/supabase/services";
import { DEFAULT_CAREGIVER_ID, DEFAULT_PATIENT_ID, isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const router = useRouter();
  const { setRole, setCaregiver, setPatient, setPatients } = useAppStore();
  const [email, setEmail] = useState("ananya@smarika.care");
  const [password, setPassword] = useState("demo");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginAs, setLoginAs] = useState<"caregiver" | "patient">("caregiver");

  const finishCaregiverLogin = async (caregiverId: string, name: string, emailAddr: string) => {
    setRole("caregiver");
    setCaregiver({ id: caregiverId, name, email: emailAddr, role: "caregiver" });

    let patients = await patientService.getPatientsForCaregiver(caregiverId);
    if (patients.length === 0) {
      patients = await patientService.getAllPatients();
    }
    setPatients(patients);
    if (patients.length > 0) setPatient(patients[0]);
    router.push("/caregiver/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (loginAs === "caregiver") {
        const found = isSupabaseConfigured()
          ? await caregiverService.findCaregiverByEmail(email)
          : null;

        if (found) {
          await finishCaregiverLogin(found.id, found.name, found.email);
        } else {
          // Demo / seed caregiver when table missing or email unknown
          await finishCaregiverLogin(
            DEFAULT_CAREGIVER_ID,
            email.split("@")[0] || "Caregiver",
            email
          );
        }
      } else {
        // Patient login: match by email-like name or use default patient
        setRole("patient");
        const all = await patientService.getAllPatients();
        const match =
          all.find((p) => p.name.toLowerCase().includes(email.split("@")[0].toLowerCase())) ||
          all.find((p) => p.id === DEFAULT_PATIENT_ID) ||
          all[0] ||
          null;

        if (match) {
          setPatient(match);
          setPatients([match]);
          setCaregiver(null);
          router.push("/patient/home");
        } else {
          setError("No patient profile found. Seed patients in Supabase first.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Check Supabase connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await finishCaregiverLogin(
        DEFAULT_CAREGIVER_ID,
        "Dr. Ananya Sharma",
        "ananya@smarika.care"
      );
    } catch {
      setError("Could not start demo session.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/30">
            <HeartPulse className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smarika</h1>
          <p className="text-slate-500 text-sm mt-1">Caregiver Portal & Cognitive Monitoring</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => setLoginAs("caregiver")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              loginAs === "caregiver" ? "bg-white text-sky-700 shadow-xs" : "text-slate-500"
            }`}
          >
            Caregiver
          </button>
          <button
            type="button"
            onClick={() => setLoginAs("patient")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              loginAs === "patient" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500"
            }`}
          >
            Patient
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {loginAs === "caregiver" ? "Caregiver Email" : "Patient Name / Email"}
            </label>
            <div className="relative">
              {loginAs === "caregiver" ? (
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              ) : (
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              )}
              <input
                type={loginAs === "caregiver" ? "email" : "text"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm"
                placeholder={loginAs === "caregiver" ? "caregiver@smarika.care" : "Meena Sharma"}
              />
            </div>
          </div>

          {loginAs === "caregiver" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {!isSupabaseConfigured() && (
            <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to connect your database.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">Or for college evaluation</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Launch Demo Caregiver Session</span>
        </button>
      </div>
    </div>
  );
}
