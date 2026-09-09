import Dexie, { type Table } from "dexie";
import type { Patient, GameSession, GameEvent, Reminder, Routine } from "@/lib/types";

export interface SyncQueueItem {
  id?: number;
  table: string;
  action: "insert" | "update" | "delete";
  data: any;
  createdAt: string;
}

export class SmarikaOfflineDB extends Dexie {
  patients!: Table<Patient>;
  gameSessions!: Table<GameSession>;
  gameEvents!: Table<GameEvent>;
  reminders!: Table<Reminder>;
  routines!: Table<Routine>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("SmarikaOfflineDB");
    this.version(1).stores({
      patients: "id",
      gameSessions: "id, patientId, gameId, completed",
      gameEvents: "id, sessionId, patientId",
      reminders: "id, patientId",
      routines: "id, patientId, order",
      syncQueue: "++id, table, action, createdAt",
    });
  }
}

export const offlineDB = new SmarikaOfflineDB();
