# Melanoir — Session Handoff v3.0

**작성일**: 2026-05-29
**작성자**: Chief Architect (official@melanoir.co.kr)
**이전 인계**: _session/melanoir_session_handoff_v2.0.md

---

## 현재 워크스페이스 상태 (완료 기준)

### 파일 구조 (루트 기준)
```
_session/           세션 인계 문서
brand/
  system/           01~06 브랜드 시스템 문서 + README
  branding/         melanoir_branding_sheet_v4.0.md (v4.0만 SSOT)
  content/          콘텐츠 소스 A~E + 운영 가이드 + ref/
  design-refs/      apple / spacex / tesla
  logo/             로고 파일 전체
  vendor/           melanoir_vendor_guide_v1.0.docx
projects/
  embo-beta-test/   베타테스트 프로젝트
web/
  site/             현행 배포 소스 (melanoir.co.kr)
  site-offline/     점검 배포용 (index.html만)
  site-partial/     로컬 빌드 산출물 (.gitignore 유지)
  scripts/          배포 스크립트
vercel.json         배포 설정 (outputDirectory: web/site)
vercel.partial.json 점검 모드 배포 설정 (outputDirectory: web/site-partial)
```

---

## 완료된 작업 목록

### ✅ 콘텐츠 소스 시스템 (37토픽 전체 완성)

| 파일 | 토픽 수 | 채널 | 상태 |
|---|---|---|---|
| `docs/content/melanoir_content_source_A.md` | 11개 (A-01~A-11) | 교육 (A/C 채널) | ✅ 완료 |
| `docs/content/melanoir_content_source_B.md` | 8개 (B-01~B-08) | 브랜드/제품 채널 | ✅ 완료 |
| `docs/content/melanoir_content_source_C.md` | 8개 (C-01~C-08) | 교육 (A/C 채널) | ✅ 완료 |
| `docs/content/melanoir_content_source_D.md` | 5개 (D-01~D-05) | 브랜드/제품 채널 (B2B) | ✅ 완료 |
| `docs/content/melanoir_content_source_E.md` | 5개 (E-01~E-05) | 브랜드/스토리 채널 | ✅ 완료 |

각 파일은 5-레이어 스캐폴드 구조: [META] / [핵심 주장] / [본문 서술] / [검증 데이터] / [표현 주의사항]

### ✅ 브랜드 시스템 일관성 수정

**A-04 본문 수정** (`melanoir_content_source_A.md`)
- 문제: PMU 시술 맥락 직접 연결 ("반영구화장 시술 후 케어 콘텐츠로 연결")
- 수정: 피부 항상성/일상 스트레스 맥락으로 교체 (A-섹션 중립 원칙 준수)

**melanoir_vendor_guide_v1.0.docx** (`docs/vendor/`) — 3건 수정
- C-07 제목: `화학적 부채(Chemical Debt)란 무엇인가` → `인체와 환경에 쌓이는 화학 성분 — Body Burden의 과학`
- C-07 설명: 헤드라인 사용 금지 명시 추가
- E-05 제목: `화학적 부채를 줄이는 회사` → `세상의 유해 성분을 줄이는 회사 — 멜라누아의 미션`

### ✅ 워크스페이스 정리

- 구버전 파일 6개 삭제 (v3.2, v1.0 시리즈)
- 루트 md/docx/프로토타입 HTML 이동·제거
- docs/ 하위 폴더 구조 정비 (vendor/, _session/ 신설)
- git gc 실행 완료

---

## 다음 작업 플랜 (우선순위 순)

### Priority 1 — site/ 콘텐츠 일관성 검토 ⬅ 다음 세션 즉시 착수

**검토 대상 파일:**
```
site/products/embo.html          ← 제품 소개 핵심 페이지
site/products/photoshieldcore.html
site/products/index.html
site/melanin/index.html          ← 멜라닌 교육 페이지
site/technology/cosmetics/index.html
site/technology/tattoo/index.html
site/technology/radiation/index.html
```

**검토 기준 (브랜드 시스템 위반 여부):**
1. 수치 정확성: `0.00` / `97%` / `EWG 1등급` 표기 형식
2. 금지 표현: "최고의", "혁신적인", "안전하다(단독)", "친환경이다", "무독성"
3. "피부에 주입" 프레이밍 — A-섹션 교육 맥락에서 시술 연결 금지
4. "화학적 부채(Chemical Debt)" 헤드라인 사용 여부
5. 검증되지 않은 수치 (예: 과거 문서에 있던 "1,500개/mm²" 등)
6. 한국 광고법 준수: "효과적이다" → 메커니즘 서술로 대체
7. 브랜드 명칭 표기: 멜라누아 / Melanoir (변형 금지)

**검토 방법**: 각 HTML 파일을 텍스트로 추출 → 위반 항목 목록화 → 수정 또는 메모

### Priority 2 — 콘텐츠 소스 → 실제 콘텐츠 제작 프로세스 정의

37개 토픽 소스가 완성되었으나, 실제 블로그/카드뉴스/쇼츠용 콘텐츠로 변환하는 워크플로가 미정.
- 외주 파트너 프롬프트 템플릿 설계
- 검수 체크리스트 운영 방식 확정 (vendor guide 2.6 기준)

### Priority 3 — docs/content/ 운영 가이드 문서 정합성 확인

`melanoir_content_plans_5_v1.1.md`, `melanoir_marketing_content_guidelines_v1.1.md` 내용이
완성된 A~E 콘텐츠 소스와 충돌하지 않는지 확인. 특히 채널 전략, 금지 표현 기준.

---

## 핵심 브랜드 데이터 (검토 기준)

| 항목 | 공식 수치 | 출처 |
|---|---|---|
| 피부 자극 지수 | **0.00** (정확히 이 표기) | ISO 인증 시험 기관 성적서 |
| 세포 생존률 | **97%** | ISO 10993-5 (비독성 기준 70%) |
| EWG 등급 | **EWG 1등급** | — |
| 멜라노사이트 밀도 | **약 955개/mm²** | Halpern et al. 2017 |
| 자연 SPF (I~III형) | **≈ 3.3** | Dhaliwal et al. 2025 |
| 자연 SPF (IV~VI형) | **≈ 13.4** | Dhaliwal et al. 2025 |
| UV 내부 전환 | **100 fs excitonic → ~4 ps ESPT** | Ilina et al., PNAS 2022 |

**절대 사용 금지 수치**: "1,500개/mm²" (검증 불가, 기존 문서에서 제거 완료)

---

## 표현 원칙 요약 (새 에이전트용)

- **"화학적 부채(Chemical Debt)"**: 헤드라인·핵심 주장 전면 금지. 본문 단일 언급은 허용
- **A/C 섹션**: 멜라닌 내인성 특성만 서술. 시술 맥락(PMU, 반영구화장) 직접 연결 금지
- **B/D/E 섹션**: 제품명·데이터·시술 맥락 허용. ISO 수치 인용 시 "ISO 인증 시험 기관 성적서 기준" 맥락 명시
- **수치 앞에 서술**: Data-First 원칙 — "97%다. 이것은 세포가 살아남은 비율이다." 순서
- **선언형 종결**: 모든 문장은 "~다."로 끝남. 의문형·청유형 금지
- **경쟁사 비교 금지**: 사실 나열 후 판단은 독자에게

---

*Melanoir · Session Handoff v3.0 · 2026-05-29*
