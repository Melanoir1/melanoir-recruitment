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

  var LOGO_WHITE = "https://res.cloudinary.com/dssuxurpt/image/upload/v1778836628/MELANOIR_sg2_white_bpaxvi.png";

  /* === 사이트 공통 메뉴: 이 배열이 유일한 출처(Single Source of Truth) === */
  var NAV_ITEMS = [
    { key: "products",   label: "Products",   href: "/products" },
    { key: "technology", label: "Technology", href: "/#technology" },
    { key: "club",       label: "Club",       href: "/register" },
    { key: "pro",        label: "Pro",        href: "/pro" },
    { key: "recruit",    label: "채용",        href: "/recruitment" },
  ];

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
      title: "Membership",
      links: [
        { label: "멜라누아 클럽 (정품 등록)", href: "/register" },
        { label: "멜라누아 프로", href: "/pro" },
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

  function headerHTML(theme, current) {
    var items = NAV_ITEMS.map(function (it) {
      var cur = it.key === current ? ' class="is-current"' : "";
      return '<a href="' + it.href + '"' + cur + ">" + esc(it.label) + "</a>";
    }).join("");
    // 라이트 배경에서는 흰 로고를 invert하여 검게, 다크 배경에서는 흰 로고 그대로
    var logoStyle = theme === "dark" ? "" : ' style="filter: invert(1);"';
    return (
      '<div class="mnr-header-inner">' +
        '<a class="mnr-header-logo" href="/">' +
          '<img src="' + LOGO_WHITE + '" alt="Melanoir"' + logoStyle + ">" +
        "</a>" +
        '<button class="mnr-nav-toggle" type="button" aria-label="메뉴" aria-expanded="false">' +
          "<span></span><span></span><span></span></button>" +
        '<nav class="mnr-nav" aria-label="Main">' + items + "</nav>" +
      "</div>"
    );
  }

  function bindNavToggle(scope) {
    var toggle = scope.querySelector(".mnr-nav-toggle");
    var nav = scope.querySelector(".mnr-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
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
      '</div><p class="mnr-footer-legal">상호: 멜라누아&ensp;|&ensp;대표: [대표자명]&ensp;|&ensp;사업자등록번호: [사업자등록번호]&ensp;|&ensp;통신판매업신고번호: [통신판매업신고번호]&ensp;|&ensp;주소: [주소]&ensp;|&ensp;이메일: official@melanoir.co.kr</p><p class="mnr-uft-base">' +
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
    document.querySelectorAll("[data-mnr-header]").forEach(function (el) {
      var theme = el.getAttribute("data-theme") || "light";
      var current = el.getAttribute("data-current") || "";
      el.className = "mnr-header";
      el.setAttribute("data-theme", theme);
      el.innerHTML = headerHTML(theme, current);
      bindNavToggle(el);
    });
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

  global.MnrUI = { renderAll: renderAll, FOOTER_GROUPS: FOOTER_GROUPS, EXPLORE_CARDS: EXPLORE_CARDS, NAV_ITEMS: NAV_ITEMS };
})(typeof window !== "undefined" ? window : globalThis);
