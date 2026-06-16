/* ============================================================
   Melanoir — 기한부 콘텐츠 슬롯 시스템 (Phase 0 / B10)
   기한이 지나면 베타 CTA를 '정식 출시 알림 받기'로 자동 교체.
   기한·URL만 바꾸면 다음 캠페인에도 재사용.
   ============================================================ */
(function () {
  "use strict";

  var BETA_DEADLINE = new Date("2026-06-30T23:59:59+09:00");
  var LAUNCH_FORM_URL = "/register#waitlist";
  var LAUNCH_CTA_LABEL = "정식 출시 알림 받기";

  function applyPostBeta() {
    // 1) 베타 신청 폼 링크 전부 → 출시 알림 폼
    document.querySelectorAll('a[href*="forms.gle"]').forEach(function (a) {
      a.href = LAUNCH_FORM_URL;
      if (a.textContent.trim()) a.textContent = LAUNCH_CTA_LABEL;
    });

    // 2) 플로팅 CTA 문구
    var floating = document.querySelector(".floating-cta span");
    if (floating) floating.textContent = "베타 모집 마감 — 출시 소식을 받아보세요";

    // 3) 마감일 안내 문구 교체 (텍스트 매칭)
    var swaps = [
      ["베타테스터 모집 마감: 6월 30일", "베타 모집 마감 — 출시 소식을 받아보세요"],
      ["모집 마감: 2026년 6월 30일 23:59", "베타테스터 모집이 마감되었습니다."],
    ];
    document.querySelectorAll("p, span, h2, h3").forEach(function (el) {
      if (el.children.length > 1) return;
      swaps.forEach(function (pair) {
        if (el.textContent.indexOf(pair[0]) !== -1) {
          el.textContent = el.textContent.replace(pair[0], pair[1]);
        }
      });
    });

    // 4) Open Call 안내 보조 문구 (구글 로그인 안내 → 알림 안내)
    document.querySelectorAll(".login-notice").forEach(function (el) {
      if (el.textContent.indexOf("구글 로그인") !== -1) {
        el.textContent = "연락처를 남기시면 정식 출시 소식을 가장 먼저 보내드립니다.";
      }
    });

    // 5) 베타 한정 블록 표시 전환 (있을 경우)
    document.querySelectorAll("[data-slot-beta-only]").forEach(function (el) {
      el.style.display = "none";
    });
    document.querySelectorAll("[data-slot-post-beta]").forEach(function (el) {
      el.style.display = "";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (new Date() > BETA_DEADLINE) applyPostBeta();
  });
})();
