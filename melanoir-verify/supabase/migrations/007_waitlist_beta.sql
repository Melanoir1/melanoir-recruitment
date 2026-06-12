-- 007: 웨이트리스트 type에 'beta' 허용 + 인스타그램 컬럼
ALTER TABLE mnr_waitlist DROP CONSTRAINT mnr_waitlist_type_check;
ALTER TABLE mnr_waitlist ADD CONSTRAINT mnr_waitlist_type_check
  CHECK (type IN ('customer', 'pro', 'beta'));
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS instagram TEXT;
