export type FamilyRelationship =
  | "grandfather"
  | "grandmother"
  | "father"
  | "mother"
  | "daughter"
  | "son"
  | "granddaughter"
  | "grandson"
  | "uncle"
  | "aunt"
  | "brother"
  | "sister"
  | "cousin"
  | "me";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: FamilyRelationship;
  photo: string;

  // Position on the tree
  position: {
    left: string;
    top: string;
  };

  // Optional information for future questions
  description?: string;
}

export interface FamilyPostcard {
  memberId: string;
  title: string;
  message?: string;
}