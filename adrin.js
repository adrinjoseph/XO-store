/* ============================================================
   XO STORE — adrin.js
   All interactivity: loader, cursor, nav, cart, filters,
   scroll reveals, back-to-top, contact form, Bootstrap hooks
   ============================================================ */

'use strict';

/* ── CART STATE ─────────────────────────────────────────────── */
/* ============================================================
   XO STORE - CART SYSTEM
============================================================ */

"use strict";

let cart = JSON.parse(localStorage.getItem("xo-cart")) || [];

/* ---------------- SAVE CART ---------------- */

function saveCart() {
    localStorage.setItem("xo-cart", JSON.stringify(cart));
}

/* ---------------- CART BADGE ---------------- */

function updateCartBadge() {

    const badge = document.getElementById("cartCount");

    if (!badge) return;

    const count = cart.reduce((sum, item) => {

        return sum + item.qty;

    }, 0);

    badge.textContent = count;

    badge.animate(

        [
            { transform: "scale(1)" },
            { transform: "scale(1.25)" },
            { transform: "scale(1)" }
        ],

        {
            duration: 300
        }

    );

}

/* ---------------- CART SIDEBAR ---------------- */

function renderCart() {

    const container =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("cartTotal");

    if (!container || !totalElement) return;

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML =

            `
            <p class="text-secondary">
                Cart is empty
            </p>
            `;

        totalElement.textContent = "0";

        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        const div = document.createElement("div");

        div.className =
            "d-flex justify-content-between align-items-center mb-3 border-bottom pb-2";

        div.innerHTML =

            `
            <div>

                <strong>${item.name}</strong>

                <br>

                <small>

                    $${item.price}

                    ×

                    ${item.qty}

                </small>

            </div>

            <button
                class="btn btn-sm btn-danger"
                onclick="removeCartItem(${index})">

                Remove

            </button>
            `;

        container.appendChild(div);

    });

    totalElement.textContent = total.toFixed(2);

}

/* ---------------- ADD TO CART ---------------- */

function addToCart(btn) {

    const name =
        btn.dataset.name;

    const price =
        parseFloat(btn.dataset.price);

    if (!name || isNaN(price)) return;

    const existing =
        cart.find(item => item.name === name);

    if (existing) {

        existing.qty++;

    }

    else {

        cart.push({

            name,

            price,

            qty:1

        });

    }

    saveCart();

    updateCartBadge();

    renderCart();

    showToast(`${name} added to cart`);

    animateButton(btn);

}

/* ---------------- REMOVE ITEM ---------------- */

function removeCartItem(index) {

    cart.splice(index,1);

    saveCart();

    updateCartBadge();

    renderCart();
}

/* ---------------- CHECKOUT ---------------- */

function checkout() {

    if(cart.length===0){

        alert("Cart is empty.");

        return;

    }

    alert("Thank you for shopping with XO Store!");

    cart=[];

    saveCart();

    updateCartBadge();

    renderCart();


}

/* ---------------- BUTTON ANIMATION ---------------- */

function animateButton(btn){

    const original=

        btn.innerHTML;

    btn.innerHTML="✓";

    btn.style.background="#27ae60";

    btn.style.color="#fff";

    setTimeout(()=>{

        btn.innerHTML=original;

        btn.style.background="";

        btn.style.color="";

    },1000);

}

/* ---------------- TOAST ---------------- */

let toastTimeout;

function showToast(message){

    const toast=

        document.getElementById("cartToast");

    const text=

        document.getElementById("cartToastMsg");

    if(!toast) return;

    text.textContent=message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout=setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

function animateBtn(btn) {
  btn.classList.add('btn-added');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i>';
  btn.style.background    = '#27ae60';
  btn.style.borderColor   = '#27ae60';
  btn.style.color         = '#fff';
  setTimeout(() => {
    btn.innerHTML          = original;
    btn.style.background   = '';
    btn.style.borderColor  = '';
    btn.style.color        = '';
    btn.classList.remove('btn-added');
  }, 1200);
}

/* ── TOAST ──────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const toast   = document.getElementById('cartToast');
  const msgEl   = document.getElementById('cartToastMsg');
  if (!toast) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── LOADER ─────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('siteLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  });
  document.body.style.overflow = 'hidden';
}

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Hide on mobile
  if ('ontouchstart' in window) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover expand on interactive elements
  const hoverEls = 'a, button, input, textarea, select, [data-hover]';
  document.addEventListener('mouseover', e => {
    if (e.target.matches(hoverEls) || e.target.closest(hoverEls)) {
      ring.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches(hoverEls) || e.target.closest(hoverEls)) {
      ring.classList.remove('hovered');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ── HEADER SCROLL ──────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── ACTIVE NAV LINK (scroll spy) ───────────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ── MOBILE MENU ────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const toggle = () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  mobileMenu.querySelectorAll('.mobile-nav-item').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  mobileMenu.addEventListener('click', e => {
    if (e.target === mobileMenu) toggle();
  });
}

/* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
function initScrollReveal() {
  // Add .reveal class to target elements automatically
  const targets = [
    '.about-card',
    '.product-card',
    '.album-card',
    '.gallery-item',
    '.contact-detail',
    '.footer-links-group',
    '.about-text',
    '.contact-info',
    '.contact-form-wrap',
    '.newsletter-inner'
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.06}s`;
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── PRODUCT FILTER TABS ────────────────────────────────────── */
function initFilterTabs() {
  const tabs     = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      products.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = `opacity 0.3s ${i * 0.04}s, transform 0.3s ${i * 0.04}s`;

        if (match) {
          card.style.display   = '';
          // Trigger reflow for animation
          requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => { card.style.display = 'none'; }, 320);
        }
      });
    });
  });
}

