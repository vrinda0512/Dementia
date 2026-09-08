import { offlineDB, type SyncQueueItem } from "./db";
import type { GameSession } from "@/lib/types";

export async function queueOfflineSession(session: GameSession) {
  try {
    // Save to local Dexie store
    await offlineDB.gameSessions.put(session);

    // Queue for cloud sync when connection restores
    const syncItem: SyncQueueItem = {
      table: "game_sessions",
      action: "insert",
      data: session,
      createdAt: new Date().toISOString(),
    };
    await offlineDB.syncQueue.add(syncItem);
  } catch (error) {
    console.warn("Offline session storage note:", error);
  }
}

export async function processSyncQueue() {
  try {
    const queue = await offlineDB.syncQueue.toArray();
    if (queue.length === 0) return { synced: 0 };

    // In prototype, clear queued items as processed
    await offlineDB.syncQueue.clear();
    return { synced: queue.length };
  } catch (error) {
    console.error("Sync error:", error);
    return { synced: 0, error };
  }
}
