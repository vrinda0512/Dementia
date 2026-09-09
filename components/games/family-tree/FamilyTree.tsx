"use client";

import { FamilyMember } from "./types";

interface FamilyTreeProps {
  members: FamilyMember[];
  onMemberClick: (member: FamilyMember) => void;
  matchedMemberIds: string[];
  selectedMemberId: string | null;
  incorrectMemberId: string | null;
}

export default function FamilyTree({
  members,
  onMemberClick,
  matchedMemberIds,
  selectedMemberId,
  incorrectMemberId,
}: FamilyTreeProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-[#f5f1df] shadow-xl sm:border-8">
      <div className="relative aspect-[703/735] w-full overflow-hidden bg-[#f5f1df]">
        <img
          src="/family-tree/familytree.jpg"
          alt="A leafy family tree in a green hillside landscape"
          className="absolute inset-0 h-full w-full object-contain"
        />

        {members.map((member) => {
          const isMatched = matchedMemberIds.includes(member.id);
          const isSelected = selectedMemberId === member.id;
          const isIncorrect = incorrectMemberId === member.id;

          return (
            <button
              key={member.id}
              type="button"
              aria-label={`${member.name}, ${member.relationship}`}
              aria-pressed={isMatched || isSelected}
              className={`group absolute z-10 flex h-[clamp(4.25rem,11vw,5.5rem)] w-[clamp(4.25rem,11vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border-4 p-1 transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#f4c979] ${
                isMatched
                  ? "border-[#78b477] bg-[#e7f5e3] shadow-[0_0_0_6px_rgba(120,180,119,0.28),0_8px_20px_rgba(53,80,49,0.22)]"
                  : isIncorrect
                    ? "border-[#d97878] bg-[#fce8e8] shadow-[0_0_0_6px_rgba(217,120,120,0.22),0_8px_20px_rgba(53,80,49,0.18)]"
                    : isSelected
                      ? "border-[#e6ad4d] bg-[#fff7dc] shadow-[0_0_0_6px_rgba(230,173,77,0.24),0_8px_20px_rgba(53,80,49,0.18)]"
                  : "border-white/90 bg-white/95 shadow-lg hover:scale-105 hover:border-[#f5c96b]"
              }`}
              style={{
                left: member.position.left,
                top: member.position.top,
              }}
              onClick={() => onMemberClick(member)}
              disabled={isMatched}
            >
              <img
                src={member.photo}
                alt={member.name}
                className="h-[clamp(2.25rem,7vw,3.15rem)] w-[clamp(2.25rem,7vw,3.15rem)] rounded-xl object-cover"
              />

              <span className="max-w-full truncate px-1 text-[11px] font-extrabold text-[#2d4b3c] sm:text-xs">
                {member.name}
              </span>
              {isMatched && <span className="text-[10px] font-bold text-[#66825a]">Remembered</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}