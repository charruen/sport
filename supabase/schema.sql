-- Table pour enregistrer l'avancement des séries de musculation
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INT NOT NULL,
  day_id VARCHAR(20) NOT NULL,
  exercise_id VARCHAR(50) NOT NULL,
  set_index INT NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(week_number, day_id, exercise_id, set_index)
);

-- Politiques de sécurité RLS (Row Level Security) permissives pour utilisation personnelle
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON user_progress
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous write and update" ON user_progress
  FOR ALL USING (true) WITH CHECK (true);
