(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav */
  var nav = $("#nav");
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("#navLinks a").forEach(function (a) {
    a.addEventListener("click", function () { navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); });
  });

  /* scrollspy */
  var spyLinks = $$("[data-spy]");
  var spyMap = {};
  spyLinks.forEach(function (a) { spyMap[a.getAttribute("href").slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        spyLinks.forEach(function (a) { a.classList.remove("active"); });
        var link = spyMap[en.target.id];
        if (link) link.classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["play", "how", "about", "press", "faq"].forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });

  /* reveal on scroll */
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); reveal.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(function (el) { reveal.observe(el); });

  /* animated counters */
  var counters = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      counters.unobserve(en.target);
      var el = en.target;
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var pre = el.getAttribute("data-prefix") || "";
      var suf = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = pre + target.toFixed(dec) + suf; return; }
      var t0 = null, dur = 1200;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + (target * eased).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(function (el) { counters.observe(el); });

  /* game stage */
  var stage = $("#play"), frame = $("#gameFrame"), gate = $("#stageGate");
  var status = $("#stageStatus"), statusText = $("#stageStatusText");
  var loaded = false, started = false;
  var GAME_SRC = "game";

  function setStatus(text, loading) {
    statusText.textContent = text;
    status.classList.toggle("loading", !!loading);
  }
  function loadGame() {
    if (loaded) return;
    loaded = true;
    setStatus("Raising the terminal…", true);
    frame.addEventListener("load", function () {
      setStatus("Terminal ready", false);
      stage.classList.remove("loading");
    }, { once: true });
    frame.src = GAME_SRC;
  }
  function startGame() {
    loadGame();
    started = true;
    gate.classList.add("hidden");
    try { frame.contentWindow && frame.contentWindow.focus(); } catch (e) {}
  }
  gate.addEventListener("click", startGame);
  gate.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startGame(); } });

  /* the game is the point of the page: start loading it immediately so it is
     ready on the first screen; the gate still requires a click to capture input */
  loadGame();

  /* hero / cta play buttons: scroll then start */
  ["#heroPlay", "#ctaPlay"].forEach(function (sel) {
    var b = $(sel);
    if (b) b.addEventListener("click", function () { setTimeout(startGame, 350); });
  });

  /* reload */
  $("#reloadBtn").addEventListener("click", function () {
    loaded = false; started = false;
    gate.classList.remove("hidden");
    stage.classList.add("loading");
    frame.src = "about:blank";
    setTimeout(loadGame, 60);
  });

  /* fullscreen */
  var fsBtn = $("#fsBtn");
  fsBtn.addEventListener("click", function () {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
    } else if (stage.requestFullscreen) {
      stage.requestFullscreen().catch(function () {});
    }
  });
  document.addEventListener("fullscreenchange", function () {
    fsBtn.textContent = document.fullscreenElement ? "🗗" : "⛶";
  });

  /* FAQ accordion */
  $$(".faq-item").forEach(function (item) {
    var q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    });
  });

  $("#year").textContent = new Date().getFullYear();
})();
