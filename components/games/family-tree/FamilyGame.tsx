"use client";

import { useEffect, useState } from "react";
import { loadFamilyForGame } from "./familyData";
import { FamilyMember } from "./types";
import FamilyTree from "./FamilyTree";
import FamilyPostcard from "./FamilyPostcard";
import { useActivePatientId } from "@/lib/stores/app-store";

export default function FamilyGame() {
  const patientId = useActivePatientId();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [selectedSource, setSelectedSource] = useState<"tree" | "postcard" | null>(null);
  const [matchedMembers, setMatchedMembers] = useState<string[]>([]);
  const [incorrectTreeMemberId, setIncorrectTreeMemberId] = useState<string | null>(null);
  const [incorrectPostcardMemberId, setIncorrectPostcardMemberId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(
    "Choose a family card or photo, then find its match."
  );
  const [feedbackTone, setFeedbackTone] = useState<"neutral" | "positive" | "gentle">("neutral");
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const remote = await loadFamilyForGame(patientId);
      if (!mounted) return;
      setMembers(remote);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [patientId]);

  const handlePostcardClick = (member: FamilyMember) => {
    if (matchedMembers.includes(member.id)) return;
    if (selectedSource === "tree") {
      if (selectedMember?.id === member.id) {
        setMatchedMembers((previous) => [...previous, member.id]);
        setSelectedMember(null);
        setSelectedSource(null);
        setIncorrectTreeMemberId(null);
        setIncorrectPostcardMemberId(null);
        setFeedback(`Yes! That photo belongs to ${member.name}.`);
        setFeedbackTone("positive");
        return;
      }

      setIncorrectPostcardMemberId(member.id);
      setFeedback("That photo belongs to another family member. Try again.");
      setFeedbackTone("gentle");
      return;
    }

    setSelectedMember(member);
    setSelectedSource("postcard");
    setIncorrectTreeMemberId(null);
    setIncorrectPostcardMemberId(null);
    setFeedback(`Now find ${member.name} on the family tree.`);
    setFeedbackTone("neutral");
    setHintUsed(false);
  };

  const handleTreeMemberClick = (member: FamilyMember) => {
    if (matchedMembers.includes(member.id)) return;

    if (selectedSource === "tree") {
      setSelectedMember(member);
      setIncorrectTreeMemberId(null);
      setIncorrectPostcardMemberId(null);
      setFeedback(`Now find ${member.name}'s photo below.`);
      setFeedbackTone("neutral");
      return;
    }

    if (!selectedMember) {
      setSelectedMember(member);
      setSelectedSource("tree");
      setIncorrectTreeMemberId(null);
      setIncorrectPostcardMemberId(null);
      setFeedback(`Now find ${member.name}'s photo below.`);
      setFeedbackTone("neutral");
      return;
    }

    if (selectedMember.id === member.id) {
      setMatchedMembers((previous) => [...previous, member.id]);
      setSelectedMember(null);
      setSelectedSource(null);
      setIncorrectTreeMemberId(null);
      setIncorrectPostcardMemberId(null);
      setFeedback(`Yes! That is ${member.name}.`);
      setFeedbackTone("positive");
      setHintUsed(false);
      return;
    }

    setFeedback("That is okay. Look for the postcard picture and try another place.");
    setIncorrectTreeMemberId(member.id);
    setFeedbackTone("gentle");
  };

  const isComplete = members.length > 0 && matchedMembers.length === members.length;

  const handleRestart = () => {
    setSelectedMember(null);
    setSelectedSource(null);
    setMatchedMembers([]);
    setIncorrectTreeMemberId(null);
    setIncorrectPostcardMemberId(null);
    setFeedback("Choose a family card or photo, then find its match.");
    setFeedbackTone("neutral");
    setHintUsed(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef4e8]">
        <p className="text-lg font-bold text-[#315947]">Loading family…</p>
      </main>
    );
  }

  if (!members.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef4e8] px-6 text-center">
        <p className="max-w-md text-lg font-bold text-[#315947]">
          No family members yet. Add them in the caregiver Profile & Setup page (with relationship
          grandmother, grandfather, mother, father, sister, me, or brother).
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#fff8e8,transparent_32%),linear-gradient(135deg,#eef4e8_0%,#f9f1df_52%,#e7f0ee_100%)] px-4 py-6 text-[#2d4b3c] sm:px-6 md:py-10">
      <button
        type="button"
        onClick={handleRestart}
        className="absolute right-4 top-4 z-20 rounded-xl border border-[#d8b269] bg-[#fff7dc] px-3 py-2 text-sm font-extrabold text-[#8f642e] shadow-sm transition hover:bg-[#ffefb9] focus:outline-none focus:ring-4 focus:ring-[#f4c979] sm:right-6 md:right-10 md:top-6"
      >
        Restart game
      </button>
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-[#a67840]">
              A gentle memory journey
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#294737] sm:text-5xl">
              Our Family
            </h1>
            <p className="mt-2 max-w-xl text-lg leading-7 text-[#647564]">
              Place each family postcard beside the person you remember.
            </p>
            <p className="mt-1 text-sm text-[#71806e]" aria-live="polite">
              {feedback}
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/75 px-5 py-4 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-bold text-[#71806e]">Family remembered</p>
            <p className="mt-1 text-2xl font-black text-[#315947]">
              {matchedMembers.length} of {members.length}
            </p>
          </div>
        </header>

        <section
          aria-label="Family tree"
          className="rounded-[2.25rem] border border-white/80 bg-white/45 p-2 shadow-[0_20px_60px_rgba(73,92,62,0.14)] backdrop-blur-sm sm:p-4"
        >
          <FamilyTree
            members={members}
            matchedMemberIds={matchedMembers}
            selectedMemberId={selectedSource === "tree" ? selectedMember?.id ?? null : null}
            incorrectMemberId={incorrectTreeMemberId}
            onMemberClick={handleTreeMemberClick}
          />
        </section>

        <section className="mt-8" aria-labelledby="postcards-heading">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#a67840]">
                Take your time
              </p>
              <h2
                id="postcards-heading"
                className="mt-1 text-2xl font-black text-[#294737] sm:text-3xl"
              >
                Family Postcards
              </h2>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-[#dce8d7]/50 px-3 py-4 shadow-[0_16px_45px_rgba(73,92,62,0.1)] sm:px-5 sm:py-6">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
              style={{ backgroundImage: "url('/family-tree/familytree.jpg')" }}
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {members.map((member) => (
                <FamilyPostcard
                  key={member.id}
                  member={member}
                  matched={matchedMembers.includes(member.id)}
                  incorrect={incorrectPostcardMemberId === member.id}
                  selected={
                    selectedSource === "postcard" && selectedMember?.id === member.id
                  }
                  onClick={() => handlePostcardClick(member)}
                />
              ))}
            </div>
          </div>
        </section>

        {isComplete && (
          <section
            className="mt-4 rounded-[2rem] border border-[#b8d1a5] bg-[#f4faed] p-7 text-center shadow-sm"
            aria-live="polite"
          >
            <p className="text-4xl" aria-hidden="true">
              ✿
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#315947]">A beautiful family tree</h2>
            <p className="mt-2 text-lg text-[#647564]">You remembered everyone. Well done.</p>
          </section>
        )}
      </div>
    </main>
  );
}
