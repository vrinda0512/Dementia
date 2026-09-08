import { redirect } from "next/navigation";

export default function Home() {
  redirect("/games/therapeutic-tea-room");
}
"use client";

export default function HomePage() {
  return <main className="min-h-screen bg-[#f8f3e8]" />;
}
