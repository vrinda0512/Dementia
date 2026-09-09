import { createClient } from "./client";
import { isSupabaseConfigured, DEFAULT_PATIENT_ID } from "./config";
import type {
  Patient,
  Caregiver,
  FamilyMember,
  Routine,
  PersonalizationQuestion,
  Reminder,
  GameSession,
  Metrics,
  Alert,
  Memory,
  Game,
  MemoryCategory,
  GameFormat,
} from "@/lib/types";

function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createClient();
  } catch (err) {
    console.warn("Supabase client init failed:", err);
    return null;
  }
}

function mapPatient(data: any): Patient {
  return {
    id: data.id,
    name: data.name,
    age: data.age ?? undefined,
    preferredLanguage: data.preferred_language ?? data.preferredLanguage,
    location: data.location ?? undefined,
    avatar: data.avatar ?? data.avatar_url,
    avatarUrl: data.avatar ?? data.avatar_url,
    caregiverId: data.caregiver_id ?? data.caregiverId,
    phone: data.phone ?? data.phone_number ?? data.phoneNumber,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapFamily(item: any): FamilyMember {
  return {
    id: item.id,
    patientId: item.patient_id,
    name: item.name,
    relationship: String(item.relationship || "").toLowerCase(),
    photoUrl: item.photo_url ?? item.photoUrl,
    createdAt: item.created_at,
  };
}

function mapRoutine(item: any): Routine {
  return {
    id: item.id,
    patientId: item.patient_id,
    label: item.label,
    emoji: item.emoji,
    description: item.description,
    location: item.location,
    timeOfDay: item.time_of_day,
    stepOrder: item.step_order ?? item.order ?? 1,
    order: item.step_order ?? item.order ?? 1,
    active: item.active !== false,
    createdAt: item.created_at,
  };
}

function parseOptions(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function mapQuestion(item: any): PersonalizationQuestion {
  return {
    id: item.id,
    patientId: item.patient_id,
    category: item.category as MemoryCategory,
    question: item.question,
    answer: item.answer,
    options: parseOptions(item.options),
    format: (item.format || "multiple-choice") as GameFormat,
    image: item.image,
    audio: item.audio,
    createdAt: item.created_at,
  };
}

function mapReminder(item: any): Reminder {
  return {
    id: item.id,
    patientId: item.patient_id,
    type: item.type || "general",
    title: item.title,
    description: item.description,
    scheduledTime: item.scheduled_time || item.scheduledTime,
    patientPhone: item.patient_phone || item.patientPhone,
    scheduledFor: item.scheduled_for || item.scheduledFor,
    status: item.status || "scheduled",
    completed: Boolean(item.completed),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapMetrics(data: any): Metrics {
  return {
    id: data.id,
    patientId: data.patient_id,
    memoryScore: Number(data.memory_score) || 0,
    attentionScore: Number(data.attention_score) || 0,
    routineRecallScore: Number(data.routine_recall_score) || 0,
    recognitionScore: Number(data.recognition_score) || 0,
    averageAccuracy: Number(data.average_accuracy) || 0,
    averageResponseTime: Number(data.average_response_time) || 0,
    calculatedAt: data.calculated_at,
    createdAt: data.created_at,
  };
}

function mapAlert(item: any): Alert {
  return {
    id: item.id,
    patientId: item.patient_id,
    type: item.type,
    severity: item.severity,
    title: item.title,
    message: item.message,
    acknowledged: Boolean(item.acknowledged),
    createdAt: item.created_at,
    acknowledgedAt: item.acknowledged_at,
  };
}

function mapMemory(item: any): Memory {
  const peopleRaw = item.people ?? item.people_involved;
  let people: string[] | undefined;
  if (Array.isArray(peopleRaw)) people = peopleRaw.map(String);
  else if (typeof peopleRaw === "string") {
    try {
      const parsed = JSON.parse(peopleRaw);
      people = Array.isArray(parsed) ? parsed.map(String) : peopleRaw.split(",").map((s) => s.trim());
    } catch {
      people = peopleRaw.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  return {
    id: item.id,
    patientId: item.patient_id,
    title: item.title,
    description: item.description ?? item.content ?? "",
    category: (item.category || "other") as Memory["category"],
    people,
    date: item.memory_date ?? item.date,
    imageUrl: item.image_url ?? item.imageUrl,
    createdAt: item.created_at,
  };
}

function mapSession(item: any): GameSession {
  return {
    id: item.id,
    patientId: item.patient_id,
    gameId: item.game_id,
    difficulty: Number(item.difficulty) || 1,
    score: Number(item.score) || 0,
    accuracy: Number(item.accuracy) || 0,
    attempts: Number(item.attempts) || 0,
    responseTime: Number(item.response_time) || 0,
    hintsUsed: Number(item.hints_used) || 0,
    completed: Boolean(item.completed),
    abandoned: Boolean(item.abandoned),
    startedAt: item.started_at,
    completedAt: item.completed_at,
    createdAt: item.created_at,
  };
}

function mapGame(item: any): Game {
  return {
    id: item.id,
    name: item.name,
    type: item.type || item.category || "cognitive",
    description: item.description,
    minDifficulty: Number(item.min_difficulty) || 1,
    maxDifficulty: Number(item.max_difficulty) || 5,
    active: item.active !== false,
    createdAt: item.created_at,
  };
}

// ─── PATIENTS / RBAC ───────────────────────────────────────
export const patientService = {
  async getPatientsForCaregiver(caregiverId: string): Promise<Patient[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("caregiver_id", caregiverId)
      .order("name", { ascending: true });

    if (error) {
      console.error("getPatientsForCaregiver:", error);
      return [];
    }
    return (data || []).map(mapPatient);
  },

  async getAllPatients(): Promise<Patient[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("getAllPatients:", error);
      return [];
    }
    return (data || []).map(mapPatient);
  },

  async getPatient(patientId: string): Promise<Patient | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getPatient:", error);
      return null;
    }
    return mapPatient(data);
  },

  async updatePatient(patientId: string, updates: Partial<Patient>): Promise<Patient | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.age !== undefined) payload.age = updates.age;
    if (updates.preferredLanguage !== undefined) payload.preferred_language = updates.preferredLanguage;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.avatar !== undefined || updates.avatarUrl !== undefined) {
      payload.avatar = updates.avatar || updates.avatarUrl;
    }
    if (updates.phone !== undefined) payload.phone = updates.phone;

    const { data, error } = await supabase
      .from("patients")
      .update(payload)
      .eq("id", patientId)
      .select()
      .single();

    if (error || !data) {
      console.error("updatePatient:", error);
      return null;
    }
    return mapPatient(data);
  },

  async createPatient(patient: Omit<Patient, "id">): Promise<Patient | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const payload = {
      name: patient.name,
      age: patient.age || 70,
      preferred_language: patient.preferredLanguage || "English",
      location: patient.location || "New Delhi",
      caregiver_id: patient.caregiverId,
      phone: patient.phone || null,
    };

    const { data, error } = await supabase
      .from("patients")
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      console.error("createPatient:", error);
      return null;
    }
    return mapPatient(data);
  },
};

