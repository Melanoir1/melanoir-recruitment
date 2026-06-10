# Melanoir 정품 추적 & 멤버십 시스템 — 구현 인계 문서

> 작성일: 2026-06-02 / 최종 수정: 2026-06-10  
> 브랜드: Melanoir (멜라누아)  
> 제품: 멜라누아 엠보 (반영구 눈썹 시술용 잉크)  
> 목적: 정품 이력 추적 + 시술자/고객 멤버십 시스템 구축

---

## 멤버십 프로그램 구조 (개요)

멜라누아의 멤버십은 대상에 따라 **완전히 분리된 두 개의 프로그램**으로 운영된다.

| 구분 | 프로그램명 | 대상 | 화폐 단위 | 가입 방법 |
|---|---|---|---|---|
| 시술자 | **멜라누아 프로** | 반영구 시술 전문가 | **포인트** | QR 스캔 시 자동 계정 생성 |
| 고객 | **멜라누아 멤버십** | 엠보 시술을 받은 피시술자 | **크레딧** | 정품 등록 완료 시 자동 가입 |

> ⚠️ "프로 멤버십" 등 두 프로그램을 혼용하는 표현은 사용하지 않는다.

---

## 1. 비즈니스 컨텍스트

### 유통 구조

- **판매 채널:** 네이버 스마트스토어 (누구나 구매 가능하나, 전문 시술자 대상 B2B2C 구조)
- **물류:** 3PL 자동배송 (자체 배송 없음)
- **시술 모델:** 치과 임플란트형 — 고객 상담 → 잉크 선택 → 시술자 주문 또는 재고 사용 → 시술

### 제품 구조

- 본품: 멜라누아 엠보 앰플 0.5g (의료용 멸균 파우치 포장) + 보증서 동봉
- 리터칭 잉크: 힐링 등록 완료 시 무상 지급. 보증서 없음. 내부 R-시리얼로만 추적.

---

## 2. 확정된 설계 결정사항

### 시리얼 번호 보안 설계

- **내부 ID와 노출 코드를 분리한다.**
  - 내부: 순번 정수 ID (1, 2, 3…)
  - 외부(보증서 인쇄): HMAC-SHA256(secret_key, internal_id) 기반 불규칙 토큰
  - 예시 노출 코드: `A7K2-9X4M-3P8Q` (16자 영숫자, 4자씩 구분)
  - 검증 시 토큰을 재연산하여 DB 값과 비교

- **입력 방식 3가지 (모두 동일 토큰):**
  1. QR 코드 (1순위) — URL 포함: `verify.melanoir.co.kr/v/A7K29X4M3P8Q`
  2. Code 128 바코드 (QR 아래 병행 인쇄)
  3. 16자 영숫자 수동 입력 (QR 손상 대비)

### 핵심 플로우 (Method B — 확정)

재고 등록 단계 없음. 시술 당일 박스 개봉 시 QR 스캔 + 시술 등록을 한 번에 처리.

```
네이버 주문
  → 3PL 출고 → 운송장 생성
  → Sweettracker 웹훅 → delivered_at 자동 기록

시술 당일 (고객 앞에서 봉인 박스 개봉)
  → 시술자: 보증서 QR 스캔 (스마트폰 카메라)
  → 시술자 포털: 시술일 · 기법 입력 (30초)
  → 고객에게 보증서 전달

고객: QR 스캔
  → 제조일 / 배송완료일 / 시술일 / 시술자 정보 조회
  → 정품 등록 (이름 · 후기 · 시술 직후 사진) → 멜라누아 멤버십 자동 가입
  → 크레딧 즉시 지급

7~30일 후
  → 고객: 힐링 완료 사진 추가 업로드
  → 추가 크레딧(멜라누아 멤버십) + 리터칭 잉크 발송 요청 자동 생성
  → 관리자 승인 → 3PL 리터칭 출고
```

- QR 스캔은 항상 1건씩 (시술이 1건씩 이루어지므로 배치 스캔 불필요)
- 별도 바코드 스캐너 장비 불필요, 시술자 스마트폰으로 충분

