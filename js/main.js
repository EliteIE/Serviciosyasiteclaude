/**
 * Servicios Ya - JavaScript Principal
 * v1.5.1 (carousel + fixes)
 * - Busca no hero integrada ao carrossel
 * - Carrossel de serviços (2 por vez desktop, 1 mobile)
 * - Modal com fluxo guiado (stepper) e validações
 * - Data mínima D+1 e horários (08–20h)
 * - Envio por WhatsApp (testes) -> +54 380 426 4962
 */

const WA_NUMBER = "543804264962"; // +54 380 426 4962

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initMiniCardsPulse();
  initPricingToggle();
  initModal();
  initForm();
  initAOS();
  initPhoneMockup();

  // Novidades
  initServicesCarousel();   // carrossel de serviços
  initSearchBar();          // busca integrada ao carrossel
  initScheduling();
  initStepper(true);
});

/* ============ Preloader ============ */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden");
      setTimeout(() => (preloader.style.display = "none"), 500);
    }, 500);
  });
}

/* ============ Header Scroll Effect ============ */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const current = window.pageYOffset;
    header.classList.toggle("scrolled", current > 50);
    header.style.transform =
      current > lastScroll && current > 100 ? "translateY(-100%)" : "translateY(0)";
    lastScroll = current;
  });
}

/* ============ Mobile Menu ============ */
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  if (!mobileToggle || !navMenu) return;

  function setBodyScroll(lock) {
    document.body.classList.toggle("no-scroll", lock);
    document.body.style.overflow = lock ? "hidden" : "";
  }

  mobileToggle.addEventListener("click", function () {
    const active = navMenu.classList.toggle("active");
    this.setAttribute("aria-expanded", active ? "true" : "false");
    setBodyScroll(active);
  });

  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      setBodyScroll(false);
    });
  });

  const mm = window.matchMedia("(min-width: 961px)");
  mm.addEventListener("change", (e) => {
    if (e.matches) {
      navMenu.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      setBodyScroll(false);
    }
  });
}

/* ============ Smooth Scroll ============ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });

      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

/* ============ Mini-cards pulse (não mexe nos service-card) ============ */
function initMiniCardsPulse() {
  const cards = document.querySelectorAll(".mini-card");
  if (!cards.length) return;
  let currentIndex = 0;
  function rotateCards() {
    cards.forEach((c) => c.classList.remove("active"));
    cards[currentIndex]?.classList.add("active");
    currentIndex = (currentIndex + 1) % cards.length;
  }
  setInterval(rotateCards, 2400);
}

/* ============ Pricing Toggle (se existir) ============ */
function initPricingToggle() {
  const toggle = document.getElementById("pricingToggle");
  if (!toggle) return;
  const singlePricing = document.querySelector(".pricing-single");
  const plansPricing = document.querySelector(".pricing-plans");
  const labels = document.querySelectorAll(".toggle-label");

  toggle.addEventListener("change", function () {
    const checked = this.checked;
    singlePricing?.classList.toggle("active", !checked);
    plansPricing?.classList.toggle("active", checked);
    labels[0]?.classList.toggle("active", !checked);
    labels[1]?.classList.toggle("active", checked);
  });
}