export const caregiverService = {
  /** Optional caregivers table — falls back to derived profile from patients. */
  async getCaregiver(caregiverId: string): Promise<Caregiver | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("caregivers")
      .select("*")
      .eq("id", caregiverId)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role || "caregiver",
      };
    }

    // Fallback: no caregivers table — invent a display profile for the id
    return {
      id: caregiverId,
      name: "Caregiver",
      email: "caregiver@smarika.care",
      role: "caregiver",
    };
  },

  async findCaregiverByEmail(email: string): Promise<Caregiver | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("caregivers")
      .select("*")
      .ilike("email", email.trim())
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role || "caregiver",
    };
  },
};

// ─── FAMILY MEMBERS ───────────────────────────────────────
export const familyService = {
  async getFamilyMembers(patientId: string): Promise<FamilyMember[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getFamilyMembers:", error);
      return [];
    }
    return (data || []).map(mapFamily);
  },

  async addFamilyMember(
    member: Omit<FamilyMember, "id" | "createdAt">
  ): Promise<FamilyMember | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("family_members")
      .insert({
        patient_id: member.patientId,
        name: member.name,
        relationship: member.relationship.toLowerCase(),
        photo_url: member.photoUrl || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("addFamilyMember:", {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      });
      throw new Error(error?.message || "Unable to add family member");
    }
    return mapFamily(data);
  },

  async deleteFamilyMember(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase.from("family_members").delete().eq("id", id);
    if (error) {
      console.error("deleteFamilyMember:", error);
      return false;
    }
    return true;
  },
};

