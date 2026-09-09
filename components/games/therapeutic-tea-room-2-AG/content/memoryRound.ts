import { HidingPlace, MemoryItem, MemoryPlacement } from "../types";

export const MEMORY_ITEMS: Record<MemoryItem["id"], MemoryItem> = {
  key: {
    id: "key",
    label: "Key",
    prompt: "Where did the key rest?",
    description: "A small brass key with a rounded ring.",
  },
  phone: {
    id: "phone",
    label: "Phone",
    prompt: "Where did the phone rest?",
    description: "A familiar dark green phone.",
  },
  letter: {
    id: "letter",
    label: "Letter",
    prompt: "Where did the letter rest?",
    description: "A small folded letter with a warm red seal.",
  },
  glasses: {
    id: "glasses",
    label: "Glasses",
    prompt: "Where did the glasses rest?",
    description: "A pair of familiar reading glasses.",
  },
  bookmark: {
    id: "bookmark",
    label: "Bookmark",
    prompt: "Where did the bookmark rest?",
    description: "A small cloth bookmark with a warm gold edge.",
  },
};

export const HIDING_PLACES: Record<HidingPlace["id"], HidingPlace> = {
  basket: {
    id: "basket",
    objectId: "basket",
    label: "Woven bamboo basket",
    revealMessage: "The basket opens gently to show the remembered place.",
  },
  kettle: {
    id: "kettle",
    objectId: "kettle",
    label: "Tea kettle",
    revealMessage: "The kettle gives a quiet little movement as the memory returns.",
  },
  photo: {
    id: "photo",
    objectId: "photo",
    label: "Family photograph",
    revealMessage: "The photograph leans forward to share the remembered place.",
  },
};

const MEMORY_ITEM_IDS = Object.keys(MEMORY_ITEMS) as MemoryItem["id"][];
const HIDING_PLACE_IDS = Object.keys(HIDING_PLACES) as HidingPlace["id"][];

function shuffled<T>(items: readonly T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[nextIndex]] = [result[nextIndex], result[index]];
  }
  return result;
}

export function createMemoryRound(): MemoryPlacement[] {
  const items = shuffled(MEMORY_ITEM_IDS);
  const places = shuffled(HIDING_PLACE_IDS);

  return items.map((itemId, index) => ({
    itemId,
    hidingPlaceId: places[index % places.length],
  }));
}
