/**
 * Servicios Ya - JavaScript Principal (GitHub Pages safe)
 * v1.3.0
 * - Busca de serviços no hero (filtra e rola para a seção)
 * - Modal guiado: cada passo libera o próximo
 * - Data mínima = amanhã (24h à frente) + horários 08:00–20:00 (de hora em hora)
 * - Envio por e-mail: contacto@serviciosyalr.com (assunto + corpo organizados)
 */

document.addEventListener('DOMContentLoaded', function () {
  initPreloader();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initServiceCards();
  initPricingToggle();
  initModal();
  initForm();           // inclui fluxo guiado
  initAOS();
  initPhoneMockup();

  // Novidades
  initSearchBar();
  initScheduling();     // aplica min/horários mesmo se inputs estiverem desabilitados
});

/* ============ Preloader ============ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', function () {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }, 500);
  });
}

/* ============ Header Scroll Effect ============ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  });
}

/* ============ Mobile Menu ============ */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* ============ Smooth Scroll ============ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });

      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* ============ Service Cards Animation ============ */
function initServiceCards() {
  const cards = document.querySelectorAll('.mini-card, .service-card');
  if (!cards.length) return;
  let currentIndex = 0;

  function rotateCards() {
    cards.forEach(card => card.classList.remove('active'));
    if (cards[currentIndex]) cards[currentIndex].classList.add('active');
    currentIndex = (currentIndex + 1) % cards.length;
  }
  setInterval(rotateCards, 2000);

  cards.forEach((card, index) => {
    card.addEventListener('click', function () {
      cards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      currentIndex = index;
    });
  });
}

/* ============ Pricing Toggle (se existir) ============ */
function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  if (!toggle) return;

  const singlePricing = document.querySelector('.pricing-single');
  const plansPricing = document.querySelector('.pricing-plans');
  const toggleLabels = document.querySelectorAll('.toggle-label');

  toggle.addEventListener('change', function () {
    if (this.checked) {
      singlePricing?.classList.remove('active');
      plansPricing?.classList.add('active');
      toggleLabels[0]?.classList.remove('active');
      toggleLabels[1]?.classList.add('active');
    } else {
      singlePricing?.classList.add('active');
      plansPricing?.classList.remove('active');
      toggleLabels[0]?.classList.add('active');
      toggleLabels[1]?.classList.remove('active');
    }
  });
}

/* ============ Modal ============ */
function initModal() {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;

  window.addEventListener('click', function (e) {
    if (e.target === modal) closeServiceModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeServiceModal();
  });
}