// ─── ROUTINES ──────────────────────────────────────────────
export const routineService = {
  async getRoutines(patientId: string): Promise<Routine[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .eq("patient_id", patientId)
      .order("step_order", { ascending: true });

    if (error) {
      console.error("getRoutines:", error);
      return [];
    }
    return (data || []).map(mapRoutine);
  },

  async addRoutine(routine: Omit<Routine, "id">): Promise<Routine | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("routines")
      .insert({
        patient_id: routine.patientId,
        label: routine.label,
        emoji: routine.emoji || "✨",
        description: routine.description || "",
        location: routine.location || "Home",
        time_of_day: routine.timeOfDay || "09:00:00",
        step_order: routine.stepOrder || routine.order || 1,
        active: routine.active !== false,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("addRoutine:", error);
      return null;
    }
    return mapRoutine(data);
  },

  async deleteRoutine(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (error) {
      console.error("deleteRoutine:", error);
      return false;
    }
    return true;
  },
};

// ─── PERSONALIZATION QUESTIONS ─────────────────────────────
export const questionService = {
  async getQuestions(patientId: string): Promise<PersonalizationQuestion[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("personalization_questions")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getQuestions:", error);
      return [];
    }
    return (data || []).map(mapQuestion);
  },

  async addQuestion(
    question: Omit<PersonalizationQuestion, "id">
  ): Promise<PersonalizationQuestion | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("personalization_questions")
      .insert({
        patient_id: question.patientId || DEFAULT_PATIENT_ID,
        category: question.category,
        question: question.question,
        answer: question.answer,
        options: question.options || [],
        format: question.format,
      })
      .select()
      .single();

    // if (error || !data) {
    //   console.error("addQuestion:", {
    //     code: error?.code,
    //     message: error?.message,
    //     details: error?.details,
    //     hint: error?.hint,
    //   });
    //   return null;
    // }
    if (error || !data) {
      console.error("addQuestion FULL ERROR:", error);
      console.error("addQuestion ERROR JSON:", JSON.stringify(error, null, 2));
      console.error("addQuestion DATA:", data);
    }
    return mapQuestion(data);
  },

  async deleteQuestion(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase
      .from("personalization_questions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteQuestion:", error);
      return false;
    }
    return true;
  },
};

// ─── REMINDERS ─────────────────────────────────────────────
export const reminderService = {
  async getReminders(patientId: string): Promise<Reminder[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("patient_id", patientId)
      .order("scheduled_time", { ascending: true });

    if (error) {
      console.error("getReminders:", error);
      return [];
    }
    return (data || []).map(mapReminder);
  },

//   async addReminder(
//     reminder: Omit<Reminder, "id" | "completed">
//   ): Promise<Reminder | null> {
//     const supabase = getSupabase();
//     if (!supabase) return null;

//     const { data, error } = await supabase
//       .from("reminders")
//       .insert({
//         patient_id: reminder.patientId,
//         type: reminder.type,
//         title: reminder.title,
//         description: reminder.description || "",
//         scheduled_time: reminder.scheduledTime,
//         //recurring: reminder.recurring || "Daily",
//         completed: false,
//         //active: reminder.active !== false,
//       })
//       .select()
//       .single();

//     //if (error || !data) {
//     //  console.error("addReminder:", error);
//     //  return null;
//     //}
//     if (error || !data) {
//       console.error("addReminder FULL ERROR:", error);
//       console.error(
//         "addReminder ERROR JSON:",
//         JSON.stringify(error, null, 2)
//       );
//     console.error("addReminder DATA:", data);
//     return null;
// }
//     return mapReminder(data);
//   },

async addReminder(
  reminder: Omit<Reminder, "id" | "completed">
): Promise<Reminder | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  console.log("ADDING REMINDER:", reminder);

  const { data, error } = await supabase
    .from("reminders")
    .insert({
      patient_id: reminder.patientId,
      type: reminder.type,
      title: reminder.title,
      description: reminder.description || "",
      scheduled_time: reminder.scheduledTime,
      completed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("========== ADD REMINDER ERROR ==========");
    console.error("message:", error.message);
    console.error("details:", error.details);
    console.error("hint:", error.hint);
    console.error("code:", error.code);
    console.error("========================================");
    return null;
  }

  if (!data) {
    console.error("addReminder: No data returned");
    return null;
  }

  console.log("REMINDER ADDED SUCCESSFULLY:", data);

  return mapReminder(data);
},


  async toggleReminder(id: string, completed: boolean): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase
      .from("reminders")
      .update({ completed, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("toggleReminder:", error);
      return false;
    }
    return true;
  },

  async deleteReminder(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) {
      console.error("deleteReminder:", error);
      return false;
    }
    return true;
  },
};

