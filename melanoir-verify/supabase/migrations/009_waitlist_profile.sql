-- 009: 베타 신청 프로필 — 주력 기법 + 주 시술 대상
-- 신청 단계 수집 (beta only). customer/pro 영향 없음. 하위호환(NULL 허용).
-- technique: 'embo' | 'hairstroke' | 'combo'
-- target:    'female' | 'male' | 'both'
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS technique TEXT;
ALTER TABLE mnr_waitlist ADD COLUMN IF NOT EXISTS target TEXT;