/* ── BACK TO TOP ────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── CONTACT FORM ───────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn  = document.getElementById('submitBtn');
    const inputs = form.querySelectorAll('.input-xo');
    let valid = true;

    inputs.forEach(input => {
      input.style.borderColor = '';
      if (input.hasAttribute('required') && !input.value.trim()) {
        input.style.borderColor = '#e74c3c';
        valid = false;
      }
    });

    if (!valid) {
      shakeElement(form.querySelector('[style*="e74c3c"]'));
      return;
    }

    // Simulate send
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML      = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';
      btn.disabled       = true;
      btn.style.opacity  = '0.7';

      setTimeout(() => {
        btn.innerHTML     = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
        btn.style.background = '#27ae60';
        btn.style.opacity = '1';
        form.reset();

        setTimeout(() => {
          btn.innerHTML         = originalHTML;
          btn.style.background  = '';
          btn.disabled          = false;
        }, 3000);
      }, 1600);
    }
  });
}

function shakeElement(el) {
  if (!el) return;
  el.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-8px)' },
    { transform: 'translateX(8px)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(0)' }
  ], { duration: 400, easing: 'ease-out' });
}

/* ── NEWSLETTER FORM ────────────────────────────────────────── */
function initNewsletter() {
  const btn   = document.querySelector('.newsletter-btn');
  const input = document.querySelector('.newsletter-input');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      input.style.borderColor = '#e74c3c';
      shakeElement(input);
      setTimeout(() => input.style.borderColor = '', 1000);
      return;
    }

    const orig = btn.textContent;
    btn.textContent  = 'Done ✓';
    btn.style.background = '#27ae60';
    input.value      = '';
    showToast('You\'re now part of the XO family!');

    setTimeout(() => {
      btn.textContent      = orig;
      btn.style.background = '';
    }, 3000);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
}

/* ── PARALLAX HERO BG TEXT ──────────────────────────────────── */
function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bgText.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}

/* ── ALBUM CARD TILT ────────────────────────────────────────── */
function initAlbumTilt() {
  document.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const rotX   = -(y / rect.height) * 10;
      const rotY   = (x / rect.width)  * 10;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── BOOTSTRAP TOOLTIP INIT ─────────────────────────────────── */
function initBootstrapTooltips() {
  if (typeof bootstrap === 'undefined') return;
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el, { trigger: 'hover' });
  });
}

/* ── BOOTSTRAP OFFCANVAS (if used) ──────────────────────────── */
function initBootstrapOffcanvas() {
  if (typeof bootstrap === 'undefined') return;
  document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(el => {
    el.addEventListener('click', () => {
      const target = document.querySelector(el.dataset.bsTarget);
      if (target) new bootstrap.Offcanvas(target).toggle();
    });
  });
}

/* ── TYPING EFFECT (hero eyebrow) ───────────────────────────── */
function initTypingEffect() {
  const el = document.querySelector('.hero-eyebrow');
  if (!el) return;

  const phrases = ['THE WEEKND', 'XO RECORDS', 'ABEL TESFAYE', 'THE WEEKND'];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase  = phrases[pi];
    el.textContent = phrase.substring(0, ci) + (ci < phrase.length ? '|' : '');

    if (!deleting && ci < phrase.length) {
      ci++;
      setTimeout(type, 90);
    } else if (!deleting && ci === phrase.length) {
      deleting = true;
      setTimeout(type, 2000);
    } else if (deleting && ci > 0) {
      ci--;
      setTimeout(type, 45);
    } else {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(type, 400);
    }
  }

  // Start after loader is hidden
  setTimeout(type, 2200);
}

/* ── MARQUEE PAUSE ON HOVER ─────────────────────────────────── */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const strip = track.closest('.marquee-strip');
  if (!strip) return;

  strip.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  strip.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

/* ── CART ICON SHAKE on badge update ────────────────────────── */
function initCartShake() {
  const cartBtn = document.querySelector('.cart-btn');
  if (!cartBtn) return;

  const origAddToCart = window.addToCart;
  window.addToCart = function(btn) {
    origAddToCart(btn);
    cartBtn.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-15deg)' },
      { transform: 'rotate(15deg)' },
      { transform: 'rotate(-10deg)' },
      { transform: 'rotate(0deg)' }
    ], { duration: 500, easing: 'ease-out' });
  };
}

/* ── KEYBOARD ACCESSIBILITY ─────────────────────────────────── */
function initKeyboardNav() {
  // Close mobile menu on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const mobileMenu = document.getElementById('mobileMenu');
      const hamburger  = document.getElementById('hamburger');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });
}

/* ── SECTION COUNTER ANIMATION ──────────────────────────────── */
function initCounters() {
  const counters = [
    { selector: '.stat-num', targets: ['11+', '200M+', 'XO'] }
  ];

  function animateNumber(el, target) {
    const isNumber = /^\d/.test(target);
    if (!isNumber) return;

    const end  = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[\d]/g, '');
    let current = 0;
    const step  = Math.ceil(end / 40);

    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      el.textContent = current + suffix;
      if (current >= end) clearInterval(timer);
    }, 35);
  }

  const statEls = document.querySelectorAll('.stat-num');
  if (!statEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target, entry.target.textContent);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
}

/* ── INIT ALL ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  updateCartBadge();

  renderCart();

  initLoader();

  initCursor();

  initHeader();

  initScrollSpy();

  initMobileMenu();

  initSmoothScroll();

  initScrollReveal();

  initFilterTabs();

  initBackToTop();

  initContactForm();

  initNewsletter();

  initParallax();

  initAlbumTilt();

  initBootstrapTooltips();

  initBootstrapOffcanvas();

  initTypingEffect();

  initMarquee();

  initCartShake();

  initKeyboardNav();

  initCounters();

});