/**
 * Melanoir site-wide language switcher.
 * @see site/assets/melanoir-lang.css
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "melanoir_lang";
  var LEGACY_KEYS = ["mela_lang", "photoshield_core_lang"];

  var LANG_TO_HTML = {
    kr: "ko",
    en: "en",
    fr: "fr",
    jp: "ja",
    cn: "zh-CN",
  };

  var LANG_TO_TRIGGER = {
    kr: "KR",
    en: "EN",
    fr: "FR",
    jp: "JP",
    cn: "CN",
  };

  var MENU_ITEMS = [
    { lang: "kr", label: "한국어 (KR)" },
    { lang: "en", label: "English (EN)" },
    { lang: "fr", label: "Français (FR)" },
    { lang: "jp", label: "日本語 (JP)" },
    { lang: "cn", label: "中文 (CN)" },
  ];

  function migrateLegacyStorage() {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      for (var i = 0; i < LEGACY_KEYS.length; i++) {
        var legacy = localStorage.getItem(LEGACY_KEYS[i]);
        if (legacy) {
          localStorage.setItem(STORAGE_KEY, legacy);
          return;
        }
      }
    } catch (e) {
      /* private mode */
    }
  }

  function detectInitialLang(localizedContent, fallback) {
    migrateLegacyStorage();
    fallback = fallback || "kr";
    var content = localizedContent || {};

    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && content[saved]) return saved;
    } catch (e) {
      /* ignore */
    }

    var browserLang = ((navigator.language || navigator.userLanguage || "") + "").toLowerCase();
    if (browserLang.startsWith("en")) return "en";
    if (browserLang.startsWith("fr")) return "fr";
    if (browserLang.startsWith("ja")) return "jp";
    if (browserLang.startsWith("zh")) return "cn";
    return fallback;
  }

  function createDropdownHTML(options) {
    var theme = (options && options.theme) || "light";
    var className = "melanoir-lang-dropdown melanoir-lang--" + theme;
    if (options && options.extraClass) className += " " + options.extraClass;

    var items = MENU_ITEMS.map(function (item) {
      return (
        '<a href="#" class="melanoir-lang-item" data-lang="' +
        item.lang +
        '" role="option">' +
        item.label +
        "</a>"
      );
    }).join("");

    return (
      '<div class="' +
      className +
      '">' +
      '<div class="melanoir-lang-trigger" id="melanoir-lang-trigger" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false">KR</div>' +
      '<div class="melanoir-lang-menu" id="melanoir-lang-menu" role="listbox">' +
      items +
      '</div></div>'
    );
  }

  function resolveDropdown(root) {
    root = root || document;
    return root.querySelector(".melanoir-lang-dropdown, .mela-lang-dropdown");
  }

  function resolveTrigger(dropdown) {
    return (
      dropdown.querySelector(".melanoir-lang-trigger") ||
      dropdown.querySelector("#mela-lang-trigger") ||
      dropdown.querySelector("#melanoir-lang-trigger") ||
      dropdown.querySelector(".mela-lang-trigger")
    );
  }

  function resolveLangItems(dropdown) {
    return Array.prototype.slice.call(
      dropdown.querySelectorAll(".melanoir-lang-item, .mela-lang-item")
    );
  }

  function setMenuOpen(dropdown, open) {
    dropdown.classList.toggle("is-open", !!open);
    var trigger = resolveTrigger(dropdown);
    if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function applyDocumentLang(lang) {
    document.documentElement.lang = LANG_TO_HTML[lang] || "ko";
  }

  function updateTrigger(trigger, lang) {
    if (trigger) trigger.textContent = LANG_TO_TRIGGER[lang] || "KR";
  }

  function updateActiveItems(items, lang) {
    items.forEach(function (item) {
      item.classList.toggle("active", item.dataset.lang === lang);
    });
  }

  function init(config) {
    config = config || {};
    var localizedContent = config.localizedContent;
    if (!localizedContent) {
      console.warn("[MelanoirLang] localizedContent is required");
      return null;
    }

    var contentEl =
      config.contentEl ||
      (config.contentSelector && document.querySelector(config.contentSelector));

    var dropdown = resolveDropdown(document);
    if (!dropdown) {
      var parent = config.mountParent || document.body;
      var tmp = document.createElement("div");
      tmp.innerHTML = createDropdownHTML({ theme: config.theme, extraClass: config.extraClass });
      dropdown = tmp.firstElementChild;
      if (!dropdown) return null;
      if (config.mountBefore && config.mountBefore.parentNode) {
        config.mountBefore.parentNode.insertBefore(dropdown, config.mountBefore);
      } else {
        parent.appendChild(dropdown);
      }
    } else if (config.theme) {
      dropdown.classList.remove("melanoir-lang--light", "melanoir-lang--dark");
      dropdown.classList.add("melanoir-lang--" + config.theme);
    }

    var trigger = resolveTrigger(dropdown);
    var langItems = resolveLangItems(dropdown);

    function applyLanguage(lang) {
      if (!localizedContent[lang]) lang = config.fallbackLang || "kr";

      applyDocumentLang(lang);
      updateTrigger(trigger, lang);

      if (contentEl && localizedContent[lang] != null) {
        if (typeof localizedContent[lang] === "string") {
          contentEl.innerHTML = localizedContent[lang];
        } else if (typeof config.renderContent === "function") {
          config.renderContent(contentEl, lang, localizedContent[lang]);
        }
      }

      updateActiveItems(langItems, lang);
      saveLang(lang);

      if (typeof config.onApply === "function") {
        config.onApply(lang);
      }
    }

    if (trigger) {
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        setMenuOpen(dropdown, !dropdown.classList.contains("is-open"));
      });
    }

    document.addEventListener("click", function () {
      setMenuOpen(dropdown, false);
    });

    langItems.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        applyLanguage(item.dataset.lang);
        setMenuOpen(dropdown, false);
      });
    });

    var initialLang = detectInitialLang(localizedContent, config.fallbackLang);
    applyLanguage(initialLang);

    return {
      applyLanguage: applyLanguage,
      getLang: function () {
        try {
          return localStorage.getItem(STORAGE_KEY) || initialLang;
        } catch (e) {
          return initialLang;
        }
      },
      dropdown: dropdown,
      contentEl: contentEl,
    };
  }

  global.MelanoirLang = {
    STORAGE_KEY: STORAGE_KEY,
    LEGACY_KEYS: LEGACY_KEYS,
    LANG_TO_HTML: LANG_TO_HTML,
    LANG_TO_TRIGGER: LANG_TO_TRIGGER,
    MENU_ITEMS: MENU_ITEMS,
    migrateLegacyStorage: migrateLegacyStorage,
    detectInitialLang: detectInitialLang,
    createDropdownHTML: createDropdownHTML,
    init: init,
  };
})(typeof window !== "undefined" ? window : globalThis);
