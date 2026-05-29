# Melanoir — 세션 인계 문서
**Session Handoff v2.0 · 2026-05-28**

> 이 문서는 새 에이전트 세션에서 작업을 이어받기 위한 전체 컨텍스트다.
> v1.0을 대체한다. Brand System 6문서 완성 이후 기준.
>
> **위치**: `docs/_session/` (2026-05-29 정리). v1.0·루트 `content_source_v1.0`은 삭제됨.

---

## 1. 프로젝트 개요

**브랜드**: Melanoir (멜라누아)  
**카테고리**: Science-Proven Luxury Clean Bio-Material  
**핵심 소재**: 유멜라닌 (Eumelanin)  
**담당자**: Chief Architect / official@melanoir.co.kr  
**워크스페이스**: `/Users/kooburi/[Build] Brand Identity/`

---

## 2. Brand System 현황 — 6문서 완성

이번 세션에서 단일 브랜딩 시트를 Wolff Olins/Landor/Collins 방식의 계층형 6문서 구조로 전환 완료.

### 문서 구조

```
01_brand_platform.md         ← Brand Constitution (최상위)
    ├── 02_brand_identity.md     ← How we look & sound
    ├── 03_content_ops_manual.md ← How we operate content
    ├── 04_embo_product_brief.md ← Embo 제품 기준
    ├── 05_employer_brand.md     ← 채용 브랜드
    └── 06_photoshield_brief.md  ← Photoshield Core 제품 기준
```

**파일 위치**: `docs/brand-system/`  
**README**: `docs/brand-system/README.md` — 전체 구조 개요 (v1.1)

### 각 문서 완성 상태

| 파일 | 상태 | 주요 내용 |
|---|---|---|
| `01_brand_platform.md` | ✅ 완성 | Mission/Vision, Brand Pillars (Unrivaled Tech / Measured Purity / Ultimate Safety), Positioning Statement, Target (B2B PMU 아티스트 primary + B2C 소비자 secondary) |
| `02_brand_identity.md` | ✅ 완성 | Verbal Identity (ToV 4원칙, 서술 7원칙, 금지/권장어), Visual Identity (Color, Photography, Typography, Logo) |
| `03_content_ops_manual.md` | ✅ 완성 | 콘텐츠 레이어 구분, Luxury 언어화, 광고법 준수, 채널 변환 가이드, 외주 프롬프트 골격, 팩트체크 레퍼런스 |
| `04_embo_product_brief.md` | ✅ 완성 | 단일 색소(멜라닌) 원칙, 가격 포지셔닝(279,000원/0.5g), ISO 시험 데이터, B-시리즈 클레임 구조, 타겟 프로파일 |
| `05_employer_brand.md` | ✅ 완성 | Why Join (3가지), 팀 문화, 5대 인재 가치, 복지, R&D 3개 트랙 (양산기술/성능엔지니어링/나노바이오계측) |
| `06_photoshield_brief.md` | ✅ 완성 | B2B 화장품 원료 브리프, 조성(Glycerin 70%/Aqua 27%/Melanin 3%), 성능 데이터, 규제, 표준 용량, 다국어 시장 |

### 이번 세션에서 새로 정의된 핵심 내용

**Typography System**
- Primary: Pretendard — CDN `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css`
- Supplementary: Inter (Latin 전용)
- Limited creative use: 페이퍼로지 (Paperlogy) — 지원 플랫폼 한정
- 타입 스케일 (Display 7.2rem/900 → Caption 1.1rem/400 전 9단계 확정)

**Logo 파일 현황** (`logo/` 폴더 내)
- sg1 / sg1_white / sg2 / sg2_white / word / word_white / symbol / symbol_white (PNG)
- MELANOIR_logo.ai (소스 파일)
- 기본 사용: sg1 (세로형) 또는 sg2 (가로형). 블랙 또는 화이트만 허용. 회색 변형 금지.

**Photoshield Core 성능 데이터** (06_photoshield_brief.md에 포함)
- 조성: Glycerin 70% / Aqua 27% / Melanin 3%
- 블루라이트 차단: ZnO 대비 4.5배
- UVA 차단: ZnO 대비 2.7배
- 항산화: Vitamin C 7일 후 대비 3.8배

---

## 3. AI 마케팅 챌린저 제거 완료

이 프로그램은 AI 기반 마케팅 시스템 도입으로 완전 철회됨.

**제거 완료**
- `docs/brand-system/05_employer_brand.md` — 챌린저 섹션 전체 삭제
- `docs/brand-system/03_content_ops_manual.md` — "AI 마케팅 챌린저" 문구 삭제

