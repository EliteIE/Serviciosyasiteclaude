/**
 * Servicios Ya - JavaScript Principal
 * Version: 1.0.0
 */

// ========================================
// Inicialização
// ========================================

document.addEventListener('DOMContentLoaded', function() {
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
});

// ========================================
// Preloader
// ========================================

function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    });
}

// ========================================
// Header Scroll Effect
// ========================================

function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/Show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// Mobile Menu
// ========================================

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// Smooth Scroll
// ========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
}

// ========================================
// Service Cards Animation
// ========================================

function initServiceCards() {
    const cards = document.querySelectorAll('.mini-card');
    let currentIndex = 0;
    
    function rotateCards() {
        cards.forEach(card => card.classList.remove('active'));
        cards[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % cards.length;
    }
    
    // Auto rotate every 2 seconds
    setInterval(rotateCards, 2000);
    
    // Click to select
    cards.forEach((card, index) => {
        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentIndex = index;
        });
    });
}

// ========================================
// Pricing Toggle
// ========================================

function initPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    const singlePricing = document.querySelector('.pricing-single');
    const plansPricing = document.querySelector('.pricing-plans');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    
    if (toggle) {
        toggle.addEventListener('change', function() {
            if (this.checked) {
                singlePricing.classList.remove('active');
                plansPricing.classList.add('active');
                toggleLabels[0].classList.remove('active');
                toggleLabels[1].classList.add('active');
            } else {
                singlePricing.classList.add('active');
                plansPricing.classList.remove('active');
                toggleLabels[0].classList.add('active');
                toggleLabels[1].classList.remove('active');
            }
        });
    }
}

// ========================================
// Modal Functions
// ========================================

function initModal() {
    const modal = document.getElementById('serviceModal');
    const closeBtn = document.querySelector('.modal-close');
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServiceModal();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServiceModal();
        }
    });
}

function openServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function selectService(service) {
    openServiceModal();
    const serviceType = document.getElementById('serviceType');
    if (serviceType) {
        serviceType.value = service;
    }
}

// ========================================
// Form Handling
// ========================================

function initForm() {
    const form = document.getElementById('serviceForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                service: document.getElementById('serviceType').value,
                urgency: document.querySelector('input[name="urgency"]:checked').value,
                description: document.getElementById('description').value,
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };
            
            // Show success animation
            showSuccessMessage(formData);
            
            // Reset form
            form.reset();
            
            // Close modal after delay
            setTimeout(() => {
                closeServiceModal();
            }, 3000);
        });
    }
}

function showSuccessMessage(data) {
    const modal = document.querySelector('.modal-content');
    
    // Create success message
    const successHTML = `
        <div class="success-message" style="text-align: center; padding: 40px;">
            <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
            <h2 style="color: #10B981; margin-bottom: 15px;">¡Solicitud Enviada!</h2>
            <p style="color: #6B7280;">Tu profesional está en camino.</p>
            <p style="color: #6B7280;">Te contactaremos en menos de 5 minutos.</p>
            <div style="margin-top: 30px; padding: 20px; background: #F3F4F6; border-radius: 10px;">
                <p style="margin: 5px 0;"><strong>Servicio:</strong> ${data.service}</p>
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${data.name}</p>
                <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${data.phone}</p>
            </div>
        </div>
    `;
    
    modal.innerHTML = successHTML;
}

// ========================================
// Initialize AOS (Animate On Scroll)
// ========================================

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// ========================================
// Phone Mockup Interactive
// ========================================

function initPhoneMockup() {
    const phoneScreen = document.querySelector('.phone-screen');
    
    if (phoneScreen) {
        // Add interactive hover effect
        phoneScreen.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        phoneScreen.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
}

// ========================================
// Video Demo Player
// ========================================

function playDemoVideo() {
    // Create video modal
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
        <div class="video-container">
            <button class="video-close" onclick="closeVideoModal()">×</button>
            <video controls autoplay>
                <source src="demo-video.mp4" type="video/mp4">
                Tu navegador no soporta el video.
            </video>
        </div>
    `;
    
    // Add styles
    videoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    document.body.appendChild(videoModal);
}

function closeVideoModal() {
    const videoModal = document.querySelector('.video-modal');
    if (videoModal) {
        videoModal.remove();
    }
}

// ========================================
// Intersection Observer for Nav Active State
// ========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '-100px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// ========================================
// Typing Effect for Hero Title
// ========================================

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========================================
// Number Counter Animation
// ========================================

function animateNumbers() {
    const numbers = document.querySelectorAll('[data-number]');
    
    numbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-number'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// ========================================
// Parallax Effect
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ========================================
// Lazy Loading Images
// ========================================

const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// Service Worker Registration
// ========================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('ServiceWorker registered'))
        .catch(error => console.log('ServiceWorker registration failed:', error));
}

// ========================================
// Utilities
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Export Functions for Global Use
// ========================================

window.ServiciosYa = {
    openServiceModal,
    closeServiceModal,
    selectService,
    playDemoVideo,
    closeVideoModal
};