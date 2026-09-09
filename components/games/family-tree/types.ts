export type FamilyRelationship =
  | "grandfather"
  | "grandmother"
  | "father"
  | "mother"
  | "brother"
  | "sister"
  | "me"
  | "daughter"
  | "son"
  | "granddaughter"
  | "grandson"
  | "uncle"
  | "aunt"
  | "cousin";

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