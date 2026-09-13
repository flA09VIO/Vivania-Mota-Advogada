// ============================================================
// VIVANIA MOTA — ADVOCACIA DE FAMÍLIA
// Motion system, navegação e formulário de contato via WhatsApp
// ============================================================

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. Header — encolhe e ganha fundo ao rolar
  --------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var lastScrollState = false;

  function updateHeader() {
    var scrolled = window.scrollY > 40;
    if (scrolled !== lastScrollState) {
      header.classList.toggle("is-scrolled", scrolled);
      lastScrollState = scrolled;
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------------------------------------------------------
     2. Barra de progresso de scroll
  --------------------------------------------------------- */
  var progressBar = document.querySelector(".scroll-progress span");

  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (scrollTop / max) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ---------------------------------------------------------
     3. Menu mobile
  --------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");

  menuToggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* ---------------------------------------------------------
     4. Entrada do Hero (um único momento coreografado)
  --------------------------------------------------------- */
  var hero = document.querySelector(".hero");
  window.requestAnimationFrame(function () {
    setTimeout(function () {
      hero.classList.add("is-ready");
    }, 120);
  });

  /* ---------------------------------------------------------
     5. Reveal progressivo das seções (IntersectionObserver)
  --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-image]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------
     6. Cursor discreto (somente desktop com mouse)
  --------------------------------------------------------- */
  var cursor = document.querySelector(".cursor-dot");
  var canUseCursor = window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion;

  if (canUseCursor) {
    window.addEventListener("mousemove", function (e) {
      cursor.classList.add("is-active");
      cursor.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%)";
    });

    var hoverTargets = document.querySelectorAll("a, button, .grupo-item");
    hoverTargets.forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
    });
  }

  /* ---------------------------------------------------------
     7. Indicador de scroll no Hero — leva à próxima seção
  --------------------------------------------------------- */
  var scrollCue = document.getElementById("scrollCue");
  if (scrollCue) {
    scrollCue.addEventListener("click", function () {
      var next = document.querySelector(".stats-band");
      if (next) next.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------
     8. Formulário de contato → mensagem pronta no WhatsApp
  --------------------------------------------------------- */
  var form = document.getElementById("contatoForm");
  var nota = form.querySelector(".form-nota");
  var WHATSAPP_NUMBER = "5571991962289";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nome = form.nome.value.trim();
    var canal = form.canal.value.trim();
    var mensagem = form.mensagem.value.trim();

    if (!nome || !canal || !mensagem) {
      nota.textContent = "Preencha todos os campos para continuar.";
      return;
    }

    var texto =
      "Olá, meu nome é " + nome + ".\n" +
      "Contato para retorno: " + canal + "\n\n" +
      mensagem;

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);

    nota.textContent = "Abrindo o WhatsApp com a sua mensagem…";
    window.open(url, "_blank", "noopener");
    form.reset();
  });
})();
