/**
 * Servicios Ya - JavaScript Principal (GitHub Pages safe)
 * v1.5.0
 * - Busca no hero
 * - Modal com fluxo guiado (stepper) e validações
 * - Data mínima D+1 e horários de hora em hora (08–20h)
 * - Envio por WhatsApp (testes) -> +54 380 426 4962
 */

const WA_NUMBER = "543804264962"; // +54 380 426 4962 (formato wa.me)

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initServiceCards();
  initPricingToggle();
  initModal();
  initForm();
  initAOS();
  initPhoneMockup();

  // Novidades
  initSearchBar();
  initScheduling();
  initStepper(); // fluxo guiado
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

  mobileToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
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

/* ============ Service Cards Animation ============ */
function initServiceCards() {
  const cards = document.querySelectorAll(".mini-card, .service-card");
  if (!cards.length) return;
  let currentIndex = 0;

  function rotateCards() {
    cards.forEach((c) => c.classList.remove("active"));
    cards[currentIndex]?.classList.add("active");
    currentIndex = (currentIndex + 1) % cards.length;
  }
  setInterval(rotateCards, 2000);

  cards.forEach((card, index) => {
    card.addEventListener("click", function () {
      cards.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      currentIndex = index;
    });
  });
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

/* ============ Modal ============ */
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

  // 1) garantir inputs (D+1/hora) e listeners do stepper
  initScheduling();
  initStepper(true);

  // 2) setar o serviço (se veio da grade) e disparar change APÓS listeners existirem
  const serviceType = document.getElementById("serviceType");
  if (preset && serviceType) {
    serviceType.value = preset;
    serviceType.dispatchEvent(new Event("change", { bubbles: true }));
    // foco direto na data para agilizar
    setTimeout(() => document.getElementById("scheduleDate")?.focus(), 60);
  }
}

function closeServiceModal() {
  const modal = document.getElementById("serviceModal");
  if (!modal) return;
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function selectService(service) {
  openServiceModal(service);
}

/* ============ Form Handling (envio por WhatsApp no teste) ============ */
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
    initScheduling();
    initStepper(true);
  });
}

/* ============ AOS ============ */
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true, offset: 100 });
  }
}

/* ============ Phone Mockup ============ */
function initPhoneMockup() {
  const phoneScreen = document.querySelector(".phone-screen");
  if (!phoneScreen) return;
  phoneScreen.addEventListener("mousemove", function (e) {
    const r = this.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    const cx = r.width / 2,
      cy = r.height / 2;
    const rx = (y - cy) / 20,
      ry = (cx - x) / 20;
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
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
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

/* ============ Busca no hero ============ */
function initSearchBar() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const grid = document.getElementById("servicesGrid");
  if (!form || !input || !grid) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim().toLowerCase();
    const cards = grid.querySelectorAll(".service-card");
    let any = false;

    cards.forEach((c) => {
      const tags = (c.getAttribute("data-tags") || "").toLowerCase();
      const title = (c.querySelector("h3")?.textContent || "").toLowerCase();
      const match = !q || tags.includes(q) || title.includes(q);
      c.style.display = match ? "" : "none";
      c.classList.toggle("is-dim", q && !match);
      if (match) any = true;
    });

    document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!any) {
      setTimeout(() => cards.forEach((c) => ((c.style.display = ""), c.classList.remove("is-dim"))), 2400);
    }
  });
}

/* ============ Agenda (D+1 e horários por hora) ============ */
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
    step2: [f.date, f.time], // agenda
    step3: [f.description],  // detalhe
    step4: [f.name, f.phone, f.barrio, f.calle, f.numero], // contato/endereço
  };

  function setEnabled(els, enable) {
    // aplica em microtask para evitar "estado travado" em alguns mobiles
    setTimeout(() => {
      els.forEach((el) => {
        if (!el) return;
        el.disabled = !enable;
        el.closest(".form-group")?.classList.toggle("is-disabled", !enable);
      });
    }, 0);
  }

  function isValidService() {
    return !!f.service.value;
  }
  function isValidDateTime() {
    const okDate = f.date.value && (!f.date.min || f.date.value >= f.date.min);
    const okTime = !!f.time.value;
    return okDate && okTime;
  }
  function isValidPhone(v) {
    return (v || "").replace(/\D/g, "").length >= 7;
  }
  function isValidAddress() {
    return f.barrio.value.trim() && f.calle.value.trim() && f.numero.value.trim();
  }

  function update() {
    // Step 1 -> Step 2
    const sOk = isValidService();
    setEnabled(groups.step2, sOk);

    // Step 2 -> Step 3 e 4
    const step2ok = sOk && isValidDateTime();
    setEnabled(groups.step3, step2ok);
    setEnabled(groups.step4, step2ok);

    // Botão final
    const allOk =
      sOk &&
      step2ok &&
      f.name.value.trim() &&
      isValidPhone(f.phone.value) &&
      isValidAddress();
    f.submit.disabled = !allOk;
    f.submit.classList.toggle("is-disabled", !allOk);
  }

  // UX: focos automáticos
  f.service?.addEventListener("change", () => {
    update();
    if (isValidService()) setTimeout(() => f.date?.focus(), 60);
  });
  f.date?.addEventListener("change", () => {
    update();
    if (isValidDateTime()) setTimeout(() => f.description?.focus(), 60);
  });
  f.time?.addEventListener("change", update);
  f.description?.addEventListener("input", debounce(update, 120));
  f.name?.addEventListener("input", debounce(update, 120));
  f.phone?.addEventListener("input", debounce(update, 120));
  f.barrio?.addEventListener("input", debounce(update, 120));
  f.calle?.addEventListener("input", debounce(update, 120));
  f.numero?.addEventListener("input", debounce(update, 120));

  // Estado inicial / revalidação
  update();
  if (forceRevalidate) {
    // força repaint em iOS para refletir enabled/disabled
    requestAnimationFrame(update);
  }
}
