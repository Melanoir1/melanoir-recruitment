-- =============================================
-- Melanoir 정품 추적 시스템
-- 멜라누아 프로(시술자) + 멜라누아 클럽(고객) 분리 운영
-- Phase 0 초기 스키마
-- =============================================

-- 확장 기능
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 제조 배치
-- =============================================
CREATE TABLE mnr_lots (
  lot_id          TEXT PRIMARY KEY,       -- e.g. L-2026-04
  manufactured_at TIMESTAMPTZ NOT NULL,
  quantity        INTEGER NOT NULL,
  qc_result       TEXT NOT NULL CHECK (qc_result IN ('pass', 'fail')),
  qc_document_url TEXT
);

-- =============================================
-- 제품 (시리얼)
-- =============================================
CREATE TABLE mnr_products (
  internal_id   SERIAL PRIMARY KEY,
  serial_token  TEXT UNIQUE NOT NULL,     -- HMAC 토큰 (노출 코드, 형식: XXXX-XXXX-XXXX-XXXX)
  lot_id        TEXT REFERENCES mnr_lots(lot_id),
  product_type  TEXT NOT NULL DEFAULT 'main' CHECK (product_type IN ('main', 'retouch')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mnr_products_serial_token ON mnr_products(serial_token);

-- =============================================
-- 시술자
-- =============================================
CREATE TABLE mnr_practitioners (
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
CREATE TABLE mnr_shipments (
  shipment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_id_from INTEGER,
  internal_id_to   INTEGER,
  waybill_no       TEXT,
  carrier          TEXT,
  shop_name        TEXT,
  shipped_at       TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ            -- Sweettracker 웹훅으로 자동 기록
);

CREATE INDEX idx_mnr_shipments_waybill ON mnr_shipments(waybill_no);

-- =============================================
-- 시술 등록 (시술자 입력)
-- =============================================
CREATE TABLE mnr_procedures (
  procedure_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_token    TEXT UNIQUE REFERENCES mnr_products(serial_token),
  practitioner_id UUID REFERENCES mnr_practitioners(practitioner_id),
  procedure_at    DATE NOT NULL,
  technique       TEXT NOT NULL CHECK (technique IN ('hairstroke', 'combo', 'machine_gradient')),
  customer_phone  TEXT,                   -- 암호화 저장 (pgp_sym_encrypt 사용)
  registered_at   TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 고객 정품 등록
-- =============================================
CREATE TABLE mnr_registrations (
  reg_id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_token            TEXT UNIQUE REFERENCES mnr_products(serial_token),
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
-- 통합 원장 (ledger 방식)
-- owner_type='customer'      → 멜라누아 클럽 크레딧 (고객, 유효 24개월)
-- owner_type='practitioner'  → 멜라누아 프로 포인트 (시술자, 유효 12개월)
-- =============================================
CREATE TABLE mnr_credits (
  credit_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('customer', 'practitioner')),
  owner_id   TEXT NOT NULL,              -- customer: phone / practitioner: practitioner_id
  amount     INTEGER NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('earn', 'spend')),
  reason     TEXT,
  expires_at TIMESTAMPTZ,               -- customer: 24개월 / practitioner: 12개월
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mnr_credits_owner ON mnr_credits(owner_type, owner_id);

-- =============================================
-- 리터칭 잉크 발송
-- =============================================
CREATE TABLE mnr_retouch_dispatches (
  dispatch_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_serial  TEXT REFERENCES mnr_products(serial_token),
  r_serial       TEXT,                  -- MNR-R-XXXX 형식 내부 추적용
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dispatched')),
  approved_at    TIMESTAMPTZ,
  dispatched_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SMS 인증 (임시 OTP 보관)
-- =============================================
CREATE TABLE mnr_sms_verifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      TEXT NOT NULL,
  code       TEXT NOT NULL,
  verified   BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mnr_sms_phone ON mnr_sms_verifications(phone, expires_at);

-- =============================================
-- Row Level Security (기본 설정)
-- =============================================
ALTER TABLE mnr_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_retouch_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mnr_sms_verifications ENABLE ROW LEVEL SECURITY;

-- products: 누구나 serial_token으로 조회 가능 (정품 확인용)
CREATE POLICY "mnr_products_public_read" ON mnr_products
  FOR SELECT USING (true);

-- procedures: 누구나 serial_token으로 조회 가능
CREATE POLICY "mnr_procedures_public_read" ON mnr_procedures
  FOR SELECT USING (true);

-- registrations: 누구나 serial_token으로 조회 가능, 등록은 미등록 건만
CREATE POLICY "mnr_registrations_public_read" ON mnr_registrations
  FOR SELECT USING (true);

CREATE POLICY "mnr_registrations_insert" ON mnr_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "mnr_registrations_update_healing" ON mnr_registrations
  FOR UPDATE USING (healing_photo_url IS NULL);

-- practitioners: service_role만 insert/update
CREATE POLICY "mnr_practitioners_public_read" ON mnr_practitioners
  FOR SELECT USING (true);

-- sms_verifications: service_role 전용 (API route에서 service_role 키 사용)
CREATE POLICY "mnr_sms_service_only" ON mnr_sms_verifications
  FOR ALL USING (false);