**수동 삭제 필요 (Claude 권한 부족)**
- `melanoir_ai_marketing_strategy_v1.0.docx` — 워크스페이스 루트에 존재
- → Finder에서 직접 삭제 필요

**확인 완료** — 전체 프로젝트 grep 스캔 결과 나머지 `.md`, `.html`, `.js`, `.css` 파일에 잔여 참조 없음.

---

## 4. 콘텐츠 소스 파일 현황

**파일**: `docs/content/melanoir_content_source_A.md` ~ `E.md` (섹션별 분리)

완성된 7개 토픽 (A섹션 3개 + B섹션 4개):

| 코드 | 제목 | 섹션 |
|---|---|---|
| A-01 | 멜라닌이란 무엇인가 | A (교육) |
| A-05 | 피부가 원래 가진 색소를 잉크로 — 생체적합성의 의미 | A (교육) |
| A-06 | 멜라닌은 왜 안전한가 — EWG 1등급의 의미 | A (교육) |
| B-01 | 반영구화장 잉크, 무엇으로 만들어지는가 — 성분 완전 해부 | B (제품) |
| B-02 | 피부 자극 지수 0.00이 실제로 의미하는 것 | B (제품) |
| B-03 | 세포 생존률 97% — 이 숫자가 중요한 이유 | B (제품) |
| B-07 | 좋은 반영구화장 잉크를 고르는 기준 — 소비자 가이드 | B (제품) |

**보류 중**: 25개 토픽 — 이전 세션에서 Perplexity 크레딧 소진으로 중단. **다음 세션부터 Claude 웹 검색으로 전환하여 재개.**

---

## 5. 다음 세션 작업 계획

### 🔴 Priority 1 — 콘텐츠 소스 파일 확장 (25개 토픽)

`melanoir_edu_content_core_v2.0.md`에 정의된 32개 토픽 중 25개 미완성.  
Claude 웹 검색 기반으로 데이터 수집 후 5-레이어 스캐폴드로 작성.

**착수 순서 (우선순위 기준)**

| 순서 | 코드 | 제목 | 이유 |
|---|---|---|---|
| 1 | A-02 | 유멜라닌 vs. 페오멜라닌 — 기능의 분기점 | A-01 후속, 핵심 교육 |
| 2 | A-03 | 멜라닌의 광보호 메커니즘 — Internal Conversion | Photoshield Core 콘텐츠 기반 |
| 3 | A-04 | 항산화 메커니즘 — ROS 소거 구조 | Unrivaled Tech 필러 연결 |
| 4 | A-07 | 멜라닌의 생분해 — 순환의 소재 | 환경 축 완성 필수 |
| 5 | C-01 | PMU 시장 현황 및 규제 흐름 | B2B 세일즈 컨텍스트 |

나머지 20개는 `melanoir_edu_content_core_v2.0.md` 전체 토픽 목록 참조.

**작성 원칙** — 각 토픽의 5-레이어 구조:
```
[META]          코드 / 섹션 성격 / 타겟 독자 / 채널 / 우선순위 / 광고법
[핵심 주장]     단 하나의 명제. 선언문 3줄 이내. 수치 포함 권장.
[본문 서술]     400–600자. 오해 소환 → 교정 → 메커니즘 → 재정의
[검증 데이터]   DOI 단위 출처 + 수치. 본문과 독립적으로 검증 가능.
[표현 주의사항] ✅ 권장 / ❌ 금지. 브랜드 보이스 + 광고법 기준.
```

### 🟡 Priority 2 — 벤더 가이드 업데이트

`docs/vendor/melanoir_vendor_guide_v1.0.docx`  
Brand System 6문서 완성에 따라 내용 업데이트 검토 필요.  
→ 읽어보고 현행 Brand System과 불일치 여부 확인 후 결정.

### 🟢 Priority 3 — 웹사이트 콘텐츠 정합성 검토

`site/` 폴더 내 HTML 페이지들이 Brand System 6문서 기준과 일치하는지 확인.  
특히 `site/products/photoshieldcore.html` — Photoshield 브리프와 데이터 정합성 검토.

---

## 6. 논의가 필요한 사항 (착수 전 확인)

### ① ~~melanoir_session_handoff_v1.0.md 처리~~ ✅ 완료

v1.0 삭제. v2.0은 `docs/_session/`에 보관.

### ② ~~콘텐츠 소스 파일 버전 관리~~ ✅ 완료

Option B 채택: `docs/content/melanoir_content_source_A.md` ~ `E.md`.

### ③ Photoshield Core 콘텐츠 체계

