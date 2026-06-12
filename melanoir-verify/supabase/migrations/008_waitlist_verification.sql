-- 008: 베타테스터 인증 — SMS 본인 인증 기록 + 선정 후 DM 코드 인증
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'applied';
ALTER TABLE mnr_waitlist DROP CONSTRAINT IF EXISTS mnr_waitlist_status_check;
ALTER TABLE mnr_waitlist ADD CONSTRAINT mnr_waitlist_status_check
  CHECK (status IN ('applied', 'selected', 'confirmed'));
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS dm_code TEXT;
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS dm_code_sent_at TIMESTAMPTZ;
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS dm_verified_at TIMESTAMPTZ;