// ─── METRICS & ALERTS ──────────────────────────────────────
export const metricsService = {
  async getMetrics(patientId: string): Promise<Metrics[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("cognitive_metrics")
      .select("*")
      .eq("patient_id", patientId)
      .order("calculated_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("getMetrics:", error);
      return [];
    }
    return (data || []).map(mapMetrics);
  },
};

export const alertService = {
  async getAlerts(patientId: string): Promise<Alert[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("caregiver_alerts")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getAlerts:", error);
      return [];
    }
    return (data || []).map(mapAlert);
  },

  async acknowledgeAlert(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase
      .from("caregiver_alerts")
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("acknowledgeAlert:", error);
      return false;
    }
    return true;
  },
};

// ─── MEMORIES (diary_entries) ──────────────────────────────
export const memoryService = {
  async getMemories(patientId: string): Promise<Memory[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getMemories:", error);
      return [];
    }
    return (data || []).map(mapMemory);
  },

  async addMemory(memory: Omit<Memory, "id" | "createdAt">): Promise<Memory | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("diary_entries")
      .insert({
        patient_id: memory.patientId,
        title: memory.title,
        description: memory.description,
        category: memory.category,
        people: memory.people || [],
        memory_date: memory.date || null,
        image_url: memory.imageUrl || null,
      })
      .select()
      .single();

    if (error || !data) {
      // Retry with `content` column if schema uses that instead of description
      const retry = await supabase
        .from("diary_entries")
        .insert({
          patient_id: memory.patientId,
          title: memory.title,
          content: memory.description,
          category: memory.category,
          people: memory.people || [],
          date: memory.date || null,
          image_url: memory.imageUrl || null,
        })
        .select()
        .single();

      if (retry.error || !retry.data) {
        console.error("addMemory:", error || retry.error);
        return null;
      }
      return mapMemory(retry.data);
    }
    return mapMemory(data);
  },
};

// ─── GAMES & SESSIONS ──────────────────────────────────────
export const gameService = {
  async getGames(): Promise<Game[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("getGames:", error);
      return [];
    }
    return (data || []).map(mapGame);
  },

  async setGameActive(id: string, active: boolean): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { error } = await supabase.from("games").update({ active }).eq("id", id);
    if (error) {
      console.error("setGameActive:", error);
      return false;
    }
    return true;
  },
};

export const gameSessionService = {
  async getSessions(patientId: string, gameId?: string): Promise<GameSession[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    let query = supabase
      .from("game_sessions")
      .select("*")
      .eq("patient_id", patientId)
      .order("started_at", { ascending: false });

    if (gameId) query = query.eq("game_id", gameId);

    const { data, error } = await query;
    if (error) {
      console.error("getSessions:", error);
      return [];
    }
    return (data || []).map(mapSession);
  },

  async recordSession(
    session: Omit<GameSession, "id" | "createdAt">
  ): Promise<GameSession | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("game_sessions")
      .insert({
        patient_id: session.patientId,
        game_id: session.gameId,
        difficulty: session.difficulty,
        score: session.score,
        accuracy: session.accuracy,
        attempts: session.attempts,
        response_time: session.responseTime,
        hints_used: session.hintsUsed,
        completed: session.completed,
        abandoned: session.abandoned || false,
        started_at: session.startedAt || new Date().toISOString(),
        completed_at: session.completedAt || new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error("recordSession:", error);
      return null;
    }
    return mapSession(data);
  },
};
