import * as THREE from "three";

export type TherapeuticGameContext = {
  patientId: string;
  locale: string;
  therapeuticConfig: {
    sensoryMode: "quiet" | "standard";
    preferredObjects?: InteractiveObjectId[];
  };
  accessibility: {
    reducedMotion: boolean;
    soundEnabled: boolean;
  };
  routine?: Array<{
    id: string;
    label: string;
    location: string;
  }>;
};

export type TherapeuticSessionEvent =
  | {
      type: "session_started";
      patientId: string;
      gameId: "therapeutic-tea-room-2-AG";
      timestamp: string;
    }
  | {
      type: "object_interacted";
      patientId: string;
      gameId: "therapeutic-tea-room-2-AG";
      objectId: InteractiveObjectId;
      timestamp: string;
    }
  | {
      type: "session_ended";
      patientId: string;
      gameId: "therapeutic-tea-room-2-AG";
      reason: "user_exit" | "unmounted";
      timestamp: string;
    }
  | {
      type: "round_started";
      patientId: string;
      gameId: "therapeutic-tea-room-2-AG";
      timestamp: string;
    }
  | {
      type: "item_observed";
      patientId: string;
      gameId: "therapeutic-tea-room-2-AG";
      itemId: MemoryItemId;
      hidingPlaceId: HidingPlaceId;
      timestamp: string;
    }
  | {
      type: "recall_response";
      patientId: string;
      gameId: "therapeutic-tea-room-2-AG";
      result: RecallResult;
      timestamp: string;
    }
  | {
      type: "round_completed";
      patientId: string;
      gameId: "therapeutic-tea-room-2-AG";
      itemCount: number;
      timestamp: string;
    };

export type InteractiveObjectId =
  | "kettle"
  | "cup"
  | "radio"
  | "photo"
  | "basket"
  | "window"
  | "plant";

export type MemoryItemId = "key" | "phone" | "letter" | "glasses" | "bookmark";

export type HidingPlaceId = "basket" | "kettle" | "photo";

export type MemoryItem = {
  id: MemoryItemId;
  label: string;
  prompt: string;
  description: string;
};

export type HidingPlace = {
  id: HidingPlaceId;
  objectId: Extract<InteractiveObjectId, HidingPlaceId>;
  label: string;
  revealMessage: string;
};

export type MemoryPlacement = {
  itemId: MemoryItemId;
  hidingPlaceId: HidingPlaceId;
};

export type MemoryGamePhase =
  | "welcome"
  | "observing"
  | "observation-ready"
  | "recalling"
  | "feedback"
  | "complete"
  | "explore";

export type MemoryWorldCommand = {
  id: number;
  type: "observe" | "reveal" | "reset" | "pan_left" | "pan_right";
  itemId?: MemoryItemId;
  hidingPlaceId?: HidingPlaceId;
  selectedPlaceId?: HidingPlaceId;
};

export type RecallResult = {
  itemId: MemoryItemId;
  selectedPlaceId: HidingPlaceId;
  expectedPlaceId: HidingPlaceId;
  correct: boolean;
  responseTimeMs: number;
};

export type InteractionResponse = {
  objectId: InteractiveObjectId;
  label: string;
  message: string;
  active?: boolean;
};

export type InteractiveSceneObject = {
  id: InteractiveObjectId;
  root: THREE.Group;
  label: string;
  activate: () => InteractionResponse;
  setHovered: (hovered: boolean) => void;
  update: (elapsed: number, delta: number) => void;
  dispose?: () => void;
};

export type WorldCallbacks = {
  onInteraction: (response: InteractionResponse) => void;
  onHoverChange: (label: string | null) => void;
  onWebGLFailure: () => void;
  onObservationComplete: () => void;
  onMemoryLocationSelect: (hidingPlaceId: HidingPlaceId) => void;
};
