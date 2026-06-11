/* ============================================================
   Melanoir — 통합 푸터 + Keep Exploring 렌더러 (Phase 1 / B3·B9)
   사용법:
     <div data-mnr-explore="exclude:embo,products"></div>
     <div data-mnr-footer data-theme="light"></div>
     <script src="/assets/mnr-ui.js"></script>
   JS로 콘텐츠를 다시 그리는 페이지(언어 전환)는 onApply에서
   window.MnrUI.renderAll() 을 호출할 것.
   ============================================================ */
(function (global) {
  "use strict";

  var CONTACT_EMAIL = "official@melanoir.co.kr";

  var FOOTER_GROUPS = [
    {
      title: "Products",
      links: [
        { label: "Embo", href: "/products/embo" },
        { label: "Photoshield Core", href: "/products/photoshieldcore" },
        { label: "품질·안전 데이터", href: "/quality" },
        { label: "전체 제품", href: "/products" },
      ],
    },
    {
      title: "Club",
      links: [
        { label: "멜라누아 클럽 (정품 등록)", href: "/register" },
        { label: "멜라누아 프로", href: "/pro" },
        { label: "정품 확인", href: "https://verify.melanoir.co.kr" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "문의하기", href: "/contact" },
        { label: "Recruitment", href: "/recruitment" },
        { label: "문의: " + CONTACT_EMAIL, href: "mailto:" + CONTACT_EMAIL },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "개인정보처리방침", href: "/privacy" },
        { label: "이용약관", href: "/terms" },
      ],
    },
  ];

  var FOOTER_BASE =
    "Melanoir Co., Ltd. | 인천광역시 서구 정서진로 410, A312<br>© 2026 Melanoir. All rights reserved.";

  var EXPLORE_CARDS = {
    embo: {
      title: "MELANOIR EMBO",
      desc: "멜라닌 기반 PMU 잉크. 지구에서 가장 안전한 Black을 추구합니다.",
      href: "/products/embo",
      cta: "자세히 보기",
    },
    club: {
      title: "멜라누아 클럽",
      desc: "정품을 등록하면 크레딧이 쌓입니다. 별도 가입 절차 없이 시작됩니다.",
      href: "/register",
      cta: "등록 안내",
    },
    pro: {
      title: "멜라누아 프로",
      desc: "시술자를 위한 포인트 프로그램. 시술할수록 등급이 올라갑니다.",
      href: "/pro",
      cta: "프로 알아보기",
    },
    products: {
      title: "PRODUCTS",
      desc: "멜라누아 제품 라인업 — Embo, Photoshield Core.",
      href: "/products",
      cta: "라인업 보기",
    },
  };
  var EXPLORE_ORDER = ["embo", "club", "pro", "products"];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function footerHTML() {
    var groups = FOOTER_GROUPS.map(function (g) {
      var links = g.links
        .map(function (l) {
          var ext = /^https?:/.test(l.href) ? ' target="_blank" rel="noopener noreferrer"' : "";
          return '<li><a href="' + l.href + '"' + ext + ">" + esc(l.label) + "</a></li>";
        })
        .join("");
      return (
        '<div class="mnr-uft-group"><h3>' + esc(g.title) + "</h3><ul>" + links + "</ul></div>"
      );
    }).join("");
    return (
      '<div class="mnr-uft-inner"><div class="mnr-uft-grid">' +
      groups +
      '</div><p class="mnr-uft-base">' +
      FOOTER_BASE +
      "</p></div>"
    );
  }

  function exploreHTML(excludeKeys) {
    var cards = EXPLORE_ORDER.filter(function (k) {
      return excludeKeys.indexOf(k) === -1;
    })
      .slice(0, 3)
      .map(function (k) {
        var c = EXPLORE_CARDS[k];
        return (
          '<a class="mnr-explore-card" href="' + c.href + '">' +
          "<h4>" + esc(c.title) + "</h4>" +
          "<p>" + esc(c.desc) + "</p>" +
          '<span class="mnr-explore-cta">' + esc(c.cta) + "</span></a>"
        );
      })
      .join("");
    return (
      '<div class="mnr-explore-inner">' +
      '<p class="mnr-explore-eyebrow">KEEP EXPLORING</p>' +
      '<h2 class="mnr-explore-title">더 둘러보기.</h2>' +
      '<div class="mnr-explore-grid">' + cards + "</div></div>"
    );
  }

  function renderAll() {
    document.querySelectorAll("[data-mnr-footer]").forEach(function (el) {
      el.className = "mnr-uft";
      if (!el.getAttribute("data-theme")) el.setAttribute("data-theme", "light");
      el.innerHTML = footerHTML();
    });
    document.querySelectorAll("[data-mnr-explore]").forEach(function (el) {
      var spec = el.getAttribute("data-mnr-explore") || "";
      var exclude = [];
      var m = spec.match(/exclude:([\w,\-]+)/);
      if (m) exclude = m[1].split(",");
      el.className = "mnr-explore";
      if (!el.getAttribute("data-theme")) el.setAttribute("data-theme", "light");
      el.innerHTML = exploreHTML(exclude);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else {
    renderAll();
  }

  global.MnrUI = { renderAll: renderAll, FOOTER_GROUPS: FOOTER_GROUPS, EXPLORE_CARDS: EXPLORE_CARDS };
})(typeof window !== "undefined" ? window : globalThis);
