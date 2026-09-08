"use client";

import { FamilyMember } from "./types";

interface FamilyPostcardProps {
  member: FamilyMember;
  selected?: boolean;
  matched?: boolean;
  incorrect?: boolean;
  onClick: () => void;
}

export default function FamilyPostcard({
  member,
  selected,
  matched,
  incorrect,
  onClick,
}: FamilyPostcardProps) {
  return (
    <button
      type="button"
      aria-label={`Choose ${member.name}, ${member.relationship}`}
      aria-pressed={selected || matched}
      disabled={matched}
      className={`group relative mx-auto flex aspect-square w-full max-w-44 items-center justify-center rounded-2xl border-2 bg-white/65 p-2 text-left shadow-[0_5px_0_#e5d8bd]/70 backdrop-blur-sm transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#f4c979] ${
        matched
          ? "border-[#78b477] bg-[#e7f5e3] opacity-75 shadow-none"
          : incorrect
            ? "border-[#d97878] bg-[#fce8e8] shadow-[0_7px_0_#d99a9a]"
          : selected
            ? "-translate-y-1 border-[#e6ad4d] bg-[#fff7dc] shadow-[0_7px_0_#d3b36e]"
            : "border-[#eadfc9] hover:-translate-y-1 hover:border-[#d8b269]"
      }`}
      onClick={onClick}
    >
      <div className="relative h-full w-full rounded-xl bg-[#e9d6b3] p-1">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>

    </button>
  );
}