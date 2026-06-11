-- 006: 출시 웨이트리스트 (베타 기간 출시 알림 신청)
CREATE TABLE IF NOT EXISTS mnr_waitlist (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('customer', 'pro')),
  phone TEXT NOT NULL,
  name TEXT,
  shop_name TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT true,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (phone, type)
);

-- service_role로만 접근 (정책 없음 = anon 차단)
ALTER TABLE mnr_waitlist ENABLE ROW LEVEL SECURITY;
