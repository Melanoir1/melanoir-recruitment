-- =============================================
-- Melanoir 정품 추적 & 멤버십 시스템
-- Phase 0 초기 스키마
-- =============================================

-- 확장 기능
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 제조 배치
-- =============================================
CREATE TABLE lots (
  lot_id          TEXT PRIMARY KEY,       -- e.g. L-2026-04
  manufactured_at TIMESTAMPTZ NOT NULL,
  quantity        INTEGER NOT NULL,
  qc_result       TEXT NOT NULL CHECK (qc_result IN ('pass', 'fail')),
  qc_document_url TEXT
);

-- =============================================
-- 제품 (시리얼)
-- =============================================
CREATE TABLE products (
  internal_id   SERIAL PRIMARY KEY,
  serial_token  TEXT UNIQUE NOT NULL,     -- HMAC 토큰 (노출 코드, 형식: XXXX-XXXX-XXXX-XXXX)
  lot_id        TEXT REFERENCES lots(lot_id),
  product_type  TEXT NOT NULL DEFAULT 'main' CHECK (product_type IN ('main', 'retouch')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_serial_token ON products(serial_token);

-- =============================================
-- 시술자
-- =============================================
CREATE TABLE practitioners (
  practitioner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  shop_name       TEXT NOT NULL,
  phone           TEXT UNIQUE NOT NULL,
  region          TEXT,
  tier            TEXT DEFAULT 'basic' CHECK (tier IN ('basic', 'silver', 'gold', 'partner')),
  tier_updated_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 출고·배송
-- =============================================
CREATE TABLE shipments (
  shipment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_id_from INTEGER,
  internal_id_to   INTEGER,
  waybill_no       TEXT,
  carrier          TEXT,
  shop_name        TEXT,
  shipped_at       TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ            -- Sweettracker 웹훅으로 자동 기록
);

CREATE INDEX idx_shipments_waybill ON shipments(waybill_no);

-- =============================================
-- 시술 등록 (시술자 입력)
-- =============================================
CREATE TABLE procedures (
  procedure_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_token    TEXT UNIQUE REFERENCES products(serial_token),
  practitioner_id UUID REFERENCES practitioners(practitioner_id),
  procedure_at    DATE NOT NULL,
  technique       TEXT NOT NULL CHECK (technique IN ('hairstroke', 'combo', 'machine_gradient')),
  customer_phone  TEXT,                   -- 암호화 저장 (pgp_sym_encrypt 사용)
  registered_at   TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 고객 정품 등록
-- =============================================
CREATE TABLE registrations (
  reg_id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_token            TEXT UNIQUE REFERENCES products(serial_token),
  customer_name           TEXT,
  customer_phone          TEXT,           -- 암호화 저장
  review_text             TEXT,
  photo_url               TEXT,           -- 시술 직후 사진
  healing_photo_url       TEXT,           -- 힐링 완료 사진
  credits_issued          BOOLEAN DEFAULT FALSE,
  healing_credits_issued  BOOLEAN DEFAULT FALSE,
  registered_at           TIMESTAMPTZ DEFAULT NOW(),
  healing_registered_at   TIMESTAMPTZ
);

-- =============================================
-- 크레딧 원장 (ledger 방식)
-- =============================================
CREATE TABLE credits (
  credit_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('customer', 'practitioner')),
  owner_id   TEXT NOT NULL,              -- customer phone or practitioner_id
  amount     INTEGER NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('earn', 'spend')),
  reason     TEXT,
  expires_at TIMESTAMPTZ,               -- 발급 후 24개월
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credits_owner ON credits(owner_type, owner_id);

-- =============================================
-- 리터칭 잉크 발송
-- =============================================
CREATE TABLE retouch_dispatches (
  dispatch_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_serial  TEXT REFERENCES products(serial_token),
  r_serial       TEXT,                  -- MNR-R-XXXX 형식 내부 추적용
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dispatched')),
  approved_at    TIMESTAMPTZ,
  dispatched_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SMS 인증 (임시 OTP 보관)
-- =============================================
CREATE TABLE sms_verifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      TEXT NOT NULL,
  code       TEXT NOT NULL,
  verified   BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sms_phone ON sms_verifications(phone, expires_at);

-- =============================================
-- Row Level Security (기본 설정)
-- =============================================
ALTER TABLE lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE retouch_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_verifications ENABLE ROW LEVEL SECURITY;

-- products: 누구나 serial_token으로 조회 가능 (정품 확인용)
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

-- procedures: 누구나 serial_token으로 조회 가능
CREATE POLICY "procedures_public_read" ON procedures
  FOR SELECT USING (true);

-- registrations: 누구나 serial_token으로 조회 가능, 등록은 미등록 건만
CREATE POLICY "registrations_public_read" ON registrations
  FOR SELECT USING (true);

CREATE POLICY "registrations_insert" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "registrations_update_healing" ON registrations
  FOR UPDATE USING (healing_photo_url IS NULL);

-- practitioners: service_role만 insert/update
CREATE POLICY "practitioners_public_read" ON practitioners
  FOR SELECT USING (true);

-- sms_verifications: service_role 전용 (API route에서 service_role 키 사용)
CREATE POLICY "sms_service_only" ON sms_verifications
  FOR ALL USING (false);
