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
      gameId: "therapeutic-tea-room";
      timestamp: string;
    }
  | {
      type: "object_interacted";
      patientId: string;
      gameId: "therapeutic-tea-room";
      objectId: InteractiveObjectId;
      timestamp: string;
    }
  | {
      type: "session_ended";
      patientId: string;
      gameId: "therapeutic-tea-room";
      reason: "user_exit" | "unmounted";
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
};
