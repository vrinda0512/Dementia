"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  DoorOpen,
  Hospital,
  Home,
  Navigation,
  Pause,
  Play,
  RotateCcw,
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
  mapPosition: { left: number; top: number };
};

type RouteData = {
  directions: string[];
  waypoints: { left: number; top: number }[];
  eta: string;
  description: string;
};

const locations: SavedLocation[] = [
  {
    id: "home",
    name: "Home",
    type: "home",
    detail: "12 Rose Garden Lane",
    position: "left-[18%] top-[68%]",
    accent: "bg-rose-500",
    mapPosition: { left: 18, top: 68 },
  },
  {
    id: "office",
    name: "Dr. Sharma's Office",
    type: "office",
    detail: "42 Park Street",
    position: "left-[68%] top-[22%]",
    accent: "bg-sky-500",
    mapPosition: { left: 68, top: 22 },
  },
  {
    id: "market",
    name: "Fresh Basket Market",
    type: "market",
    detail: "8 Green Avenue",
    position: "left-[78%] top-[72%]",
    accent: "bg-amber-500",
    mapPosition: { left: 78, top: 72 },
  },
  {
    id: "hospital",
    name: "City Hospital",
    type: "hospital",
    detail: "105 Lake Road",
    position: "left-[22%] top-[22%]",
    accent: "bg-emerald-500",
    mapPosition: { left: 22, top: 22 },
  },
];

const routeDataByLocation: Record<string, RouteData> = {
  market: {
    directions: [
      "Start at Home on Rose Garden Road",
      "Continue straight past the Front Gate",
      "Walk along Rose Garden Road to Central Crossroads",
      "Turn right onto Green Avenue past Community Garden",
      "You have arrived at Fresh Basket Market!",
    ],
    waypoints: [
      { left: 18, top: 68 },
      { left: 32, top: 48 },
      { left: 50, top: 48 },
      { left: 65, top: 60 },
      { left: 78, top: 72 },
    ],
    eta: "6 minutes · easy route",
    description: "A gentle walk down Rose Garden Road and along Green Avenue.",
  },
  office: {
    directions: [
      "Start at Home on Rose Garden Road",
      "Continue straight past the Front Gate",
      "Walk along Rose Garden Road to Central Crossroads",
      "Turn left onto Park Lane heading north",
      "You have arrived at Dr. Sharma's Office!",
    ],
    waypoints: [
      { left: 18, top: 68 },
      { left: 32, top: 48 },
      { left: 50, top: 48 },
      { left: 59, top: 35 },
      { left: 68, top: 22 },
    ],
    eta: "8 minutes · calm walk",
    description: "Follow Rose Garden Road and turn onto Park Lane.",
  },
  hospital: {
    directions: [
      "Start at Home on Rose Garden Road",
      "Head north towards Front Gate",
      "Turn left at Front Gate onto Lake Road",
      "Continue north on Lake Road alongside Rose Garden",
      "You have arrived at City Hospital!",
    ],
    waypoints: [
      { left: 18, top: 68 },
      { left: 25, top: 58 },
      { left: 32, top: 48 },
      { left: 27, top: 35 },
      { left: 22, top: 22 },
    ],
    eta: "7 minutes · direct route",
    description: "Take Lake Road past Rose Garden straight to the hospital.",
  },
  home: {
    directions: [
      "Start at Central Crossroads on Green Avenue",
      "Walk west along Rose Garden Road towards Front Gate",
      "Pass through Front Gate onto Rose Garden Lane",
      "Continue past Maple Garden towards your front porch",
      "You have arrived safely back Home!",
    ],
    waypoints: [
      { left: 50, top: 48 },
      { left: 32, top: 48 },
      { left: 25, top: 58 },
      { left: 21, top: 63 },
      { left: 18, top: 68 },
    ],
    eta: "5 minutes · familiar path",
    description: "The comforting, familiar route back home.",
  },
};

function LocationIcon({ type, className = "h-5 w-5" }: { type: LocationType; className?: string }) {
  const Icon = type === "home" ? Home : type === "office" ? BriefcaseBusiness : type === "market" ? ShoppingBasket : Hospital;
  return <Icon className={className} />;
}

