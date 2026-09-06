"use client";

import { useState } from "react";
import { useMemories } from "@/lib/hooks/use-memories";
import { generateMemoryActivity } from "@/lib/services/memory-game-generator";
import type { Memory, GeneratedActivity } from "@/lib/types";
import { Heart, Plus, Sparkles, Calendar, Users, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function CaregiverMemoriesPage() {
  const { data: memories, addMemory } = useMemories();
  const [selectedMemoryForActivity, setSelectedMemoryForActivity] = useState<Memory | null>(null);
  const [activityPreview, setActivityPreview] = useState<GeneratedActivity | null>(null);
  const [isAddedToast, setIsAddedToast] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Memory["category"]>("trip");
  const [people, setPeople] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerate = (mem: Memory) => {
    setSelectedMemoryForActivity(mem);
    const act = generateMemoryActivity(mem);
    setActivityPreview(act);
  };

  const handleAddToPatient = () => {
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 3000);
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    addMemory.mutate({
      title,
      description,
      category,
      people: people ? people.split(",").map((p) => p.trim()) : [],
      date: date || undefined,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&auto=format&fit=crop&q=80",
    });

    setTitle("");
    setDescription("");
    setPeople("");
    setDate("");
    setImageUrl("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Toast banner when activity added */}
      {isAddedToast && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Activity added to Meena's patient home queue!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <span>Personalized Patient Memories</span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Create real memories to generate customized cognitive games for Meena.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memories?.map((mem) => (
          <div
            key={mem.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {mem.imageUrl ? (
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {mem.category}
                  </span>
                </div>
              ) : (
                <div className="h-32 bg-rose-50 flex items-center justify-center text-rose-400">
                  <ImageIcon className="w-10 h-10" />
                </div>
              )}

              <div className="p-5 space-y-2">
                <h3 className="text-lg font-black text-slate-900">{mem.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {mem.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
                  {mem.date && (
                    <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {mem.date}
                    </span>
                  )}
                  {mem.people.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      <Users className="w-3 h-3 text-sky-500" />
                      {mem.people.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => handleGenerate(mem)}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Activity</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Activity Preview Modal */}
      {activityPreview && selectedMemoryForActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 block">
                    AI Memory Activity Generator
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Activity Preview: {selectedMemoryForActivity.title}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Difficulty: {activityPreview.difficulty}
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Generated Question:
              </span>
              <p className="text-base font-extrabold text-slate-900">
                "{activityPreview.question}"
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-500">Choice Options:</span>
                <div className="flex flex-wrap gap-2">
                  {activityPreview.options.map((opt, idx) => (
                    <span
                      key={idx}
                      className={`px-4 py-2 rounded-xl text-xs font-black border ${
                        opt === activityPreview.correctAnswer
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/30"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {opt} {opt === activityPreview.correctAnswer && "✓ (Correct)"}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActivityPreview(null)}
                className="px-4 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToPatient();
                  setActivityPreview(null);
                }}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Patient Activities</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-black text-slate-900">Add Patient Memory</h3>
            <form onSubmit={handleCreateMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shillong Family Trip"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about what happened..."
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="trip">Trip</option>
                    <option value="food">Food</option>
                    <option value="family">Family</option>
                    <option value="festival">Festival</option>
                    <option value="hobby">Hobby</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  People (comma separated)
                </label>
                <input
                  type="text"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="e.g. Rajesh, Priya"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-sky-700"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
