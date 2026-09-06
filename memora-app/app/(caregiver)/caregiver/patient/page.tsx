"use client";

import { useState } from "react";
import { usePatient, useFamilyMembers } from "@/lib/hooks/use-patient";
import { User, MapPin, Languages, Calendar, Plus, Heart, Smartphone, ShieldCheck } from "lucide-react";

export default function CaregiverPatientPage() {
  const { data: patient } = usePatient();
  const { data: family, addMember } = useFamilyMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newRel, setNewRel] = useState("");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRel) return;
    addMember.mutate({ name: newName, relationship: newRel });
    setNewName("");
    setNewRel("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-400 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-sky-500/20 border-2 border-white">
            {patient?.name?.[0] || "M"}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {patient?.name || "Meena Sharma"}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Patient Device Connected
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Age {patient?.age || 72} • Language: {patient?.preferredLanguage || "Hindi"} • {patient?.location || "Shillong"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-500" />
            <span>Paired: Tablet-MEENA-01</span>
          </div>
        </div>
      </div>

      {/* Grid: Personal Info + Family Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            <span>Personal Information</span>
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Full Name
              </span>
              <span className="font-extrabold text-slate-900">{patient?.name}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Age
              </span>
              <span className="font-extrabold text-slate-900">{patient?.age} years</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <Languages className="w-4 h-4 text-slate-400" /> Preferred Language
              </span>
              <span className="font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                {patient?.preferredLanguage}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Primary Location
              </span>
              <span className="font-extrabold text-slate-900">{patient?.location}</span>
            </div>
          </div>
        </div>

        {/* Familiar People */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Familiar People</span>
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Family members used in Family Memory recognition games
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Person</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {family?.map((member) => (
              <div
                key={member.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2 hover:border-sky-300 transition-colors"
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-rose-400 to-amber-400 text-white font-black text-xl rounded-full flex items-center justify-center mx-auto shadow-md">
                  {member.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{member.name}</h3>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 inline-block mt-1">
                    {member.relationship}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Family Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Add Familiar Person</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Priya"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={newRel}
                  onChange={(e) => setNewRel(e.target.value)}
                  placeholder="e.g. Daughter"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
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
                  className="px-5 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-sky-700"
                >
                  Save Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