### 멜라누아 프로 등록 (시술자)

- 최초 QR 스캔 시 "이름 / 샵 이름 / 휴대폰 번호" 입력 + SMS 인증 → 계정 생성
- 이후 재방문: 휴대폰 번호 입력 → SMS 인증 → 자동 로그인
- 이메일·비밀번호 불필요 (Phase 1에서 선택적으로 추가)

---

## 3. DB 스키마

```sql
-- 제조 배치
CREATE TABLE lots (
  lot_id          TEXT PRIMARY KEY,       -- e.g. L-2026-04
  manufactured_at TIMESTAMPTZ NOT NULL,
  quantity        INTEGER NOT NULL,
  qc_result       TEXT NOT NULL,          -- 'pass' | 'fail'
  qc_document_url TEXT
);

-- 제품 (시리얼)
CREATE TABLE products (
  internal_id   SERIAL PRIMARY KEY,
  serial_token  TEXT UNIQUE NOT NULL,     -- HMAC 토큰 (노출 코드)
  lot_id        TEXT REFERENCES lots(lot_id),
  product_type  TEXT NOT NULL DEFAULT 'main', -- 'main' | 'retouch'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 시술자
CREATE TABLE practitioners (
  practitioner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  shop_name       TEXT NOT NULL,
  phone           TEXT UNIQUE NOT NULL,
  region          TEXT,
  tier            TEXT DEFAULT 'basic',   -- 'basic' | 'silver' | 'gold' | 'partner'
  tier_updated_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 출고·배송
CREATE TABLE shipments (
  shipment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_id_from INTEGER,               -- 시리얼 범위 시작
  internal_id_to   INTEGER,               -- 시리얼 범위 끝
  waybill_no       TEXT,
  carrier          TEXT,
  shop_name        TEXT,
  shipped_at       TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ            -- Sweettracker 웹훅으로 자동 기록
);

-- 시술 등록 (시술자가 입력)
CREATE TABLE procedures (
  procedure_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_token    TEXT UNIQUE REFERENCES products(serial_token),
  practitioner_id UUID REFERENCES practitioners(practitioner_id),
  procedure_at    DATE NOT NULL,
  technique       TEXT NOT NULL,  -- 'hairstroke' | 'combo' | 'machine_gradient'
  customer_phone  TEXT,           -- 암호화 저장
  registered_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 고객 정품 등록
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

-- 통합 원장 (ledger 방식)
-- owner_type='customer'  → 멜라누아 멤버십 크레딧 (고객)
-- owner_type='practitioner' → 멜라누아 프로 포인트 (시술자)
CREATE TABLE credits (
  credit_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL,   -- 'customer'(멤버십 크레딧) | 'practitioner'(프로 포인트)
  owner_id   TEXT NOT NULL,   -- customer: phone / practitioner: practitioner_id
  amount     INTEGER NOT NULL,
  type       TEXT NOT NULL,   -- 'earn' | 'spend'
  reason     TEXT,
  expires_at TIMESTAMPTZ,     -- customer: 24개월 / practitioner: 12개월
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 리터칭 잉크 발송
CREATE TABLE retouch_dispatches (
  dispatch_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_serial  TEXT REFERENCES products(serial_token),
  r_serial       TEXT,        -- MNR-R-XXXX 형식 내부 추적용
  status         TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'dispatched'
  approved_at    TIMESTAMPTZ,
  dispatched_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. 고객 크레딧 지급 기준 (멜라누아 멤버십)

| 행동 | 지급량 |
|---|---|
| 정품 등록 완료 | 10000 크레딧 |
| 후기 텍스트 작성 | 5000 크레딧 |
| 시술 직후 사진 업로드 | 10000 크레딧 |
| 힐링 완료 사진 업로드 | 15000 크레딧 |

- 유효기간: 발급일로부터 24개월
- 크레딧 잔액 = credits 테이블 owner_type='customer' 기준 SUM(amount) (earn +, spend -)
- 사용처: 현재 미정. 추후 제휴 서비스·이벤트·프로모션 연계 예정.

---

## 5. 멜라누아 프로 — 등급 및 포인트

| 등급 | 조건 (최근 6개월 시술 등록 횟수) | 포인트 적립 | 추가 혜택 |
|---|---|---|---|
| 기본 | 제한 없음 (등록 계정) | 3% | 교육 콘텐츠 접근권 |
| 실버 | 6~11회 | 10% | 신제품 출시 사전 알림 + 우선 구매권 |
| 골드 | 12~23회 | 15% | 신제품 체험권 |
| 파트너 | 24회 이상 | 20% | 비공개 (파트너 선정 후 개별 안내) |

- 포인트 유효기간: 적립일로부터 1년
- 베타테스터 특전: 테스트 완료(폼 C 제출) 후 3개월간 골드 등급 포인트(15%) 자동 적용
- 등급 갱신: 실시간 재산정 — 조건 충족 즉시 전환 (Supabase Edge Function 또는 DB trigger)
- 집계 쿼리: `SELECT practitioner_id, COUNT(*) FROM procedures WHERE procedure_at >= NOW() - INTERVAL '6 months' GROUP BY practitioner_id`

---

## 6. 어뷰징 방지

- 동일 serial_token 중복 등록: DB UNIQUE 제약으로 차단
- 사진 중복 제출: pHash 비교로 감지
- 잘못된 토큰 입력: HMAC 검증 실패 시 "존재하지 않는 제품" 반환
- 비정상 등록 패턴: 단일 phone으로 단시간 (5초) 다수 등록 시 플래그

---

## 7. 외부 API 연동

### Sweettracker (배송 추적)
- 웹훅 수신 endpoint: `POST /api/webhook/delivery`
- 배송 완료 이벤트 수신 시 waybill_no로 shipments 조회 → `delivered_at` 업데이트
- 무료 티어: 월 300건. 초과 시 ₩33,000/월.
- 문서: https://sweettracker.net

### 네이버 스마트스토어
- 별도 자동 연동 없음.
- 시술자가 시술 시 QR 스캔으로 자연스럽게 연결됨.
- 필요 시 네이버 커머스 API로 주문 정보 조회 가능 (Phase 2 선택사항)

### 3PL
- 3PL사 확정 후 해당 출고 지시 API 연동
- Phase 0~1에서는 관리자 수동 출고 지시로 임시 운영

---

## 8. 화면 구성

### 공개 (로그인 불필요)
- `/v/[token]` — 정품 조회 + 고객 등록 페이지
  - 표시: 제조일 / 배송완료일 / 시술일 / 시술자 샵명 / 기법
  - 시술자 미등록 시: "시술자 등록 대기 중" 표시, 크레딧 지급 보류
  - 등록 폼: 이름 · 후기 텍스트 · 시술 직후 사진 업로드
  - 힐링 사진 추가: 동일 URL 재접속 → 힐링 사진 업로드

### 멜라누아 프로 포털 `/pro`
- SMS 인증 로그인 (최초 방문 시 계정 생성 포함)
- QR 스캔 → 시술 등록 폼 (시술일 · 기법)
- 내 시술 이력 목록
- 내 등급(기본/실버/골드/파트너) 및 포인트 잔액

### 관리자 `/admin`
- Lot 생성 및 시리얼 발급
- 배송 현황 조회
- 시술자 목록 및 등급 관리
- 리터칭 잉크 발송 승인 큐
- 크레딧·포인트 발급 내역 (고객/시술자 구분)

---

## 9. 구현 단계

### Phase 0 — 베타테스트용 (목표: 1주)

- [ ] Supabase 프로젝트 생성
- [ ] 위 스키마 전체 테이블 생성
- [ ] HMAC 토큰 생성/검증 유틸 함수 작성
  ```ts
  import { createHmac } from 'crypto'
  const HMAC_SECRET = process.env.HMAC_SECRET!
  
  export function generateToken(internalId: number): string {
    const raw = createHmac('sha256', HMAC_SECRET)
      .update(internalId.toString())
      .digest('hex')
      .slice(0, 16)
      .toUpperCase()
    return `${raw.slice(0,4)}-${raw.slice(4,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}`
  }
  
  export function verifyToken(token: string, internalId: number): boolean {
    return generateToken(internalId) === token
  }
  ```
- [ ] 베타용 시드 데이터 입력 (Lot 1개, 시리얼 수십 개)
- [ ] Next.js 앱 생성, Vercel 배포
- [ ] `/v/[token]` 조회 페이지 구현
- [ ] `/pro` 시술자 SMS 로그인 + QR 스캔 + 시술 등록 폼
- [ ] `POST /api/webhook/delivery` Sweettracker 웹훅 수신

### Phase 1 — 본출시용 (목표: 2~3주)

- [ ] 고객 정품 등록 폼 (이름 · 후기 · 사진)
- [ ] Supabase Storage 이미지 업로드
- [ ] 크레딧 자동 지급 로직
- [ ] 힐링 사진 업로드 + retouch_dispatches 자동 생성
- [ ] 관리자 리터칭 승인 큐
- [ ] 등록 완료 SMS 발송 (Coolsms 또는 알리고)
- [ ] 어뷰징 방지 (중복 체크 · pHash)

### Phase 2 — 멜라누아 프로 & 멤버십 완성 (운영 안정화 후)

- [ ] 시술자 등급 월 1회 자동 산정 Edge Function
- [ ] 등급별 혜택 자동 처리
- [ ] 관리자 대시보드 (차트 · 통계)
- [ ] 3PL API 연동 자동 출고
- [ ] 네이버 커머스 API 연동 (선택)

---

## 10. 기술 스택

| 항목 | 선택 | 비고 |
|---|---|---|
| DB + Auth | Supabase | 무료 티어로 시작 |
| 프레임워크 | Next.js 14 (App Router) | TypeScript |
| 호스팅 | Vercel | 무료 |
| 배송 추적 | Sweettracker API | 월 300건 무료 |
| 이메일 | Resend | 월 3,000건 무료 |
| SMS | Coolsms 또는 알리고 | 건당 과금 |
| 이미지 저장 | Supabase Storage | 무료 1GB |
| 스타일 | Tailwind CSS | |

---

## 11. 환경 변수 목록

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

HMAC_SECRET=                  # 시리얼 토큰 생성용 비밀 키 (절대 노출 금지)

SWEETTRACKER_API_KEY=
SWEETTRACKER_WEBHOOK_SECRET=

RESEND_API_KEY=
SMS_API_KEY=
SMS_SENDER_PHONE=

NEXT_PUBLIC_BASE_URL=https://verify.melanoir.co.kr
```

---

## 12. 브랜드 정보

- 브랜드명: Melanoir (멜라누아)
- 주소: 인천광역시 서구 정서진로 410, A312
- 공개 도메인 (예정): melanoir.co.kr
- 언어: 한국어 (UI 전체)
- 톤앤매너: 애플 스타일 — 미니멀, 데이터 중심, 고급스러움
- 상세페이지 파일: `embo_enhanced.html` (동일 폴더)

---

## 13. 미결 사항 (구현 전 확정 필요)

| 항목 | 내용 |
|---|---|
| 3PL사 확정 | 물류센터 선정 및 API 연동 방식 |
| 크레딧 사용처 | 현재 미정. 추후 서비스 연계 예정 |
| 시술자 등급 혜택 상세 | 골드/파트너 혜택 구체화 필요 |
| 리터칭 발송 조건 | 힐링 사진 제출 후 며칠 이내 발송할지 |
| 고객 등록 조건 | 시술자 미등록 상태에서도 허용할지 여부 |
| 일반인 구매 정책 | 비전문가 구매 시 등록 허용 범위 |
| 시술자 등록 정책 | 사업자 확인할지 여부 -> 일반인 구매 정책과 상호 고려 필요 |