`06_photoshield_brief.md`는 B2B 제품 브리프로 완성됨.  
그러나 Photoshield Core용 콘텐츠 소스 파일(C섹션 / D섹션)은 미착수.  
A-03(광보호 메커니즘) 완성 후 C섹션으로 연결되는 구조.  
→ Embo 콘텐츠 소스 완성 후 별도 착수할지, 병행할지 결정 필요.

---

## 7. 핵심 기술 레퍼런스 (오류 방지)

새 에이전트가 동일한 오류를 반복하지 않도록. **이 수치들은 검증 완료된 값이다.**

| 항목 | 올바른 정보 |
|---|---|
| 멜라노사이트 밀도 | **955 cells/mm²** (전 연령 가중 평균) — "1,500"은 오류 |
| 피부 자극 시험 표준 | **ISO 10993-23:2021** (Irritation 자극) |
| 피부 감작 시험 표준 | **ISO 10993-10:2021** (Sensitization 감작) — 별개 표준 |
| 세포독성 시험 표준 | **ISO 10993-5** / 비독성 기준: 세포 생존률 70% 이상 |
| IARC Group 2B 정의 | 인간 근거 제한적 **OR** 동물 충분한 근거 (OR 조건) |
| EWG 성격 | 비정부 비영리 NGO 자체 평가 — 법적 인증 아님. "인증"이라는 단어 사용 금지 |
| EWG 멜라닌 등급 | **1등급** |
| EU REACH 규제 | Commission Regulation (EU) 2020/2081 / 발효 2022-01-04 |
| Embo 피부 자극 지수 | **0.00** (ISO 10993-23 기준) |
| Embo 세포 생존률 | **97%** (ISO 10993-5 기준) |
| Embo 가격 | **279,000원 / 0.5g / 단회 사용** |
| Internal Conversion | 흡수 UV → 열에너지 전환. 초기 ~100 펨토초, 이완 ~4 피코초 |
| Photoshield 조성 | Glycerin 70% / Aqua 27% / Melanin 3% |
| Photoshield 블루라이트 | ZnO 대비 **4.5배** |
| Photoshield UVA | ZnO 대비 **2.7배** |
| Photoshield 항산화 | Vitamin C 7일 후 대비 **3.8배** |

---

## 8. 광고법 핵심 원칙 요약 (새 에이전트 필독)

### 레이어별 언어 원칙

| 레이어 | 코드 | 원칙 |
|---|---|---|
| **교육 레이어** | A/C | 멜라닌 성분 사실만. 제품명·수치 없음. Mission 언어 부재. |
| **제품 레이어** | B/D | 제품 시험 수치 허용. ISO 성적서 근거 필수. Luxury 포지셔닝 적용. |
| **브랜드 선언** | — | Mission/Vision + Unrivaled Tech 전면 적용. 창업 철학 허용. |

### 금지 표현과 대체어

| 금지 | 대체 |
|---|---|
| 안전하다 | "면역 반응 없음" / "비자극 범주의 최솟값" / "ISO 10993 기준 통과" |
| 무독성이다 | "세포 생존률 97% — ISO 10993-5 비독성 기준(70%) 상회" |
| 효과적이다 | "피코초 단위로 작동하는 Internal Conversion 반응이 확인된다" |
| 친환경이다 | "효소에 의한 생물학적 분해 경로가 알려져 있다" |
| 검증되었다 (단독) | "ISO 10993-5 시험에서 [수치]가 측정되었다" |
| EWG 인증 | "EWG 1등급으로 평가됨" |

---

## 9. 기존 v1.0 인계 문서 vs. 현재 차이

v1.0에 기재된 항목 중 완료/변경된 것:

| v1.0 항목 | 현재 상태 |
|---|---|
| 브랜딩 시트 v5.0 개정 (3개 영역) | ✅ 완료 — 6문서 Brand System으로 전환하며 모두 반영 |
| Typography TBD | ✅ 완료 — Pretendard/Inter 시스템 확정 |
| Logo TBD | ✅ 완료 — 로고 파일 목록 및 사용 규정 문서화 |
| Photoshield Core 브리프 | ✅ 완료 — `06_photoshield_brief.md` 작성 완료 |
| AI 마케팅 챌린저 제거 | ✅ 완료 (docx 파일 1개 수동 삭제 잔여) |
| 데이터 수집 도구 | Perplexity → **Claude 웹 검색으로 전환** |
| 25개 토픽 데이터 수집 | 🔴 미착수 — 최우선 작업 |

---

*Melanoir · Session Handoff v2.0 · 2026-05-28*  
*Chief Architect · official@melanoir.co.kr*  
*Internal Document — All rights reserved.*
