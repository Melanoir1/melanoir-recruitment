-- =============================================
-- Phase A: 데이터 수집 필드 확장 + 사진 Storage
-- =============================================

-- 시술 조건 데이터 (시술자 입력)
ALTER TABLE mnr_procedures
  ADD COLUMN area        TEXT CHECK (area IN ('eyebrow', 'eyeliner', 'lip')),
  ADD COLUMN is_retouch  BOOLEAN,
  ADD COLUMN skin_type   TEXT CHECK (skin_type IN ('oily', 'dry', 'combination', 'sensitive')),
  ADD COLUMN device_type TEXT CHECK (device_type IN ('machine', 'manual')),
  ADD COLUMN needle_type TEXT,
  ADD COLUMN dilution    TEXT;

-- 고객 결과 데이터
ALTER TABLE mnr_registrations
  ADD COLUMN satisfaction      SMALLINT CHECK (satisfaction BETWEEN 1 AND 5),
  ADD COLUMN discomfort        TEXT[],
  ADD COLUMN consented_at      TIMESTAMPTZ,
  ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN research_consent  BOOLEAN DEFAULT FALSE;

-- 사진 버킷 (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('mnr-photos', 'mnr-photos', false)
ON CONFLICT (id) DO NOTHING;
