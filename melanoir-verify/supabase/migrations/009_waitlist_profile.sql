-- 009: 베타 신청 프로필 (beta only, NULL 허용, 하위호환)
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS technique TEXT;        -- 주력 기법
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS techniques_all TEXT;   -- 가능 기법 (CSV, 최대 3)
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS target TEXT;           -- 주 시술 대상
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS region TEXT;           -- 활동 지역 시/도
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS region_detail TEXT;    -- 시/군/구 (자유)