function openServiceModal(preset) {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;

  // reset básico para manter o fluxo guiado sempre limpo
  const form = document.getElementById('serviceForm');
  if (form) {
    form.reset();
    prepareGuidedState(); // recoloca desabilitados
  }

  const serviceType = document.getElementById('serviceType');
  if (preset && serviceType) serviceType.value = preset;

  initScheduling(); // garante min de data e horários
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function selectService(service) {
  openServiceModal(service);
}

/* ============ Form Handling + Fluxo Guiado ============ */
function initForm() {
  const form = document.getElementById('serviceForm');
  if (!form) return;

  // prepara estado inicial (tudo desabilitado menos "tipo de serviço")
  prepareGuidedState();
  wireGuidedFlow();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
      service: val('serviceType'),
      date: val('scheduleDate'),
      time: val('scheduleTime'),
      description: val('description').trim(),
      name: val('name').trim(),
      phone: val('phone').trim(),
      barrio: val('barrio').trim(),
      calle:  val('calle').trim(),
      numero: val('numero').trim()
    };

    // Monta e abre e-mail (mailto) — funciona bem no GitHub Pages
    const subject = `[Solicitud] ${data.service} - ${formatDMY(data.date)} ${data.time}`;
    const bodyLines = [
      `Tipo de servicio: ${data.service}`,
      `Día: ${formatDMY(data.date)}`,
      `Horario: ${data.time}`,
      `Descripción: ${data.description || '-'}`,
      `Nombre: ${data.name}`,
      `Teléfono: ${data.phone}`,
      `Dirección: Barrio ${data.barrio}, Calle ${data.calle}, N° ${data.numero}, La Rioja`,
      ``,
      `Política: Cancelación sin costo hasta 24h antes del horario reservado.`
    ];
    const mailto = `mailto:contacto@serviciosyalr.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;

    closeServiceModal();
  });
}

/* Helpers do form guiado */
function prepareGuidedState() {
  const controls = [
    'scheduleDate','scheduleTime','description',
    'name','phone','barrio','calle','numero','submitBtn'
  ];
  controls.forEach(id => disableCtl(id, true));
}

function wireGuidedFlow() {
  const serviceType  = el('serviceType');
  const scheduleDate = el('scheduleDate');
  const scheduleTime = el('scheduleTime');
  const description  = el('description');
  const name         = el('name');
  const phone        = el('phone');
  const barrio       = el('barrio');
  const calle        = el('calle');
  const numero       = el('numero');
  const submitBtn    = el('submitBtn');

  if (!serviceType) return;

  serviceType.addEventListener('change', () => {
    const ok = !!serviceType.value;
    disableCtl('scheduleDate', !ok);
    disableCtl('scheduleTime', !ok);
    if (ok) initScheduling();
  });

  scheduleDate?.addEventListener('change', () => {
    const ok = !!scheduleDate.value;
    disableCtl('scheduleTime', !ok);
  });

  scheduleTime?.addEventListener('change', () => {
    const ok = !!scheduleTime.value;
    disableCtl('description', !ok);
  });

  description?.addEventListener('input', () => {
    const ok = (description.value || '').trim().length >= 6;
    disableCtl('name', !ok);
    disableCtl('phone', !ok);
  });

  const namePhoneCheck = () => {
    const ok = (name.value.trim().length >= 2) && validPhone(phone.value);
    disableCtl('barrio', !ok);
    disableCtl('calle',  !ok);
    disableCtl('numero', !ok);
  };
  name?.addEventListener('input', namePhoneCheck);
  phone?.addEventListener('input', namePhoneCheck);

  const addressCheck = () => {
    const ok =
      barrio.value.trim().length >= 2 &&
      calle.value.trim().length  >= 2 &&
      /^[0-9]{1,6}$/.test((numero.value || '').trim());
    disableCtl('submitBtn', !ok);
  };
  barrio?.addEventListener('input', addressCheck);
  calle?.addEventListener('input', addressCheck);
  numero?.addEventListener('input', addressCheck);
}

/* ============ AOS ============ */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 100 });
  }
}

/* ============ Phone Mockup (se existir) ============ */
function initPhoneMockup() {
  const phoneScreen = document.querySelector('.phone-screen');
  if (!phoneScreen) return;
  phoneScreen.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const centerX = rect.width / 2, centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20, rotateY = (centerX - x) / 20;
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  phoneScreen.addEventListener('mouseleave', function () {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
}

/* ============ Seções ativas no menu (opcional) ============ */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5, rootMargin: '-100px 0px -100px 0px' });
  sections.forEach(section => observer.observe(section));
})();

/* ============ Lazy Loading simples ============ */
(function () {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => obs.observe(img));
})();

/* ============ Service Worker (opcional) ============ */
if ('serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* ignora */ });
  } catch (e) { /* ignora */ }
}

/* ============ Utils genéricas ============ */
function debounce(func, wait) {
  let timeout; return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ============ Busca de serviços no hero ============ */
function initSearchBar(){
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const grid  = document.getElementById('servicesGrid');
  if(!form || !input || !grid) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = input.value.trim().toLowerCase();
    const cards = grid.querySelectorAll('.service-card');
    let any = false;

    cards.forEach(c=>{
      const tags  = (c.getAttribute('data-tags')||'').toLowerCase();
      const title = (c.querySelector('h3')?.textContent||'').toLowerCase();
      const match = !q || tags.includes(q) || title.includes(q);
      c.style.display = match ? '' : 'none';
      c.classList.toggle('is-dim', q && !match);
      if(match) any = true;
    });

    document.getElementById('servicios')?.scrollIntoView({behavior:'smooth', block:'start'});

    if(!any){
      setTimeout(()=>cards.forEach(c=>{
        c.style.display=''; c.classList.remove('is-dim');
      }), 2400);
    }
  });
}

/* ============ Agenda (D+1 e horários por hora) ============ */
function initScheduling(){
  const dateInput = document.getElementById('scheduleDate');
  const timeSelect = document.getElementById('scheduleTime');
  if(!dateInput || !timeSelect) return;

  // Data mínima = amanhã (24h à frente)
  const now = new Date();
  const dPlus1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const toYMD = (d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  dateInput.min = toYMD(dPlus1);
  if(!dateInput.value || dateInput.value < dateInput.min) dateInput.value = dateInput.min;

  // Gera horários 08:00–20:00 (hora em hora)
  timeSelect.innerHTML = '';
  for(let h=8; h<=20; h++){
    const label = `${String(h).padStart(2,'0')}:00`;
    const opt = document.createElement('option');
    opt.value = label; opt.textContent = label;
    timeSelect.appendChild(opt);
  }
}

/* ============ Pequenos utilitários de DOM/validação ============ */
function el(id){ return document.getElementById(id); }
function val(id){ return (el(id)?.value ?? ''); }
function disableCtl(id, disable){
  const ctl = el(id);
  if(!ctl) return;
  ctl.disabled = !!disable;
  ctl.closest('.form-group')?.classList.toggle('is-disabled', !!disable);
}
function validPhone(p){
  const digits = (p || '').replace(/\D/g,'');
  return digits.length >= 8 && digits.length <= 15;
}
function formatDMY(iso){
  if(!iso) return '';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/* Export global (caso precise no HTML) */
window.ServiciosYa = { openServiceModal, closeServiceModal, selectService };
