# Melanoir Verify — 배포 가이드

## 1. Supabase 프로젝트 설정

1. [supabase.com](https://supabase.com) → New Project 생성
2. Project Settings → API에서 복사:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `SUPABASE_SERVICE_ROLE_KEY`
3. SQL Editor에서 마이그레이션 순서대로 실행:
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_data_collection.sql
   supabase/migrations/003_longterm_tracking.sql
   supabase/migrations/004_analytics_views.sql
   supabase/migrations/005_unified_registration.sql
   ```
4. Storage → New Bucket: `mnr-photos` (Private — 공개 접근 비활성)

## 2. 환경 변수 설정

`.env.local.example`을 복사해 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

필수 항목 채우기:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# openssl rand -hex 32 로 생성
HMAC_SECRET=your-secret-key-here

# 관리자 페이지(/admin) 및 Vercel Cron 인증
ADMIN_PASSWORD=your-admin-password
CRON_SECRET=your-cron-secret

NEXT_PUBLIC_BASE_URL=https://verify.melanoir.co.kr
```

> **⚠️ HMAC_SECRET**: 한 번 설정하면 변경 불가. 변경 시 모든 기존 시리얼이 무효화됨.

## 3. 로컬 개발 실행

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 4. 베타 시드 데이터 생성

```bash
npm run seed
```

출력에서 QR URL 확인 후 테스트.

시리얼 전체 목록:
```bash
npx ts-node --project tsconfig.node.json scripts/list-serials.ts
```

## 5. Vercel 배포

```bash
npm i -g vercel
vercel login
vercel --prod
```

Vercel Dashboard → Settings → Environment Variables에 `.env.local` 항목 모두 추가.

### 도메인 연결
Vercel → Domains → `verify.melanoir.co.kr` 추가  
DNS에 CNAME 레코드 추가: `verify` → `cname.vercel-dns.com`

### Cron 작업 (vercel.json)
- `healing-reminder` — 매일 01:00 (D+14/D+28 힐링 리마인드)
- `longterm-reminder` — 매일 01:30 (D+180 6개월 리마인드)
- `tier-update` — 매일 02:00 (시술자 등급 갱신)

## 6. Sweettracker 웹훅 연결

1. [sweettracker.net](https://sweettracker.net) 계정 생성
2. API 키 발급 → `SWEETTRACKER_API_KEY` 설정
3. 웹훅 URL 등록: `https://verify.melanoir.co.kr/api/webhook/delivery`
4. Webhook Secret → `SWEETTRACKER_WEBHOOK_SECRET` 설정

## 7. SMS (배포 전 선택)

Coolsms(솔라피) 연동 시 `SMS_API_KEY`, `SMS_API_SECRET`, `SMS_SENDER_PHONE` 설정.
미설정 시 개발 환경에서는 콘솔에 메시지가 출력됩니다.

## 8. 베타테스터 지원 알림 메일 (Gmail SMTP)

새 베타테스터가 지원하면(`POST /api/waitlist`, `type=beta`) `slee@melanoir.co.kr`로 알림 메일이 한 통 발송됩니다. 중복 신청 시에는 발송되지 않습니다.

### Gmail 앱 비밀번호 발급
1. 발송에 쓸 Google 계정에서 **2단계 인증(2FA)** 을 먼저 켭니다.
2. [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) 접속
3. 앱 이름(예: `melanoir-verify`) 입력 후 생성 → **16자리 비밀번호** 복사 (공백 제거)

### 환경 변수
`.env.local` 및 Vercel → Settings → Environment Variables에 추가:

```env
SMTP_USER=발송계정@gmail.com
SMTP_APP_PASSWORD=발급받은16자리   # 공백 없이
ALERT_EMAIL_TO=slee@melanoir.co.kr  # 수신 주소(여러 명은 콤마로 구분)
# ALERT_EMAIL_FROM=noreply@melanoir.co.kr  # (선택) 표시용 발신 주소
```

> 미설정 시(개발 환경) 실제 발송 없이 콘솔에만 출력됩니다 — SMS와 동일 동작.
