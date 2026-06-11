-- Phase C: 정품 등록 통합 (후기·리마인드2 컬럼)
-- 002에 marketing_consent, 003에 healing_reminder_sent_at 이미 존재 → 제외

ALTER TABLE mnr_registrations
  ADD COLUMN IF NOT EXISTS healing_review_text TEXT,
  ADD COLUMN IF NOT EXISTS longterm_review_text TEXT,
  ADD COLUMN IF NOT EXISTS healing_reminder2_sent_at TIMESTAMPTZ;