function SpeakButton({ text, autoPlay }: { text: string; autoPlay?: boolean }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!autoPlay) {
      setSpeaking(false);
      return;
    }

    speak();
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    };
  }, [autoPlay, text]);

  const stop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  return (
    <button
      type="button"
      onClick={speaking ? stop : speak}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
      aria-label={speaking ? "Stop voice directions" : "Listen to voice directions"}
    >
      {speaking ? <VolumeX className="h-4 w-4 text-rose-500 animate-pulse" /> : <Volume2 className="h-4 w-4 text-sky-600" />}
      <span>{speaking ? "Stop voice" : "Hear direction"}</span>
    </button>
  );
}

export function PrototypeMaps({ mode = "caregiver" }: { mode?: "caregiver" | "patient" }) {
  const [selectedId, setSelectedId] = useState("market");
  const [routeStarted, setRouteStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [routeStep, setRouteStep] = useState(0);
  const [liveLocationEnabled, setLiveLocationEnabled] = useState(true);

  const selected = locations.find((location) => location.id === selectedId) || locations[0];
  const activeRouteData = routeDataByLocation[selected.id] || routeDataByLocation["market"];
  const { directions, waypoints, eta, description } = activeRouteData;

  const currentDirection = directions[routeStep] || directions[0];
  const patientPosition = waypoints[Math.min(routeStep, waypoints.length - 1)] || selected.mapPosition;

  // SVG route path calculations
  const fullPathD = waypoints.reduce(
    (acc, wp, i) => `${acc} ${i === 0 ? "M" : "L"} ${wp.left} ${wp.top}`,
    ""
  );

  const activePathWaypoints = waypoints.slice(0, Math.min(routeStep + 1, waypoints.length));
  const activePathD = activePathWaypoints.reduce(
    (acc, wp, i) => `${acc} ${i === 0 ? "M" : "L"} ${wp.left} ${wp.top}`,
    ""
  );

  useEffect(() => {
    if (!routeStarted || !isPlaying || routeStep >= directions.length - 1) return;

    const timer = window.setTimeout(() => {
      setRouteStep((current) => {
        const next = current + 1;
        if (next >= directions.length - 1) {
          setIsPlaying(false);
        }
        return Math.min(next, directions.length - 1);
      });
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [routeStarted, isPlaying, routeStep, directions.length]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setRouteStarted(false);
    setIsPlaying(false);
    setRouteStep(0);
  };

  const startRoute = () => {
    setRouteStep(0);
    setRouteStarted(true);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!routeStarted) {
      startRoute();
    } else {
      if (routeStep >= directions.length - 1) {
        setRouteStep(0);
        setIsPlaying(true);
      } else {
        setIsPlaying((prev) => !prev);
      }
    }
  };

  const nextStep = () => {
    if (!routeStarted) setRouteStarted(true);
    setRouteStep((current) => Math.min(current + 1, directions.length - 1));
  };

  const prevStep = () => {
    setRouteStep((current) => Math.max(current - 1, 0));
  };

  const resetRoute = () => {
    setRouteStep(0);
    setIsPlaying(false);
    setRouteStarted(false);
  };

  return (
    <div className="space-y-6 text-slate-900">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {mode === "patient" ? "Places you know" : "Patient Maps"}
          </h1>
          <p className="mt-2 max-w-2xl font-medium leading-6 text-slate-500">
            {mode === "patient"
              ? "Choose a familiar place and follow the gentle route together step by step."
              : "A simple place board for planning familiar destinations with your patient."}
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-black text-emerald-700 shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
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
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live location enabled
            </span>
          </div>

          {/* Direction Instruction Banner (Positioned ABOVE map canvas so nothing is overlapped) */}
          {routeStarted && (
            <div className="border-b border-sky-200 bg-gradient-to-r from-sky-50 via-sky-50/90 to-blue-50 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
                    <Navigation className="h-5 w-5 rotate-45 fill-white" />
                  </span>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-700">
                      Step {routeStep + 1} of {directions.length}
                    </span>
                    <p className="text-base font-black leading-snug text-slate-800 sm:text-lg">
                      {currentDirection}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                  <SpeakButton text={currentDirection} autoPlay={isPlaying} />

                  {/* Step Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={routeStep === 0}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>

                    <button
                      type="button"
                      onClick={togglePlay}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-sky-500 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                      {isPlaying ? "Pause" : routeStep >= directions.length - 1 ? "Replay" : "Play"}
                    </button>

                    <button
                      type="button"
                      onClick={resetRoute}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-800 cursor-pointer"
                      title="Reset route"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={routeStep >= directions.length - 1}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Canvas */}
          <div className="relative min-h-[500px] overflow-hidden bg-[#dce8e5] p-5 sm:min-h-[580px] sm:p-8">
            {/* Background green park shapes */}
            <div className="absolute inset-0 opacity-80" aria-hidden="true">
              <div className="absolute left-[10%] top-[8%] h-24 w-36 rounded-[2rem] border-2 border-[#c7dccd] bg-[#cfe3d3]" />
              <div className="absolute right-[10%] top-[42%] h-28 w-40 rounded-[2rem] border-2 border-[#c7dccd] bg-[#cfe3d3]" />
              <div className="absolute bottom-[6%] left-[34%] h-24 w-40 rounded-[2rem] border-2 border-[#c7dccd] bg-[#cfe3d3]" />
              <div className="absolute left-[7%] top-[40%] h-16 w-24 rounded-xl bg-[#cfe3d3]" />
            </div>

            {/* SVG Road Network & Route Lines */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Outer road borders */}
              <path d="M 18 68 L 32 48 L 50 48" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 32 48 L 27 35 L 22 22" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 50 48 L 59 35 L 68 22" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 50 48 L 65 60 L 78 72" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 18 68 L 48 75 L 78 72" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Inner white streets */}
              <path d="M 18 68 L 32 48 L 50 48" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 32 48 L 27 35 L 22 22" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 50 48 L 59 35 L 68 22" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 50 48 L 65 60 L 78 72" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 18 68 L 48 75 L 78 72" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Full route planned path (Light sky dash) */}
              {routeStarted && (
                <path
                  d={fullPathD}
                  stroke="#93c5fd"
                  strokeWidth="2.2"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}

              {/* Active traveled route path (Solid glowing sky blue) */}
              {routeStarted && activePathD && (
                <path
                  d={activePathD}
                  stroke="#0284c7"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}

              {/* Route step dots */}
              {routeStarted &&
                waypoints.map((wp, i) => (
                  <circle
                    key={`${wp.left}-${wp.top}-${i}`}
                    cx={wp.left}
                    cy={wp.top}
                    r={i <= routeStep ? "1.5" : "1.2"}
                    fill={i <= routeStep ? "#0284c7" : "#94a3b8"}
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                ))}
            </svg>

            {/* Street & Area Labels */}
            <div className="pointer-events-none absolute inset-0 text-[9px] font-black uppercase tracking-[0.12em] text-slate-600 sm:text-[10px] z-10">
              <span className="absolute left-[24%] top-[33%] -rotate-[60deg] rounded-md bg-white/85 px-2 py-0.5 shadow-sm">Lake Road</span>
              <span className="absolute left-[37%] top-[44%] -rotate-6 rounded-md bg-white/85 px-2 py-0.5 shadow-sm">Rose Garden Road</span>
              <span className="absolute left-[59%] top-[34%] -rotate-[52deg] rounded-md bg-white/85 px-2 py-0.5 shadow-sm">Park Lane</span>
              <span className="absolute left-[66%] top-[62%] rotate-[40deg] rounded-md bg-white/85 px-2 py-0.5 shadow-sm">Green Avenue</span>
              <span className="absolute left-[46%] top-[76%] rounded-md bg-white/85 px-2 py-0.5 shadow-sm">Riverside Lane</span>

              <span className="absolute left-[12%] top-[11%] rounded-md bg-[#e7f2e5]/90 px-2 py-1 text-emerald-800 shadow-sm">Rose Garden</span>
              <span className="absolute right-[12%] top-[50%] rounded-md bg-[#e7f2e5]/90 px-2 py-1 text-emerald-800 shadow-sm">Community Garden</span>
              <span className="absolute bottom-[9%] left-[36%] rounded-md bg-[#e7f2e5]/90 px-2 py-1 text-emerald-800 shadow-sm">Riverside Garden</span>
              <span className="absolute left-[8%] top-[43%] rounded-md bg-[#e7f2e5]/90 px-2 py-1 text-emerald-800 shadow-sm">Maple Garden</span>
            </div>

            {/* Patient Marker */}
            <div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
              style={{ left: `${patientPosition.left}%`, top: `${patientPosition.top}%` }}
            >
              <div className="relative flex items-center justify-center">
                {routeStarted && (
                  <span className="absolute h-16 w-16 animate-ping rounded-full bg-sky-400 opacity-40 sm:h-20 sm:w-20" />
                )}
                <div className="h-14 w-14 rounded-full border-4 border-white bg-slate-800 p-1 shadow-xl sm:h-16 sm:w-16">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-500 text-white">
                    <Navigation className="h-6 w-6 rotate-45 fill-white" />
                  </div>
                </div>
              </div>
            </div>

            <span
              className="absolute z-30 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-black text-white shadow-md transition-all duration-1000"
              style={{ left: `${patientPosition.left}%`, top: `calc(${patientPosition.top}% - 46px)` }}
            >
              {routeStep >= directions.length - 1 && routeStarted ? "Arrived" : liveLocationEnabled ? "Patient live" : "Location paused"}
            </span>

            {/* Saved Location Pins */}
            {locations.map((location) => {
              const isSelected = location.id === selected.id;
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelect(location.id)}
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-sky-200 ${location.position}`}
                  aria-label={`Select ${location.name}`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white text-white shadow-lg ${location.accent} ${isSelected ? "ring-4 ring-sky-300 ring-offset-2 scale-105" : ""}`}>
                    <LocationIcon type={location.type} />
                  </span>
                  <span className="mt-1 block max-w-32 rounded-lg bg-white/95 px-2 py-1 text-center text-[11px] font-black text-slate-700 shadow-sm">
                    {location.name}
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm sm:bottom-8 sm:left-8 z-10">
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
                {eta}
              </div>
              <p className="mt-1 text-xs font-semibold leading-5 text-sky-700">{description}</p>
            </div>

            <button
              type="button"
              onClick={togglePlay}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-slate-700 cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
              {routeStarted
                ? isPlaying
                  ? "Pause route"
                  : routeStep >= directions.length - 1
                  ? "Replay demo route"
                  : "Resume route"
                : "Start demo route"}
            </button>

            <button
              type="button"
              onClick={() => setLiveLocationEnabled((current) => !current)}
              className={`mt-3 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-black transition cursor-pointer ${liveLocationEnabled ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}
            >
              <span className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${liveLocationEnabled ? "animate-pulse bg-emerald-500" : "bg-slate-300"}`} />
                {liveLocationEnabled ? "Live location enabled" : "Live location paused"}
              </span>
              <span>{liveLocationEnabled ? "ON" : "OFF"}</span>
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
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition cursor-pointer ${location.id === selected.id ? "border-sky-300 bg-sky-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}
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

          {/* Gentle Directions List */}
          <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-amber-950">Gentle directions</h2>
              {routeStarted && <SpeakButton text={currentDirection} autoPlay={isPlaying} />}
            </div>
            <div className="mt-4 space-y-3">
              {directions.map((direction, index) => {
                const isCurrent = routeStarted && index === routeStep;
                const isPassed = routeStarted && index < routeStep;

                return (
                  <div
                    key={direction}
                    onClick={() => {
                      if (!routeStarted) setRouteStarted(true);
                      setRouteStep(index);
                    }}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition ${
                      isCurrent
                        ? "bg-amber-200/90 font-black text-amber-950 shadow-sm ring-2 ring-amber-400"
                        : isPassed
                        ? "text-amber-800 opacity-80"
                        : "text-amber-900 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        isCurrent
                          ? "bg-sky-600 text-white"
                          : isPassed
                          ? "bg-amber-300 text-amber-900"
                          : "bg-amber-200 text-amber-800"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-4 w-4 text-amber-900" /> : index + 1}
                    </span>
                    <span className="text-sm leading-tight">{direction}</span>
                    {index < directions.length - 1 && <ArrowRight className="ml-auto h-4 w-4 text-amber-500 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-500">
            <Square className="h-4 w-4 shrink-0 fill-slate-300 text-slate-300" />
            Prototype mode: locations and routes are sample data.
          </div>
        </aside>
      </div>
    </div>
  );
}
