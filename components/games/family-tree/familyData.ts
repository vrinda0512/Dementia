import { FamilyMember, FamilyRelationship } from "./types";

/** Fixed tree card positions by relationship — independent of entry order. */
export const RELATIONSHIP_POSITIONS: Record<
  string,
  { left: string; top: string }
> = {
  grandmother: { left: "35%", top: "15%" },
  grandfather: { left: "59%", top: "15%" },
  mother: { left: "23%", top: "32%" },
  father: { left: "77%", top: "32%" },
  sister: { left: "20%", top: "49%" },
  me: { left: "51%", top: "39%" },
  brother: { left: "77%", top: "52%" },
};

const FALLBACK_PHOTOS: Record<string, string> = {
  grandmother: "/family/grandmother.jpg",
  grandfather: "/family/grandfather.jpg",
  mother: "/family/mother.jpg",
  father: "/family/father.jpg",
  sister: "/family/sister.jpg",
  me: "/family/me.jpg",
  brother: "/family/brother.jpg",
};

/** Bundled demo used only when Supabase has no family_members for the patient. */
export const familyMembers: FamilyMember[] = [
  {
    id: "grandmother",
    name: "Grandmother",
    relationship: "grandmother",
    photo: "/family/grandmother.jpg",
    position: RELATIONSHIP_POSITIONS.grandmother,
  },
  {
    id: "grandfather",
    name: "Grandfather",
    relationship: "grandfather",
    photo: "/family/grandfather.jpg",
    position: RELATIONSHIP_POSITIONS.grandfather,
  },
  {
    id: "mother",
    name: "Mother",
    relationship: "mother",
    photo: "/family/mother.jpg",
    position: RELATIONSHIP_POSITIONS.mother,
  },
  {
    id: "father",
    name: "Father",
    relationship: "father",
    photo: "/family/father.jpg",
    position: RELATIONSHIP_POSITIONS.father,
  },
  {
    id: "sister",
    name: "Sister",
    relationship: "sister",
    photo: "/family/sister.jpg",
    position: RELATIONSHIP_POSITIONS.sister,
  },
  {
    id: "me",
    name: "Me",
    relationship: "me",
    photo: "/family/me.jpg",
    position: RELATIONSHIP_POSITIONS.me,
  },
  {
    id: "brother",
    name: "Brother",
    relationship: "brother",
    photo: "/family/brother.jpg",
    position: RELATIONSHIP_POSITIONS.brother,
  },
];

export function mapDbFamilyToGameMembers(
  rows: {
    id: string;
    name: string;
    relationship: string;
    photoUrl?: string;
  }[]
): FamilyMember[] {
  return rows.map((row) => {
    const rel = row.relationship.toLowerCase() as FamilyRelationship;
    const position =
      RELATIONSHIP_POSITIONS[rel] ||
      RELATIONSHIP_POSITIONS.me ||
      { left: "50%", top: "50%" };

    return {
      id: row.id,
      name: row.name,
      relationship: rel,
      photo: row.photoUrl || FALLBACK_PHOTOS[rel] || "/family/me.jpg",
      position,
    };
  });
}

export async function loadFamilyForGame(patientId: string): Promise<FamilyMember[]> {
  try {
    const { familyService } = await import("@/lib/supabase/services");
    const rows = await familyService.getFamilyMembers(patientId);
    if (!rows.length) return [];
    return mapDbFamilyToGameMembers(rows);
  } catch (e) {
    console.error("loadFamilyForGame:", e);
    return [];
  }
}
