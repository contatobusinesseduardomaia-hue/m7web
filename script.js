/* M7 Web — interações premium e leves */
(function () {
  "use strict";
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fino = window.matchMedia("(hover: none)").matches;

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* Reveal no scroll */
  var alvos = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    alvos.forEach(function (a) { io.observe(a); });
  } else {
    alvos.forEach(function (a) { a.classList.add("in"); });
  }

  /* Sombra/borda no header ao rolar */
  var cab = document.querySelector(".cab");
  if (cab) {
    var onScroll = function () { cab.classList.toggle("rolou", window.scrollY > 6); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Menu mobile */
  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("menu");
  if (menuBtn && menu) {
    var fecha = function () { menu.classList.remove("aberto"); menuBtn.setAttribute("aria-expanded", "false"); };
    menuBtn.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      menuBtn.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", fecha); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecha(); });
  }

  var stage = document.querySelector(".hero__stage");

  /* Float dos mockups após a entrada */
  if (stage && !reduz) {
    setTimeout(function () { stage.classList.add("anim"); }, 1500);
  }

  /* Parallax sutil dos mockups ao mouse (só desktop) */
  if (stage && !reduz && !fino) {
    var raf = false, mx = 0, my = 0;
    stage.addEventListener("mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = true;
      requestAnimationFrame(function () {
        stage.style.transform = "translate(" + (mx * 14).toFixed(1) + "px," + (my * 12).toFixed(1) + "px)";
        raf = false;
      });
    });
    stage.addEventListener("mouseleave", function () {
      stage.style.transform = "translate(0,0)";
    });
  }

  /* ---- Analytics scaffold (pronto para integração futura) ----
     Encaminha eventos para GA4 (gtag), Meta Pixel (fbq) e dataLayer, se existirem.
     Sem nenhuma ferramenta instalada, é um no-op silencioso. */
  function track(evento, dados) {
    dados = dados || {};
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: evento }, dados)); } catch (e) {}
    try { if (typeof window.gtag === "function") window.gtag("event", evento, dados); } catch (e) {}
    try { if (typeof window.fbq === "function") window.fbq("trackCustom", evento, dados); } catch (e) {}
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var cta = a.getAttribute("data-cta") || "";
    if (href.indexOf("wa.me") > -1 || href.indexOf("api.whatsapp") > -1) track("whatsapp_click", { origem: cta || "link" });
    else if (href.indexOf("instagram.com") > -1) track("instagram_click", {});
    else if (cta) track("cta_click", { origem: cta });
    else if (a.closest(".case")) track("projeto_click", {});
  });

  var fim = document.querySelector(".cta-fim");
  if (fim && "IntersectionObserver" in window) {
    var ioFim = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { track("secao_final_visivel", {}); ioFim.disconnect(); } });
    }, { threshold: 0.5 });
    ioFim.observe(fim);
  }
})();
