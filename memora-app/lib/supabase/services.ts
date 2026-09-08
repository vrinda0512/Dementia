import { createClient } from "./client";
import type {
  Patient,
  FamilyMember,
  Routine,
  PersonalizationQuestion,
  Reminder,
  GameSession,
  Metrics,
  Alert,
  MemoryCategory,
  GameFormat,
} from "@/lib/types";

import { demoPatient, demoCaregiver } from "@/lib/mock-data/patient";
import { demoFamily } from "@/lib/mock-data/family";
import { demoRoutines } from "@/lib/mock-data/routines";
import { demoReminders } from "@/lib/mock-data/reminders";
import { demoGameSessions } from "@/lib/mock-data/game-sessions";
import { demoMetrics } from "@/lib/mock-data/metrics";
import { demoAlerts } from "@/lib/mock-data/alerts";

// Initial mock fallback for personalization questions
export const initialQuestions: PersonalizationQuestion[] = [
  {
    id: "q-1",
    patientId: "patient-001",
    category: "family",
    question: "Who is your daughter who lives in Delhi?",
    answer: "Priya",
    options: ["Priya", "Ananya", "Sunita", "Ritu"],
    format: "multiple-choice",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
  },
  {
    id: "q-2",
    patientId: "patient-001",
    category: "food",
    question: "What is your favorite morning tea beverage?",
    answer: "Green Tea",
    options: ["Green Tea", "Filter Coffee", "Hot Chocolate", "Chai"],
    format: "multiple-choice",
  },
  {
    id: "q-3",
    patientId: "patient-001",
    category: "hobbies",
    question: "Which musical instrument did you enjoy playing?",
    answer: "Sitar",
    options: ["Sitar", "Harmonium", "Flute", "Tabla"],
    format: "multiple-choice",
  },
];

// Helper to get browser Supabase client safely
function getSupabase() {
  try {
    return createClient();
  } catch (err) {
    console.warn("Supabase client initialization fallback:", err);
    return null;
  }
}

