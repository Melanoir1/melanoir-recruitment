(function () {
  function getAnchorOffset() {
    var offset = 0;
    var header = document.querySelector('.mnr-header');
    var emboLn = document.querySelector('.embo-ln');
    if (header) offset += header.offsetHeight;
    if (emboLn) offset += emboLn.offsetHeight;
    return offset + 12;
  }

  function scrollToAnchor(hash, behavior) {
    if (!hash || hash === '#') return false;
    var target = document.querySelector(hash);
    if (!target) return false;
    var top = target.getBoundingClientRect().top + window.pageYOffset - getAnchorOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: behavior || 'smooth' });
    return true;
  }

  function handleInitialHash() {
    if (!location.hash) return;
    var hash = location.hash;
    var run = function () {
      if (scrollToAnchor(hash, 'instant')) {
        history.replaceState(null, '', hash);
      }
    };
    requestAnimationFrame(function () {
      requestAnimationFrame(run);
    });
    window.addEventListener('load', run, { once: true });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="#"]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href === '#') return;

    var url;
    try {
      url = new URL(href, location.href);
    } catch (_) {
      return;
    }

    if (url.pathname !== location.pathname || url.search !== location.search) return;
    if (!url.hash || url.hash === '#') return;

    var target = document.querySelector(url.hash);
    if (!target) return;

    e.preventDefault();
    scrollToAnchor(url.hash, 'smooth');
    history.pushState(null, '', url.hash);
  });

  document.addEventListener('DOMContentLoaded', function () {
    handleInitialHash();
  });
})();
