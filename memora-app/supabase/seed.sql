-- Seed data for Memora Supabase database

-- 1. Insert Default Patient
INSERT INTO public.patients (id, name, age, preferred_language, location, avatar)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Meena Sharma',
  72,
  'English',
  'New Delhi, India',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Games
INSERT INTO public.games (id, name, type, description, min_difficulty, max_difficulty, active)
VALUES 
  ('routine-ordering', 'Routine Sequence', 'sequencing', 'Order daily morning and evening activities correctly', 1, 5, true),
  ('family-memory', 'Family Member Recognition', 'recognition', 'Identify family members and their names/relationships', 1, 5, true),
  ('hide-object', 'Object Memory & Search', 'spatial', 'Remember where common household items were placed', 1, 5, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Patient Routines
INSERT INTO public.routines (id, patient_id, label, emoji, description, location, time_of_day, step_order, active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Morning Medicine', '💊', 'Take blood pressure tablet with warm water', 'Kitchen', '08:00:00', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Light Breakfast & Tea', '🍵', 'Have oatmeal and green tea in the balcony', 'Balcony', '08:30:00', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Morning Garden Walk', '🌳', '15-minute gentle walk around the garden path', 'Garden', '09:30:00', 3, true),
  ('44444444-4444-4444-4444-444444444444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Call Daughter Priya', '📞', 'Daily morning catch-up phone call with Priya', 'Living Room', '11:00:00', 4, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Family Members
INSERT INTO public.family_members (id, patient_id, name, relationship, photo_url)
VALUES
  ('f1111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Priya Sharma', 'Daughter', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'),
  ('f2222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rohan Sharma', 'Son', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'),
  ('f3333333-3333-3333-3333-333333333333', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Aarav Sharma', 'Grandson', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Personalization Questions
INSERT INTO public.personalization_questions (id, patient_id, category, question, answer, options, format, image, audio)
VALUES
  ('q1111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'family', 'Who is your daughter who lives in Delhi?', 'Priya', '["Priya", "Ananya", "Sunita", "Ritu"]'::jsonb, 'multiple-choice', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300', null),
  ('q2222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'food', 'What is your favorite morning hot beverage?', 'Green Tea', '["Green Tea", "Filter Coffee", "Hot Chocolate", "Chai"]'::jsonb, 'multiple-choice', null, null),
  ('q3333333-3333-3333-3333-333333333333', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'hobbies', 'Which instrument did you love playing during childhood?', 'Sitar', '["Sitar", "Harmonium", "Flute", "Tabla"]'::jsonb, 'multiple-choice', null, null),
  ('q4444444-4444-4444-4444-444444444444', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'home', 'Where do you keep your daily morning medicines?', 'Kitchen Drawer', '["Kitchen Drawer", "Bedside Table", "Balcony Shelf", "Dining Table"]'::jsonb, 'multiple-choice', null, null)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Reminders
INSERT INTO public.reminders (id, patient_id, type, title, description, scheduled_time, completed)
VALUES
  ('r1111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'medicine', 'Morning BP Medicine', 'Take 1 Tablet with water after breakfast', '08:00:00', false),
  ('r2222222-2222-2222-2222-222222222222', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'activity', 'Balcony Hydration & Stretch', 'Drink 1 full glass of water and stretch', '10:30:00', false)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Cognitive Metrics
INSERT INTO public.cognitive_metrics (id, patient_id, memory_score, attention_score, routine_recall_score, recognition_score, average_accuracy, average_response_time)
VALUES
  ('m1111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 82.5, 78.0, 90.0, 85.0, 84.0, 3.4)
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Caregiver Alerts
INSERT INTO public.caregiver_alerts (id, patient_id, type, severity, title, message, acknowledged)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'routine_missed', 'medium', 'Morning Walk Slightly Delayed', 'Patient started morning walk 20 minutes later than usual schedule.', false)
ON CONFLICT (id) DO NOTHING;
