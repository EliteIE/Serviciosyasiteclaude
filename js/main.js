/**
 * Servicios Ya - JavaScript Principal (GitHub Pages safe)
 * v1.2.0
 * - Busca de serviços no hero (filtra e rola para a seção)
 * - Modal de agendamento com data mínima = amanhã (24h à frente)
 * - Horários de hora em hora (08:00–20:00)
 * - Envio para WhatsApp incluindo dia/hora e aviso de cancelamento 24h
 */

document.addEventListener('DOMContentLoaded', function () {
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
  initScheduling(); // aplica se inputs já estiverem no DOM
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

/* ============ Pricing Toggle ============ */
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
  const serviceType = document.getElementById('serviceType');
  if (preset && serviceType) serviceType.value = preset;
  modal.classList.add('show'); // alinhado ao CSS
  document.body.style.overflow = 'hidden';

  // Garante que inputs de agenda estejam corretos ao abrir
  initScheduling();
}

function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;
  modal.classList.remove('show'); // alinhado ao CSS
  document.body.style.overflow = '';
}

function selectService(service) {
  openServiceModal(service);
}

/* ============ Form Handling (inclui agenda) ============ */
function initForm() {
  const form = document.getElementById('serviceForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
      service: document.getElementById('serviceType')?.value || '',
      urgency: (form.querySelector('input[name="urgency"]:checked') || {}).value || '',
      date: document.getElementById('scheduleDate')?.value || '',
      time: document.getElementById('scheduleTime')?.value || '',
      description: document.getElementById('description')?.value?.trim() || '',
      name: document.getElementById('name')?.value?.trim() || '',
      phone: document.getElementById('phone')?.value?.trim() || '',
      address: document.getElementById('address')?.value?.trim() || ''
    };

    // Texto para WhatsApp com política 24h
    const txt = encodeURIComponent(
      `Hola! Quiero solicitar un servicio:\n` +
      `• Tipo: ${data.service}\n` +
      `• Urgencia: ${data.urgency}\n` +
      (data.date || data.time ? `• Día/Hora: ${data.date} ${data.time}\n` : '') +
      `• Descripción: ${data.description}\n` +
      `• Nombre: ${data.name}\n` +
      `• Teléfono: ${data.phone}\n` +
      `• Dirección: ${data.address}\n` +
      `Nota: Acepto la política de cancelación sin costo hasta 24h antes.`
    );
    window.open(`https://wa.me/543804123456?text=${txt}`, '_blank');
    closeServiceModal();
    form.reset();
  });
}

/* ============ AOS ============ */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 100 });
  }
}

/* ============ Phone Mockup ============ */
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

/* ============ Utils ============ */
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

/* ============ NOVO: Busca de serviços no hero ============ */
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
      const tags = (c.getAttribute('data-tags')||'').toLowerCase();
      const title = (c.querySelector('h3')?.textContent||'').toLowerCase();
      const match = !q || tags.includes(q) || title.includes(q);
      c.style.display = match ? '' : 'none';
      c.classList.toggle('is-dim', q && !match);
      if(match) any = true;
    });

    // rola até a lista
    document.getElementById('servicios')?.scrollIntoView({behavior:'smooth', block:'start'});

    // Se nada for encontrado, restaura após alguns segundos
    if(!any){
      setTimeout(()=>cards.forEach(c=>{
        c.style.display=''; c.classList.remove('is-dim');
      }), 2400);
    }
  });
}

/* ============ NOVO: Agenda (D+1 e horários por hora) ============ */
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

  // Gera horários 08:00–20:00 de hora em hora
  timeSelect.innerHTML = '';
  for(let h=8; h<=20; h++){
    const label = `${String(h).padStart(2,'0')}:00`;
    const opt = document.createElement('option');
    opt.value = label; opt.textContent = label;
    timeSelect.appendChild(opt);
  }
}

/* Export global (caso precise no HTML) */
window.ServiciosYa = { openServiceModal, closeServiceModal, selectService };