/* ============ Carrossel de Serviços ============ */
function initServicesCarousel() {
  const root = document.getElementById("servicesCarousel");
  if (!root) return;

  const track = root.querySelector(".sc-track");
  const slides = Array.from(track.children); // <li.sc-slide>
  const prevBtn = root.querySelector(".sc-prev");
  const nextBtn = root.querySelector(".sc-next");
  const dotsWrap =
    root.querySelector(".sc-dots") ||
    root.appendChild(Object.assign(document.createElement("div"), { className: "sc-dots" }));

  let perView = 2;
  let pageWidth = 0;
  let pageCount = 1;
  let index = 0;
  let autoplay = null;

  function computePerView() {
    return window.innerWidth <= 640 ? 1 : 2;
  }

  function visibleSlides() {
    return slides.filter((s) => s.style.display !== "none");
  }

  function layout() {
    perView = computePerView();
    pageWidth = root.querySelector(".sc-viewport").clientWidth;
    const slideWidth = pageWidth / perView;

    slides.forEach((s) => {
      s.style.minWidth = slideWidth + "px";
      s.style.maxWidth = slideWidth + "px";
      s.style.flex = `0 0 ${slideWidth}px`;
    });

    pageCount = Math.max(1, Math.ceil(visibleSlides().length / perView));
    index = Math.min(index, pageCount - 1);

    renderDots();
    moveTo(index, false);
    updateNav();
  }

  function moveTo(i, animate = true) {
    track.style.transition = animate ? "transform 400ms ease" : "none";
    track.style.transform = `translateX(${-i * pageWidth}px)`;
    if (animate) setTimeout(() => (track.style.transition = ""), 420);
    updateDots();
  }

  function updateNav() {
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= pageCount - 1;
  }

  function next() {
    index = (index + 1) % pageCount;
    moveTo(index);
    updateNav();
  }
  function prev() {
    index = (index - 1 + pageCount) % pageCount;
    moveTo(index);
    updateNav();
  }

  function startAuto() { stopAuto(); autoplay = setInterval(next, 10000); }
  function stopAuto()  { if (autoplay) clearInterval(autoplay); autoplay = null; }

  // Botões
  prevBtn.addEventListener("click", () => { prev(); startAuto(); });
  nextBtn.addEventListener("click", () => { next(); startAuto(); });

  // Pausa em hover/focus
  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);
  root.addEventListener("focusin", stopAuto);
  root.addEventListener("focusout", startAuto);

  // Pausa quando a aba perde foco
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto(); else startAuto();
  });

  // Swipe (touch/mouse) — não ativa se o alvo é botão/link
  let isDown = false, startX = 0, lastX = 0;
  const threshold = 50;

  track.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return; // permite clique normal
    isDown = true; startX = lastX = e.clientX;
    track.setPointerCapture?.(e.pointerId);
    stopAuto();
  });
  window.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    lastX = e.clientX;
    const dx = lastX - startX;
    track.style.transition = "none";
    track.style.transform = `translateX(${(-index * pageWidth) + dx}px)`;
  });
  window.addEventListener("pointerup", () => {
    if (!isDown) return;
    const dx = lastX - startX;
    isDown = false;
    if (Math.abs(dx) > threshold) {
      dx < 0 ? next() : prev();
    } else {
      moveTo(index);
    }
    startAuto();
  });

  // Teclado (quando focado dentro do carrossel)
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); startAuto(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); startAuto(); }
  });

  // Dots
  function renderDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Ir para página ${i + 1}`);
      b.addEventListener("click", () => { index = i; moveTo(index); updateNav(); startAuto(); });
      dotsWrap.appendChild(b);
    }
    updateDots();
  }
  function updateDots() {
    const dots = dotsWrap.querySelectorAll("button");
    dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));
  }

  window.addEventListener("resize", throttle(layout, 150));

  // API simples para a busca reajustar o layout quando esconder/mostrar slides
  root.__reflowCarousel = () => {
    pageCount = Math.max(1, Math.ceil(visibleSlides().length / computePerView()));
    layout();
  };

  layout();
  startAuto();
}

/* ============ Modal ============ */
let __modalFocusCleanup = null;

function initModal() {
  const modal = document.getElementById("serviceModal");
  if (!modal) return;

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeServiceModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeServiceModal();
  });
}

function openServiceModal(preset) {
  const modal = document.getElementById("serviceModal");
  if (!modal) return;

  modal.classList.add("show");
  document.body.style.overflow = "hidden";

  __modalFocusCleanup = trapFocus(modal);

  const serviceType = document.getElementById("serviceType");
  if (preset && serviceType) {
    serviceType.value = preset;
    serviceType.dispatchEvent(new Event("change", { bubbles: true }));
  }

  initScheduling();
  initStepper(true);
}

function closeServiceModal() {
  const modal = document.getElementById("serviceModal");
  if (!modal) return;
  modal.classList.remove("show");
  document.body.style.overflow = "";
  if (typeof __modalFocusCleanup === "function") {
    __modalFocusCleanup();
    __modalFocusCleanup = null;
  }
}

function selectService(service) {
  openServiceModal(service);
}

/* ============ Form (WhatsApp para testes) ============ */
function initForm() {
  const form = document.getElementById("serviceForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const f = getFields();
    const payload = {
      service: f.service.value,
      date: f.date.value,
      time: f.time.value,
      description: f.description.value.trim(),
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      barrio: f.barrio.value.trim(),
      calle: f.calle.value.trim(),
      numero: f.numero.value.trim(),
    };

    const txt = encodeURIComponent(
      `Hola! Quiero solicitar un servicio:\n` +
        `• Tipo: ${payload.service}\n` +
        `• Día/Hora: ${formatDMY(payload.date)} ${payload.time}\n` +
        `• Descripción: ${payload.description || "-"}\n` +
        `• Nombre: ${payload.name}\n` +
        `• Teléfono: ${payload.phone}\n` +
        `• Dirección: Barrio ${payload.barrio}, Calle ${payload.calle}, Nº ${payload.numero}, La Rioja\n` +
        `Nota: Cancelación sin costo hasta 24h antes del horario reservado.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${txt}`, "_blank");
    closeServiceModal();
    form.reset();
    initStepper(true);
  });
}

/* ============ AOS ============ */
function initAOS() {
  try {
    if (typeof AOS !== "undefined") {
      AOS.init({ duration: 800, easing: "ease-in-out", once: true, offset: 100 });
    }
  } catch (_) {
    /* se falhar, conteúdo já está visível graças ao CSS de fallback */
  }
}

/* ============ Phone Mockup ============ */
function initPhoneMockup() {
  const phoneScreen = document.querySelector(".phone-screen");
  if (!phoneScreen) return;
  phoneScreen.addEventListener("mousemove", function (e) {
    const r = this.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    const rx = (y - cy) / 20, ry = (cx - x) / 20;
    this.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  phoneScreen.addEventListener("mouseleave", function () {
    this.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  });
}

/* ============ Seções ativas no menu (opcional) ============ */
(() => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.5, rootMargin: "-100px 0px -100px 0px" }
  );
  sections.forEach((s) => obs.observe(s));
})();

/* ============ Lazy Loading ============ */
(() => {
  const lazy = document.querySelectorAll("img[data-src]");
  if (!lazy.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        obs.unobserve(img);
      }
    });
  });
  lazy.forEach((i) => obs.observe(i));
})();

/* ============ Service Worker (opcional) ============ */
if ("serviceWorker" in navigator) {
  try {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  } catch (e) {}
}

/* ============ Utils ============ */
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
function throttle(fn, limit) {
  let ok = true;
  return function () {
    if (!ok) return;
    fn.apply(this, arguments);
    ok = false;
    setTimeout(() => (ok = true), limit);
  };
}
function formatDMY(ymd) {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

/* ============ Busca no hero (integra com carrossel) ============ */
function initSearchBar() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const track = document.getElementById("servicesGrid"); // <ul.sc-track>
  const carousel = document.getElementById("servicesCarousel");
  if (!form || !input || !track || !carousel) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim().toLowerCase();

    // 1) avalia cartão a cartão
    const cards = track.querySelectorAll(".service-card");
    cards.forEach((c) => {
      const tags = (c.getAttribute("data-tags") || "").toLowerCase();
      const title = (c.querySelector("h3")?.textContent || "").toLowerCase();
      const match = !q || tags.includes(q) || title.includes(q);
      c.dataset.__match = match ? "1" : "0";
      c.classList.toggle("is-dim", q && !match);
    });

    // 2) mostra/esconde slides com base nos seus filhos
    let any = false;
    const slides = Array.from(track.querySelectorAll(".sc-slide"));
    slides.forEach((li) => {
      const hasMatch = !!li.querySelector('.service-card[data-__match="1"]');
      li.style.display = hasMatch || !q ? "" : "none";
      if (hasMatch) any = true;
    });

    // 3) reflow do carrossel
    carousel.__reflowCarousel?.();

    // 4) se nada encontrado, volta tudo após 2.4s
    if (!any && q) {
      setTimeout(() => {
        slides.forEach((li) => (li.style.display = ""));
        cards.forEach((c) => {
          c.classList.remove("is-dim");
          delete c.dataset.__match;
        });
        carousel.__reflowCarousel?.();
      }, 2400);
    }

    document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* ============ Agenda (D+1 e horários) ============ */
function initScheduling() {
  const dateInput = document.getElementById("scheduleDate");
  const timeSelect = document.getElementById("scheduleTime");
  if (!dateInput || !timeSelect) return;

  const now = new Date();
  const dPlus1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const toYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  dateInput.min = toYMD(dPlus1);
  if (!dateInput.value || dateInput.value < dateInput.min) dateInput.value = dateInput.min;

  timeSelect.innerHTML = "";
  for (let h = 8; h <= 20; h++) {
    const label = `${String(h).padStart(2, "0")}:00`;
    const opt = document.createElement("option");
    opt.value = label;
    opt.textContent = label;
    timeSelect.appendChild(opt);
  }
}

/* ============ Fluxo Guiado (stepper) ============ */
function getFields() {
  return {
    service: document.getElementById("serviceType"),
    date: document.getElementById("scheduleDate"),
    time: document.getElementById("scheduleTime"),
    description: document.getElementById("description"),
    name: document.getElementById("name"),
    phone: document.getElementById("phone"),
    barrio: document.getElementById("barrio"),
    calle: document.getElementById("calle"),
    numero: document.getElementById("numero"),
    submit: document.getElementById("submitBtn"),
  };
}

function initStepper(forceRevalidate = false) {
  const f = getFields();
  if (!f.service || !f.submit) return;

  const groups = {
    step2: [f.date, f.time],
    step3: [f.description],
    step4: [f.name, f.phone, f.barrio, f.calle, f.numero],
  };

  function setEnabled(els, enable) {
    els.forEach((el) => {
      if (!el) return;
      el.disabled = !enable;
      el.closest(".form-group")?.classList.toggle("is-disabled", !enable);
    });
  }

  function isValidService() { return !!f.service.value; }
  function isValidDateTime() { return f.date.value && f.date.value >= f.date.min && !!f.time.value; }
  function isValidPhone(v) { return (v || "").replace(/\D/g, "").length >= 7; }
  function isValidAddress() { return f.barrio.value.trim() && f.calle.value.trim() && f.numero.value.trim(); }

  function update() {
    setEnabled(groups.step2, isValidService());
    const step2ok = isValidService() && isValidDateTime();
    setEnabled(groups.step3, step2ok);
    setEnabled(groups.step4, step2ok);

    const allOk =
      isValidService() && isValidDateTime() &&
      f.name.value.trim() && isValidPhone(f.phone.value) && isValidAddress();

    f.submit.disabled = !allOk;
    f.submit.classList.toggle("is-disabled", !allOk);
  }

  [f.service, f.date, f.time, f.description, f.name, f.phone, f.barrio, f.calle, f.numero]
    .filter(Boolean)
    .forEach((el) => {
      el.addEventListener("change", update);
      el.addEventListener("input", debounce(update, 120));
    });

  if (forceRevalidate) update(); else update();
}

/* ============ A11y: focus trap ============ */
function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const prevActive = document.activeElement;

  function onKey(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  container.addEventListener("keydown", onKey);
  // foca o primeiro focável do modal
  setTimeout(() => first.focus(), 0);

  return () => {
    container.removeEventListener("keydown", onKey);
    if (prevActive && typeof prevActive.focus === "function") prevActive.focus();
  };
}
