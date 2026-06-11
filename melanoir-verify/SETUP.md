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
