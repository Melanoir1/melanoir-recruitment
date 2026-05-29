(function () {
  "use strict";

  var MANIFEST_URL = "/assets/space-green-cluster.json";

  function loadMedia() {
    return fetch(MANIFEST_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("manifest fetch failed");
        return res.json();
      })
      .then(function (data) {
        return data && data.items ? data.items : [];
      })
      .catch(function () {
        return [];
      });
  }

  var reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buildSlide(item, index) {
    var slide = document.createElement("div");
    slide.className = "space-carousel__slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", String(index + 1));

    if (item.type === "video") {
      var video = document.createElement("video");
      video.src = item.url;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.preload = "metadata";
      video.setAttribute("aria-label", "근무 환경 영상 " + (index + 1));
      if (!reduceMotion) {
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.loop = true;
        video.autoplay = false;
        video.controls = false;
      } else {
        video.controls = true;
      }
      slide.appendChild(video);
    } else {
      var img = document.createElement("img");
      img.src = item.url;
      img.alt = "근무 환경 " + (index + 1);
      img.loading = index === 0 ? "eager" : "lazy";
      img.decoding = "async";
      slide.appendChild(img);
    }
    return slide;
  }

  function initCarousel(root, items) {
    var viewport = root.querySelector(".space-carousel__viewport");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var countEl = root.querySelector("[data-carousel-count]");
    var emptyEl = root.querySelector("[data-carousel-empty]");
    var hintEl = root.querySelector("[data-carousel-hint]");

    root.removeAttribute("data-loading");

    if (!items.length) {
      if (emptyEl) emptyEl.hidden = false;
      if (hintEl) hintEl.hidden = true;
      if (countEl) countEl.textContent = "";
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (hintEl) hintEl.hidden = false;

    items.forEach(function (item, i) {
      viewport.appendChild(buildSlide(item, i));
    });

    var slides = viewport.querySelectorAll(".space-carousel__slide");
    var videos = viewport.querySelectorAll("video");
    var index = 0;

    function syncVideoPlayback() {
      if (reduceMotion || !videos.length) return;
      var center = viewport.scrollLeft + viewport.clientWidth / 2;
      videos.forEach(function (video) {
        var slide = video.closest(".space-carousel__slide");
        if (!slide) return;
        var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        var isActive = Math.abs(slideCenter - center) < slide.offsetWidth * 0.55;
        if (isActive) {
          var playPromise = video.play();
          if (playPromise && playPromise.catch) playPromise.catch(function () {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }

    function scrollToIndex(i) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      var slide = slides[index];
      var left = slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
      viewport.scrollTo({ left: left, behavior: "smooth" });
      if (countEl) {
        countEl.textContent = String(index + 1) + " / " + String(slides.length);
      }
      if (!reduceMotion) {
        setTimeout(syncVideoPlayback, reduceMotion ? 0 : 420);
      }
    }

    function nearestIndex() {
      var center = viewport.scrollLeft + viewport.clientWidth / 2;
      var best = 0;
      var bestDist = Infinity;
      slides.forEach(function (slide, i) {
        var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        var dist = Math.abs(slideCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        scrollToIndex(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        scrollToIndex(index + 1);
      });
    }

    var scrollTimer;
    viewport.addEventListener(
      "scroll",
      function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          index = nearestIndex();
          if (countEl) {
            countEl.textContent = String(index + 1) + " / " + String(slides.length);
          }
          syncVideoPlayback();
        }, 80);
      },
      { passive: true }
    );

    scrollToIndex(0);
    syncVideoPlayback();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("spaceCarousel");
    if (!root) return;

    loadMedia().then(function (items) {
      initCarousel(root, items);
    });
  });
})();
