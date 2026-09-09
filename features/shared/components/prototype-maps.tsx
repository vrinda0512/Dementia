"use client";

import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  CircleDot,
  Hospital,
  Home,
  Navigation,
  Route,
  ShoppingBasket,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";

type LocationType = "home" | "office" | "market" | "hospital";

type SavedLocation = {
  id: string;
  name: string;
  type: LocationType;
  detail: string;
  position: string;
  accent: string;
};

const locations: SavedLocation[] = [
  {
    id: "home",
    name: "Home",
    type: "home",
    detail: "12 Rose Garden Lane",
    position: "left-[18%] top-[66%]",
    accent: "bg-rose-500",
  },
  {
    id: "office",
    name: "Dr. Sharma's Office",
    type: "office",
    detail: "42 Park Street",
    position: "left-[68%] top-[20%]",
    accent: "bg-sky-500",
  },
  {
    id: "market",
    name: "Fresh Basket Market",
    type: "market",
    detail: "8 Green Avenue",
    position: "left-[73%] top-[70%]",
    accent: "bg-amber-500",
  },
  {
    id: "hospital",
    name: "City Hospital",
    type: "hospital",
    detail: "105 Lake Road",
    position: "left-[22%] top-[22%]",
    accent: "bg-emerald-500",
  },
];

const directions = [
  "Start by the front gate",
  "Walk straight past the park",
  "Turn right onto Green Avenue",
  "Your destination is ahead",
];

function LocationIcon({ type, className = "h-5 w-5" }: { type: LocationType; className?: string }) {
  const Icon = type === "home" ? Home : type === "office" ? BriefcaseBusiness : type === "market" ? ShoppingBasket : Hospital;
  return <Icon className={className} />;
}

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <button
      type="button"
      onClick={speaking ? stop : speak}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700"
    >
      {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {speaking ? "Stop voice" : "Hear directions"}
    </button>
  );
}

export function PrototypeMaps({ mode = "caregiver" }: { mode?: "caregiver" | "patient" }) {
  const [selectedId, setSelectedId] = useState("market");
  const [routeStarted, setRouteStarted] = useState(false);
  const selected = locations.find((location) => location.id === selectedId) || locations[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setRouteStarted(false);
  };

  return (
    <div className="space-y-6 text-slate-900">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Prototype map</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {mode === "patient" ? "Places you know" : "Patient Maps"}
          </h1>
          <p className="mt-2 max-w-2xl font-medium leading-6 text-slate-500">
            {mode === "patient"
              ? "Choose a familiar place and follow the gentle route together."
              : "A simple place board for planning familiar destinations with your patient."}
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Demo location active
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Familiar area</p>
              <h2 className="mt-1 text-lg font-black text-slate-800">Rose Garden neighbourhood</h2>
            </div>
            <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">Not live GPS</span>
          </div>

          <div className="relative min-h-[480px] overflow-hidden bg-[#eaf2ed] p-5 sm:min-h-[560px] sm:p-8">
            <div className="absolute inset-0 opacity-60" aria-hidden="true">
              <div className="absolute left-[8%] top-1/2 h-24 w-[84%] -rotate-12 rounded-[50%] border-[14px] border-white/90" />
              <div className="absolute left-1/2 top-[-12%] h-[130%] w-24 -rotate-[30deg] rounded-[50%] border-[14px] border-white/90" />
              <div className="absolute left-[-10%] top-[24%] h-20 w-[120%] rotate-[16deg] rounded-[50%] border-[10px] border-white/80" />
              <div className="absolute left-[15%] top-[10%] h-24 w-32 rounded-[2rem] bg-[#d5e8d7]" />
              <div className="absolute right-[12%] top-[43%] h-28 w-40 rounded-[2rem] bg-[#d5e8d7]" />
              <div className="absolute bottom-[8%] left-[35%] h-24 w-36 rounded-[2rem] bg-[#d5e8d7]" />
            </div>

            <div className="absolute left-[30%] top-[47%] h-32 w-[42%] rotate-12 rounded-full border-[6px] border-dashed border-sky-400/80 sm:h-40" aria-hidden="true" />
            <div className="absolute left-[38%] top-[36%] h-14 w-14 rounded-full border-4 border-white bg-slate-800 p-1 shadow-lg sm:h-16 sm:w-16">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-500 text-white">
                <Navigation className="h-6 w-6 rotate-45 fill-white" />
              </div>
            </div>
            <span className="absolute left-[35%] top-[31%] rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-black text-white shadow-md">Patient here</span>

            {locations.map((location) => {
              const isSelected = location.id === selected.id;
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelect(location.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sky-200 ${location.position}`}
                  aria-label={`Select ${location.name}`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white text-white shadow-lg ${location.accent} ${isSelected ? "ring-4 ring-sky-300 ring-offset-2" : ""}`}>
                    <LocationIcon type={location.type} />
                  </span>
                  <span className="mt-1 block max-w-32 rounded-lg bg-white/95 px-2 py-1 text-center text-[11px] font-black text-slate-700 shadow-sm">
                    {location.name}
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm sm:bottom-8 sm:left-8">
              <CircleDot className="h-4 w-4 text-sky-500" />
              Simulated patient location
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Selected place</p>
                <h2 className="mt-1 text-xl font-black text-slate-800">{selected.name}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">{selected.detail}</p>
              </div>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white ${selected.accent}`}>
                <LocationIcon type={selected.type} />
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-sky-50 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-sky-900">
                <Route className="h-4 w-4" />
                8 minutes · easy route
              </div>
              <p className="mt-1 text-xs font-semibold leading-5 text-sky-700">A short, familiar route from the patient&apos;s current place.</p>
            </div>

            <button
              type="button"
              onClick={() => setRouteStarted((current) => !current)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-slate-700"
            >
              <Navigation className="h-4 w-4" />
              {routeStarted ? "Pause route" : "Start demo route"}
            </button>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-800">Saved places</h2>
              <span className="text-xs font-bold text-slate-400">{locations.length} pins</span>
            </div>
            <div className="mt-3 space-y-2">
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelect(location.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${location.id === selected.id ? "border-sky-300 bg-sky-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${location.accent}`}>
                    <LocationIcon type={location.type} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black text-slate-700">{location.name}</span>
                    <span className="block truncate text-xs font-medium text-slate-400">{location.detail}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </section>

          {routeStarted && (
            <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-amber-950">Gentle directions</h2>
                <SpeakButton text={directions.join(". ")} />
              </div>
              <div className="mt-4 space-y-3">
                {directions.map((direction, index) => (
                  <div key={direction} className="flex items-center gap-3 text-sm font-bold text-amber-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-black">{index + 1}</span>
                    <span>{direction}</span>
                    {index < directions.length - 1 && <ArrowRight className="ml-auto h-4 w-4 text-amber-500" />}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-500">
            <Square className="h-4 w-4 shrink-0 fill-slate-300 text-slate-300" />
            Prototype mode: locations and routes are sample data.
          </div>
        </aside>
      </div>
    </div>
  );
}
