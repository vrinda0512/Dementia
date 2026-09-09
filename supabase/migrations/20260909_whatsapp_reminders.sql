-- Migration: Add WhatsApp phone and schedule tracking for Smarika
-- Run this script in your Supabase SQL Editor if you are connecting to a live Supabase DB

-- 1. Add phone number column to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Add scheduled_for, status, and patient_phone tracking to reminders table
ALTER TABLE reminders 
ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS patient_phone TEXT;