// ─── PATIENTS ──────────────────────────────────────────────
export const patientService = {
  async getPatient(): Promise<Patient> {
    const supabase = getSupabase();
    if (!supabase) return demoPatient;

    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .limit(1)
        .single();

      if (error || !data) return demoPatient;

      return {
        id: data.id,
        name: data.name,
        age: data.age,
        preferredLanguage: data.preferred_language,
        location: data.location,
        avatar: data.avatar,
        avatarUrl: data.avatar,
        caregiverId: data.caregiver_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return demoPatient;
    }
  },

  async updatePatient(updates: Partial<Patient>): Promise<Patient> {
    const supabase = getSupabase();
    if (!supabase) return { ...demoPatient, ...updates };

    try {
      const { data, error } = await supabase
        .from("patients")
        .update({
          name: updates.name,
          age: updates.age,
          preferred_language: updates.preferredLanguage,
          location: updates.location,
          avatar: updates.avatar || updates.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updates.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .select()
        .single();

      if (error || !data) return { ...demoPatient, ...updates };

      return {
        id: data.id,
        name: data.name,
        age: data.age,
        preferredLanguage: data.preferred_language,
        location: data.location,
        avatar: data.avatar,
        avatarUrl: data.avatar,
        caregiverId: data.caregiver_id,
      };
    } catch {
      return { ...demoPatient, ...updates };
    }
  },
};

// ─── FAMILY MEMBERS ───────────────────────────────────────
export const familyService = {
  async getFamilyMembers(): Promise<FamilyMember[]> {
    const supabase = getSupabase();
    if (!supabase) return demoFamily;

    try {
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error || !data || data.length === 0) return demoFamily;

      return data.map((item: any) => ({
        id: item.id,
        patientId: item.patient_id,
        name: item.name,
        relationship: item.relationship,
        photoUrl: item.photo_url,
        createdAt: item.created_at,
      }));
    } catch {
      return demoFamily;
    }
  },

  async addFamilyMember(member: Omit<FamilyMember, "id">): Promise<FamilyMember> {
    const supabase = getSupabase();
    const fallback: FamilyMember = {
      id: `family-${Date.now()}`,
      ...member,
      patientId: member.patientId || "patient-001",
    };

    if (!supabase) return fallback;

    try {
      const { data, error } = await supabase
        .from("family_members")
        .insert({
          patient_id: member.patientId || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          name: member.name,
          relationship: member.relationship,
          photo_url: member.photoUrl,
        })
        .select()
        .single();

      if (error || !data) return fallback;

      return {
        id: data.id,
        patientId: data.patient_id,
        name: data.name,
        relationship: data.relationship,
        photoUrl: data.photo_url,
        createdAt: data.created_at,
      };
    } catch {
      return fallback;
    }
  },

  async deleteFamilyMember(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return true;

    try {
      const { error } = await supabase.from("family_members").delete().eq("id", id);
      return !error;
    } catch {
      return true;
    }
  },
};

// ─── ROUTINES ──────────────────────────────────────────────
export const routineService = {
  async getRoutines(): Promise<Routine[]> {
    const supabase = getSupabase();
    if (!supabase) return demoRoutines.sort((a, b) => (a.order || 1) - (b.order || 1));

    try {
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .order("step_order", { ascending: true });

      if (error || !data || data.length === 0) return demoRoutines;

      return data.map((item: any) => ({
        id: item.id,
        patientId: item.patient_id,
        label: item.label,
        emoji: item.emoji,
        description: item.description,
        location: item.location,
        timeOfDay: item.time_of_day,
        stepOrder: item.step_order,
        order: item.step_order,
        active: item.active,
        createdAt: item.created_at,
      }));
    } catch {
      return demoRoutines;
    }
  },

  async addRoutine(routine: Omit<Routine, "id">): Promise<Routine> {
    const supabase = getSupabase();
    const fallback: Routine = {
      id: `rot-${Date.now()}`,
      ...routine,
      patientId: routine.patientId || "patient-001",
      stepOrder: routine.stepOrder || routine.order || 1,
      order: routine.stepOrder || routine.order || 1,
    };

    if (!supabase) return fallback;

    try {
      const { data, error } = await supabase
        .from("routines")
        .insert({
          patient_id: routine.patientId || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          label: routine.label,
          emoji: routine.emoji || "✨",
          description: routine.description || "",
          location: routine.location || "Home",
          time_of_day: routine.timeOfDay || "09:00:00",
          step_order: routine.stepOrder || routine.order || 1,
          active: true,
        })
        .select()
        .single();

      if (error || !data) return fallback;

      return {
        id: data.id,
        patientId: data.patient_id,
        label: data.label,
        emoji: data.emoji,
        description: data.description,
        location: data.location,
        timeOfDay: data.time_of_day,
        stepOrder: data.step_order,
        order: data.step_order,
        active: data.active,
      };
    } catch {
      return fallback;
    }
  },

  async deleteRoutine(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return true;

    try {
      const { error } = await supabase.from("routines").delete().eq("id", id);
      return !error;
    } catch {
      return true;
    }
  },
};

// ─── PERSONALIZATION QUESTIONS ─────────────────────────────
export const questionService = {
  async getQuestions(): Promise<PersonalizationQuestion[]> {
    const supabase = getSupabase();
    if (!supabase) return initialQuestions;

    try {
      const { data, error } = await supabase
        .from("personalization_questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) return initialQuestions;

      return data.map((item: any) => ({
        id: item.id,
        patientId: item.patient_id,
        category: item.category as MemoryCategory,
        question: item.question,
        answer: item.answer,
        options: item.options ? (typeof item.options === "string" ? JSON.parse(item.options) : item.options) : [],
        format: item.format as GameFormat,
        image: item.image,
        audio: item.audio,
        createdAt: item.created_at,
      }));
    } catch {
      return initialQuestions;
    }
  },

  async addQuestion(question: Omit<PersonalizationQuestion, "id">): Promise<PersonalizationQuestion> {
    const supabase = getSupabase();
    const fallback: PersonalizationQuestion = {
      id: `q-${Date.now()}`,
      ...question,
    };

    if (!supabase) return fallback;

    try {
      const { data, error } = await supabase
        .from("personalization_questions")
        .insert({
          patient_id: question.patientId || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          category: question.category,
          question: question.question,
          answer: question.answer,
          options: question.options || [],
          format: question.format,
          image: question.image,
          audio: question.audio,
        })
        .select()
        .single();

      if (error || !data) return fallback;

      return {
        id: data.id,
        patientId: data.patient_id,
        category: data.category as MemoryCategory,
        question: data.question,
        answer: data.answer,
        options: data.options,
        format: data.format as GameFormat,
        image: data.image,
        audio: data.audio,
        createdAt: data.created_at,
      };
    } catch {
      return fallback;
    }
  },

  async deleteQuestion(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return true;

    try {
      const { error } = await supabase
        .from("personalization_questions")
        .delete()
        .eq("id", id);

      return !error;
    } catch {
      return true;
    }
  },
};

// ─── REMINDERS ─────────────────────────────────────────────
export const reminderService = {
  async getReminders(): Promise<Reminder[]> {
    const supabase = getSupabase();
    if (!supabase) return demoReminders;

    try {
      const { data, error } = await supabase.from("reminders").select("*");
      if (error || !data || data.length === 0) return demoReminders;

      return data.map((item: any) => ({
        id: item.id,
        patientId: item.patient_id,
        type: item.type,
        title: item.title,
        description: item.description,
        scheduledTime: item.scheduled_time,
        completed: item.completed,
        createdAt: item.created_at,
      }));
    } catch {
      return demoReminders;
    }
  },
};

// ─── METRICS & ALERTS ──────────────────────────────────────
export const metricsService = {
  async getMetrics(): Promise<Metrics> {
    const supabase = getSupabase();
    if (!supabase) return demoMetrics[0];

    try {
      const { data, error } = await supabase
        .from("cognitive_metrics")
        .select("*")
        .limit(1)
        .single();

      if (error || !data) return demoMetrics[0];

      return {
        id: data.id,
        patientId: data.patient_id,
        memoryScore: Number(data.memory_score) || 82,
        attentionScore: Number(data.attention_score) || 78,
        routineRecallScore: Number(data.routine_recall_score) || 90,
        recognitionScore: Number(data.recognition_score) || 85,
        averageAccuracy: Number(data.average_accuracy) || 84,
        averageResponseTime: Number(data.average_response_time) || 3.4,
        calculatedAt: data.calculated_at,
      };
    } catch {
      return demoMetrics[0];
    }
  },
};

export const alertService = {
  async getAlerts(): Promise<Alert[]> {
    const supabase = getSupabase();
    if (!supabase) return demoAlerts;

    try {
      const { data, error } = await supabase.from("caregiver_alerts").select("*");
      if (error || !data || data.length === 0) return demoAlerts;

      return data.map((item: any) => ({
        id: item.id,
        patientId: item.patient_id,
        type: item.type,
        severity: item.severity as any,
        title: item.title,
        message: item.message,
        acknowledged: item.acknowledged,
        createdAt: item.created_at,
      }));
    } catch {
      return demoAlerts;
    }
  },
};
