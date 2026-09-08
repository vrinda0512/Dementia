"use client";

import { useState } from "react";
import { usePatient, useFamilyMembers } from "@/lib/hooks/use-patient";
import { useRoutines } from "@/lib/hooks/use-routines";
import { useQuestions } from "@/lib/hooks/use-questions";
import type { MemoryCategory, GameFormat } from "@/lib/types";
import {
  User,
  MapPin,
  Languages,
  Calendar,
  Plus,
  Heart,
  Smartphone,
  ShieldCheck,
  Clock,
  Trash2,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Volume2,
} from "lucide-react";

export default function CaregiverPatientPage() {
  const { data: patient } = usePatient();
  const { data: family, addMember, deleteMember } = useFamilyMembers();
  const { data: routines, addRoutine, deleteRoutine } = useRoutines();
  const { data: questions, addQuestion, deleteQuestion } = useQuestions();

  const [activeTab, setActiveTab] = useState<"routine" | "family" | "personalization" | "rbac">("routine");

  // Modal states
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Form states - Family Member
  const [familyName, setFamilyName] = useState("");
  const [familyRel, setFamilyRel] = useState("");
  const [familyPhoto, setFamilyPhoto] = useState("");

  // Form states - Routine
  const [routineLabel, setRoutineLabel] = useState("");
  const [routineEmoji, setRoutineEmoji] = useState("✨");
  const [routineDesc, setRoutineDesc] = useState("");
  const [routineLoc, setRoutineLoc] = useState("Home");
  const [routineTime, setRoutineTime] = useState("09:00");
  const [routineOrder, setRoutineOrder] = useState(1);

  // Form states - Personalization Question
  const [qCategory, setQCategory] = useState<MemoryCategory>("family");
  const [qFormat, setQFormat] = useState<GameFormat>("multiple-choice");
  const [qText, setQText] = useState("");
  const [qAnswer, setQAnswer] = useState("");
  const [qOptionsText, setQOptionsText] = useState("");
  const [qImage, setQImage] = useState("");
  const [qAudio, setQAudio] = useState("");

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName || !familyRel) return;
    addMember.mutate({
      name: familyName,
      relationship: familyRel,
      photoUrl: familyPhoto || undefined,
    });
    setFamilyName("");
    setFamilyRel("");
    setFamilyPhoto("");
    setIsFamilyModalOpen(false);
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineLabel) return;
    addRoutine.mutate({
      patientId: patient?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      label: routineLabel,
      emoji: routineEmoji,
      description: routineDesc,
      location: routineLoc,
      timeOfDay: routineTime,
      stepOrder: Number(routineOrder),
      active: true,
    });
    setRoutineLabel("");
    setRoutineDesc("");
    setIsRoutineModalOpen(false);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || !qAnswer) return;

    const optionsArray = qOptionsText
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    // Make sure correct answer is in options if multiple-choice
    if (qFormat === "multiple-choice" && !optionsArray.includes(qAnswer)) {
      optionsArray.unshift(qAnswer);
    }

    addQuestion.mutate({
      category: qCategory,
      format: qFormat,
      question: qText,
      answer: qAnswer,
      options: optionsArray,
      image: qImage || undefined,
      audio: qAudio || undefined,
    });

    setQText("");
    setQAnswer("");
    setQOptionsText("");
    setQImage("");
    setQAudio("");
    setIsQuestionModalOpen(false);
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
                Connected to Supabase DB
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Age {patient?.age || 72} • Language: {patient?.preferredLanguage || "English"} • {patient?.location || "New Delhi"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Role: Caregiver (Admin)</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("routine")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all whitespace-nowrap ${
            activeTab === "routine"
              ? "bg-sky-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          1. Patient Daily Routine ({routines?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("family")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all whitespace-nowrap ${
            activeTab === "family"
              ? "bg-sky-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          2. Family Members ({family?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("personalization")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all whitespace-nowrap ${
            activeTab === "personalization"
              ? "bg-sky-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          3. Personalization Questions ({questions?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("rbac")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all whitespace-nowrap ${
            activeTab === "rbac"
              ? "bg-sky-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          4. Auth & RBAC
        </button>
      </div>

      {/* TAB 1: ROUTINE OF PATIENT */}
      {activeTab === "routine" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-6 h-6 text-sky-600" />
                <span>Patient Daily Routine</span>
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Structured schedule used in Patient Home and Routine Ordering Game
              </p>
            </div>
            <button
              onClick={() => setIsRoutineModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Routine Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines?.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-sky-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 font-bold text-2xl flex items-center justify-center shadow-xs">
                    {item.emoji || "✨"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        Step #{item.stepOrder || item.order || 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {item.timeOfDay}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">
                      {item.label}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 font-medium">{item.description}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteRoutine.mutate(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete routine step"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FAMILY MEMBERS */}
      {activeTab === "family" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <span>Family Members (Names + Photos + Relationship)</span>
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Profiles and photos used in Family Recognition activities
              </p>
            </div>
            <button
              onClick={() => setIsFamilyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Family Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {family?.map((member) => (
              <div
                key={member.id}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3 relative hover:border-rose-300 transition-all group"
              >
                <button
                  onClick={() => deleteMember.mutate(member.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto shadow-md border-2 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-400 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                    {member.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{member.name}</h3>
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block mt-1 uppercase tracking-wider">
                    {member.relationship}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PERSONALIZATION QUESTIONS */}
      {activeTab === "personalization" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-emerald-600" />
                <span>Personalization Questions</span>
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Configure patient memory questions with MemoryCategory and GameFormat dropdowns
              </p>
            </div>
            <button
              onClick={() => setIsQuestionModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions?.map((q) => (
              <div
                key={q.id}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider">
                      {q.category}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {q.format}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteQuestion.mutate(q.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base">{q.question}</h3>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 text-xs space-y-1">
                  <span className="font-extrabold text-emerald-900 block">
                    Correct Answer: <span className="underline">{q.answer}</span>
                  </span>
                  {q.options && q.options.length > 0 && (
                    <div className="text-slate-600 font-medium">
                      Options: {q.options.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUTH & RBAC */}
      {activeTab === "rbac" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
            <span>Authentication & RBAC Control</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-sky-50 p-6 rounded-2xl border border-sky-200 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 inline-block">
                Role: Caregiver (Admin)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Caregiver Portal Access</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Full CRUD privileges to add routines, family member profiles, personalization memory questions, and monitor patient cognitive performance metrics.
              </p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block">
                Role: Patient (Restricted View)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Patient Companion Access</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Distraction-free interface for playing memory games, reviewing daily routines, viewing family photos, and receiving gentle voice & text reminders.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROUTINE ITEM */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Add Patient Daily Routine</h3>
            <form onSubmit={handleAddRoutine} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Routine Title / Label
                </label>
                <input
                  type="text"
                  value={routineLabel}
                  onChange={(e) => setRoutineLabel(e.target.value)}
                  placeholder="e.g. Morning Walk"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={routineEmoji}
                    onChange={(e) => setRoutineEmoji(e.target.value)}
                    placeholder="🌳"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time of Day
                  </label>
                  <input
                    type="time"
                    value={routineTime}
                    onChange={(e) => setRoutineTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={routineLoc}
                    onChange={(e) => setRoutineLoc(e.target.value)}
                    placeholder="Garden"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Step Order
                  </label>
                  <input
                    type="number"
                    value={routineOrder}
                    onChange={(e) => setRoutineOrder(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={routineDesc}
                  onChange={(e) => setRoutineDesc(e.target.value)}
                  placeholder="Walk for 15 minutes along the main path"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRoutineModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-sky-700"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FAMILY MEMBER */}
      {isFamilyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Add Family Member</h3>
            <form onSubmit={handleAddFamily} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={familyRel}
                  onChange={(e) => setFamilyRel(e.target.value)}
                  placeholder="e.g. Daughter"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={familyPhoto}
                  onChange={(e) => setFamilyPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFamilyModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-rose-700"
                >
                  Save Family Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PERSONALIZATION QUESTION */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 my-8">
            <h3 className="text-xl font-black text-slate-900">Add Personalization Question</h3>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Memory Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category (MemoryCategory)
                  </label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value as MemoryCategory)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="family">family</option>
                    <option value="personal">personal</option>
                    <option value="childhood">childhood</option>
                    <option value="food">food</option>
                    <option value="music">music</option>
                    <option value="hobbies">hobbies</option>
                    <option value="places">places</option>
                    <option value="home">home</option>
                  </select>
                </div>

                {/* Game Format Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Format (GameFormat)
                  </label>
                  <select
                    value={qFormat}
                    onChange={(e) => setQFormat(e.target.value as GameFormat)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="multiple-choice">multiple-choice</option>
                    <option value="voice">voice</option>
                    <option value="image">image</option>
                    <option value="fill-blank">fill-blank</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. Who is your eldest daughter?"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Correct Answer
                </label>
                <input
                  type="text"
                  value={qAnswer}
                  onChange={(e) => setQAnswer(e.target.value)}
                  placeholder="e.g. Priya"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {qFormat === "multiple-choice" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={qOptionsText}
                    onChange={(e) => setQOptionsText(e.target.value)}
                    placeholder="Priya, Sunita, Ananya, Ritu"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={qImage}
                    onChange={(e) => setQImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Audio URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={qAudio}
                    onChange={(e) => setQAudio(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
