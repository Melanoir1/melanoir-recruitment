-- Phase B: 리마인드 발송 기록 + 장기(6개월) 추적
ALTER TABLE mnr_registrations
  ADD COLUMN IF NOT EXISTS healing_reminder_sent_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS longterm_reminder_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS longterm_photo_url        TEXT,
  ADD COLUMN IF NOT EXISTS longterm_registered_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS longterm_credits_issued   BOOLEAN DEFAULT FALSE;
