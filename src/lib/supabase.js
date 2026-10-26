import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[PyLearn] Supabase env vars not set — running in localStorage-only mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseReady = !!supabase

/* ─────────────────────────────────────────────────────────────────
   SQL — run ALL of this in Supabase SQL Editor (one shot):

   -- 1. Profiles table
   CREATE TABLE IF NOT EXISTS public.profiles (
     id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     email       TEXT NOT NULL,
     name        TEXT NOT NULL,
     register_no TEXT NOT NULL UNIQUE,
     section     TEXT NOT NULL,
     slot        TEXT NOT NULL,
     avatar      TEXT NOT NULL DEFAULT '🧑',
     created_at  TIMESTAMPTZ DEFAULT NOW()
   );
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users manage own profile" ON public.profiles USING (auth.uid() = id);

   -- 2. Quiz scores
   CREATE TABLE IF NOT EXISTS public.quiz_scores (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     tab_key TEXT NOT NULL, score INT NOT NULL, total INT NOT NULL,
     pct INT NOT NULL, passed BOOLEAN NOT NULL,
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, tab_key)
   );
   ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users manage own quiz scores" ON public.quiz_scores USING (auth.uid() = user_id);

   -- 3. Test scores
   CREATE TABLE IF NOT EXISTS public.test_scores (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     test_id TEXT NOT NULL, score INT NOT NULL, total INT NOT NULL, pct INT NOT NULL,
     grade TEXT NOT NULL, label TEXT NOT NULL, emoji TEXT NOT NULL,
     time_used INT NOT NULL,
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(user_id, test_id)
   );
   ALTER TABLE public.test_scores ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users manage own test scores" ON public.test_scores USING (auth.uid() = user_id);

   -- 4. RPC: look up email by register number (called before login, so security definer needed)
   CREATE OR REPLACE FUNCTION public.get_email_by_register_no(reg_no TEXT)
   RETURNS TEXT
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public
   AS $$
   DECLARE v_email TEXT;
   BEGIN
     SELECT email INTO v_email FROM public.profiles WHERE register_no = reg_no LIMIT 1;
     RETURN v_email;
   END;
   $$;
   GRANT EXECUTE ON FUNCTION public.get_email_by_register_no(TEXT) TO anon, authenticated;

   -- 5. Add is_admin column (run once)
   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

   -- 6. Admin report RPC (returns all students' data — admin only)
   CREATE OR REPLACE FUNCTION public.get_all_student_reports()
   RETURNS JSON
   LANGUAGE plpgsql
   SECURITY DEFINER
   SET search_path = public
   AS $$
   DECLARE result JSON;
   BEGIN
     IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
       RAISE EXCEPTION 'Unauthorized';
     END IF;
     SELECT json_build_object(
       'profiles',    (SELECT json_agg(row_to_json(p)) FROM public.profiles p WHERE NOT COALESCE(p.is_admin, false)),
       'quiz_scores', (SELECT json_agg(row_to_json(q)) FROM public.quiz_scores q),
       'test_scores', (SELECT json_agg(row_to_json(t)) FROM public.test_scores t)
     ) INTO result;
     RETURN result;
   END;
   $$;
   GRANT EXECUTE ON FUNCTION public.get_all_student_reports() TO authenticated;

   -- 7. Add answers column to test_scores (run once)
   ALTER TABLE public.test_scores ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}';

   -- 8. Quiz questions table (admin-managed, replaces static questions per tab)
   CREATE TABLE IF NOT EXISTS public.quiz_questions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     module_id INT NOT NULL,
     tab_key TEXT NOT NULL,
     question TEXT NOT NULL,
     options JSONB NOT NULL DEFAULT '[]',
     correct_answer INT NOT NULL DEFAULT 0,
     explanation TEXT DEFAULT '',
     order_num INT DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Authenticated read quiz_questions" ON public.quiz_questions FOR SELECT USING (auth.role() = 'authenticated');
   CREATE POLICY "Admins write quiz_questions" ON public.quiz_questions FOR ALL USING (
     EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
   );

   -- 9. Custom learning modules (admin-created, visible to students when published)
   CREATE TABLE IF NOT EXISTS public.learning_modules (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     module_num INT NOT NULL,
     title TEXT NOT NULL,
     description TEXT DEFAULT '',
     color TEXT DEFAULT '#3b82f6',
     icon TEXT DEFAULT '📚',
     is_published BOOL DEFAULT false,
     tabs JSONB DEFAULT '[]',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Students read published modules" ON public.learning_modules FOR SELECT USING (
     is_published = true OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
   );
   CREATE POLICY "Admins write learning_modules" ON public.learning_modules FOR ALL USING (
     EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
   );

   -- To make someone admin, run:
   -- UPDATE public.profiles SET is_admin = true WHERE register_no = 'TEACHER_REG';
   -- Or set it directly in the Supabase Table Editor.
────────────────────────────────────────────────────────────────── */
