# 인사이트 카드 페이지 (`/insights/`)

기존 사이트 구조를 **건드리지 않는 추가 페이지**다. 마케팅 자동화 에이전트(marketing_agent)가
매일 카드레터 1장을 발행하면 여기에 자동으로 쌓인다.

## 구성 (이 디렉토리만)
- `index.html` — 카드 그리드 페이지. 사이트 공통 자산(`../assets/*`, Pretendard/Barlow) 재사용.
- `insights.css` — 카드 그리드 + (이미지 없을 때) 폴백 카드레터 스타일.
- `cards.json` — 카드 목록 (에이전트가 매일 항목 추가). 페이지가 이걸 읽어 렌더.
- `cards/` — 카드레터 이미지 (에이전트가 매일 `<날짜>.png` 추가).

> ⚠ **이미지는 텍스트가 이미 구워진 완성 카드레터다** (에이전트 `insight-card.mjs` 가 사진 위에
> 핸들·제목·서브를 렌더해서 PNG 로 굽는다). 그래서 페이지는 그 이미지를 **그대로(flat) 표시**한다.
> 이미지 위에 제목/서브를 **다시 오버레이하면 텍스트가 두 번 나온다** — 하지 말 것.
> `cards.json` 의 텍스트 필드는 alt·날짜칩·정렬·링크 + 이미지 없을 때의 폴백 렌더용이다.

## `cards.json` 계약 (에이전트가 쓰는 형식)
```json
{
  "date": "YYYY-MM-DD",          // 발행일 (정렬·표시)
  "category": "소재 인사이트",     // 상단 eyebrow (선택)
  "handle": "@melanoir",          // 좌상단 핸들 (선택, 기본 @melanoir)
  "title": "카드 제목(인사이트 한 줄)",
  "subtitle": "보조 설명(선택)",
  "image": "2026-06-16.png",      // cards/ 안 파일명(완성 카드레터). 빈 값이면 필드로 폴백 렌더
  "link": ""                       // 클릭 시 이동(선택). 비우면 이미지 원본
}
```

## 에이전트 발행 흐름 (매일)
1. 카드레터 이미지 생성 (클라 사진 풀 + 인사이트 텍스트 오버레이) → `cards/<날짜>.png`
2. `cards.json` 맨 앞에 위 항목 추가
3. 커밋 + 푸시 → Vercel 자동 배포

> 에이전트 쪽 실행: marketing_agent 레포에서 `npm run insight:daily -- --website="<이 레포>/web/site/insights" --commit --push`
> (자세한 건 marketing_agent 의 `harness/docs/INSIGHT-CARDS.md`)

> ⚠ 이 페이지는 **추가**다. `index.html`·다른 디렉토리 등 기존 구조는 변경하지 않는다.
> 사이트 메인 네비에 노출할지(헤더 메뉴 추가)는 클라이언트 결정 — 노출 안 해도 `/insights/` 직접 접근 가능.
