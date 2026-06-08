'use strict';

const PRODUCTS = [
  { name:'XO Hoodie',        price:85,  category:'hoodie',      img:'hoodie.jpg',  badge:'Bestseller', badgeClass:'' },
  { name:'XO Tee',           price:45,  category:'tee',         img:'tee.jpg',     badge:'New',        badgeClass:'new-badge' },
  { name:'XO Cap',           price:35,  category:'accessories', img:'cap.jpg',     badge:null },
  { name:'XO Varsity Jacket',price:220, category:'hoodie',      img:'varsity.jpg', badge:'Limited',    badgeClass:'limited-badge' },
  { name:'XO Chain Necklace',price:60,  category:'accessories', img:'chain.jpg',   badge:null },
  { name:'XO Joggers',       price:75,  category:'tee',         img:'joggers.jpg', badge:null },
];

const ALBUMS = [
  { name:'House of Balloons',          year:2011, img:'hob.jpg',        abbr:'HOB' },
  { name:'Thursday',                   year:2011, img:'thursday.jpg',   abbr:'THU' },
  { name:'Echoes of Silence',          year:2011, img:'eos.jpg',        abbr:'EOS' },
  { name:'Trilogy',                    year:2012, img:'trilogy.jpg',    abbr:'TRI' },
  { name:'Kiss Land',                  year:2013, img:'kissland.jpg',   abbr:'KL'  },
  { name:'Beauty Behind the Madness',  year:2015, img:'bbtm.jpg',       abbr:'BBTM'},
  { name:'Starboy',                    year:2016, img:'starboy.jpg',    abbr:'SB'  },
  { name:'My Dear Melancholy,',        year:2018, img:'mdm.jpg',        abbr:'MDM' },
  { name:'After Hours',                year:2020, img:'afterhours.jpg', abbr:'AH',  featured:'Icon Era' },
  { name:'Dawn FM',                    year:2022, img:'dawnfm.jpg',     abbr:'DFM' },
  { name:'Hurry Up Tomorrow',          year:2025, img:'hut.jpg',        abbr:'HUT', featured:'Latest' },
];

let cart = JSON.parse(localStorage.getItem('xo-cart')) || [];

function saveCart()  { localStorage.setItem('xo-cart', JSON.stringify(cart)); }

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
  badge.animate(
    [{ transform:'scale(1)' }, { transform:'scale(1.3)' }, { transform:'scale(1)' }],
    { duration: 300 }
  );
}

function renderCart() {
  const container   = document.getElementById('cartItems');
  const totalEl     = document.getElementById('cartTotal');
  if (!container || !totalEl) return;

  if (!cart.length) {
    container.innerHTML = '<p class="text-secondary">Cart is empty</p>';
    totalEl.textContent = '0';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, i) => {
    total += item.price * item.qty;
    return `<div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <div><strong>${item.name}</strong><br><small>$${item.price} × ${item.qty}</small></div>
      <button class="btn btn-sm btn-danger" data-remove="${i}">Remove</button>
    </div>`;
  }).join('');
  totalEl.textContent = total.toFixed(2);
}

function addToCart(name, price, triggerEl) {
  if (!name || isNaN(price)) return;
  const existing = cart.find(i => i.name === name);
  existing ? existing.qty++ : cart.push({ name, price, qty: 1 });
  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`${name} added to cart`);
  if (triggerEl) animateButton(triggerEl);
  shakeCartIcon();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCart();
}

function checkout() {
  if (!cart.length) { alert('Cart is empty.'); return; }
  alert('Thank you for shopping with XO Store!');
  cart = [];
  saveCart();
  updateCartBadge();
  renderCart();
}
function animateButton(btn) {
  const original = btn.innerHTML;
  btn.innerHTML         = '<i class="fas fa-check"></i>';
  btn.style.cssText    += ';background:#27ae60;border-color:#27ae60;color:#fff';
  setTimeout(() => {
    btn.innerHTML        = original;
    btn.style.background = '';
    btn.style.borderColor= '';
    btn.style.color      = '';
  }, 1200);
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('cartToast');
  const msgEl = document.getElementById('cartToastMsg');
  if (!toast) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function shakeElement(el) {
  if (!el) return;
  el.animate([
    { transform:'translateX(0)' }, { transform:'translateX(-8px)' },
    { transform:'translateX(8px)' }, { transform:'translateX(-6px)' },
    { transform:'translateX(6px)' }, { transform:'translateX(0)' }
  ], { duration: 400, easing: 'ease-out' });
}

function shakeCartIcon() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
  btn.animate([
    { transform:'rotate(0deg)' }, { transform:'rotate(-15deg)' },
    { transform:'rotate(15deg)' }, { transform:'rotate(-10deg)' },
    { transform:'rotate(0deg)' }
  ], { duration: 500, easing: 'ease-out' });
}
function buildProductCard(p) {
  const badge = p.badge
    ? `<span class="product-badge ${p.badgeClass || ''}">${p.badge}</span>` : '';
  return `
  <div class="product-card" data-category="${p.category}">
    <div class="product-img-wrap">
      <img src="${p.img}" alt="${p.name}" class="product-img">
      <div class="product-overlay">
        <button class="quick-add js-add-cart" data-name="${p.name}" data-price="${p.price}">
          <i class="fas fa-plus"></i> Quick Add
        </button>
      </div>
      ${badge}
    </div>
    <div class="product-info">
      <h3 class="product-name">${p.name}</h3>
      <div class="product-footer">
        <span class="product-price">$${p.price}</span>
        <button class="add-cart-btn js-add-cart" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

function buildAlbumCard(a) {
  const vinylName = `${a.name} Vinyl`;
  const featured  = a.featured
    ? `<span class="album-featured-tag">${a.featured}</span>` : '';
  return `
  <div class="album-card${a.featured ? ' featured-album' : ''}">
    <div class="album-art">
      <img src="${a.img}" alt="${a.name}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="album-art-fallback" style="display:none"><span>${a.abbr}</span></div>
      <div class="album-hover-overlay">
        <button class="album-play-btn" aria-label="Preview"><i class="fas fa-play"></i></button>
        <button class="album-cart-btn js-add-cart" data-name="${vinylName}" data-price="150"
                aria-label="Add to cart"><i class="fas fa-shopping-bag"></i></button>
      </div>
      ${featured}
    </div>
    <div class="album-info">
      <h3>${a.name}</h3>
      <span class="album-year">${a.year}</span>
      <span class="album-price">$150</span>
    </div>
  </div>`;
}

function renderProducts() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(buildProductCard).join('');
}

function renderAlbums() {
  const grid = document.getElementById('albumGrid');
  if (!grid) return;
  grid.innerHTML = ALBUMS.map(buildAlbumCard).join('');
}

function initEventDelegation() {
  // Cart add buttons (products + albums)
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('.js-add-cart');
    if (btn) {
      addToCart(btn.dataset.name, parseFloat(btn.dataset.price), btn);
      return;
    }

    // Cart remove buttons
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      removeCartItem(parseInt(removeBtn.dataset.remove));
      return;
    }

    // Checkout
    if (e.target.closest('#checkoutBtn')) {
      checkout();
    }
  });

  // Cart sidebar – delegate to offcanvas body for remove/checkout
  const cartSidebar = document.getElementById('cartSidebar');
  if (cartSidebar) {
    cartSidebar.querySelector('button[onclick]')?.removeAttribute('onclick');
    const checkoutBtn = cartSidebar.querySelector('.btn-danger');
    if (checkoutBtn) {
      checkoutBtn.removeAttribute('onclick');
      checkoutBtn.id = 'checkoutBtn';
    }
  }
}
function initLoader() {
  const loader = document.getElementById('siteLoader');
  if (!loader) return;
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  });
}
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  if ('ontouchstart' in window) {
    dot.style.display  = ring.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function tick() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  const INTERACTIVE = 'a, button, input, textarea, select, [data-hover]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(INTERACTIVE)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(INTERACTIVE)) ring.classList.remove('hovered');
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = '1'; });
}
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
function initScrollSpy() {
  const navItems = document.querySelectorAll('.nav-item');
  if (!navItems.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        document.querySelector(`.nav-item[href="#${e.target.id}"]`)?.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
}

/* ── MOBILE MENU ─────────────────────────────────────────── */

function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const close = () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  };
  const toggle = () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);
  mobileMenu.querySelectorAll('.mobile-nav-item').forEach(l => l.addEventListener('click', close));
  mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) close(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) close();
  });
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */

function initSmoothScroll() {
  const headerH = () =>
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH(), behavior: 'smooth' });
    });
  });
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */

function initScrollReveal() {
  const SELECTORS = [
    '.about-card', '.product-card', '.album-card', '.gallery-item',
    '.contact-detail', '.footer-links-group', '.about-text',
    '.contact-info', '.contact-form-wrap', '.newsletter-inner'
  ];

  SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.06}s`;
    });
  });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

/* ── PRODUCT FILTER ──────────────────────────────────────── */

function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-btn');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      document.querySelectorAll('.product-card').forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = `opacity 0.3s ${i * 0.04}s, transform 0.3s ${i * 0.04}s`;
        if (match) {
          card.style.display = '';
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

/* ── BACK TO TOP ─────────────────────────────────────────── */

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── CONTACT FORM ────────────────────────────────────────── */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = form.querySelectorAll('.input-xo[required]');
    let firstInvalid = null;

    inputs.forEach(input => {
      const invalid = !input.value.trim();
      input.style.borderColor = invalid ? '#e74c3c' : '';
      if (invalid && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) { shakeElement(firstInvalid); return; }

    const btn         = document.getElementById('submitBtn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML      = '<i class="fas fa-spinner fa-spin"></i> <span>Sending…</span>';
    btn.disabled       = true;
    btn.style.opacity  = '0.7';

    setTimeout(() => {
      btn.innerHTML        = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
      btn.style.background = '#27ae60';
      btn.style.opacity    = '1';
      form.reset();
      setTimeout(() => {
        btn.innerHTML        = originalHTML;
        btn.style.background = '';
        btn.disabled         = false;
      }, 3000);
    }, 1600);
  });
}

/* ── NEWSLETTER ──────────────────────────────────────────── */

function initNewsletter() {
  const btn   = document.querySelector('.newsletter-btn');
  const input = document.querySelector('.newsletter-input');
  if (!btn || !input) return;

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      input.style.borderColor = '#e74c3c';
      shakeElement(input);
      setTimeout(() => input.style.borderColor = '', 1000);
      return;
    }
    const orig = btn.textContent;
    btn.textContent      = 'Done ✓';
    btn.style.background = '#27ae60';
    input.value          = '';
    showToast("You're now part of the XO family!");
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
  };

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

/* ── PARALLAX ────────────────────────────────────────────── */

function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;
  window.addEventListener('scroll', () => {
    bgText.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
}

/* ── ALBUM TILT ──────────────────────────────────────────── */

function initAlbumTilt() {
  document.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r    = card.getBoundingClientRect();
      const rotX = -((e.clientY - r.top  - r.height / 2) / r.height) * 10;
      const rotY =  ((e.clientX - r.left - r.width  / 2) / r.width)  * 10;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── TYPING EFFECT ───────────────────────────────────────── */

function initTypingEffect() {
  const el = document.querySelector('.hero-eyebrow');
  if (!el) return;
  const phrases = ['THE WEEKND', 'XO RECORDS', 'ABEL TESFAYE', 'THE WEEKND'];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    el.textContent = phrase.substring(0, ci) + (ci < phrase.length ? '|' : '');
    if (!deleting && ci < phrase.length)         { ci++;  setTimeout(type, 90); }
    else if (!deleting)                           { deleting = true; setTimeout(type, 2000); }
    else if (deleting && ci > 0)                  { ci--;  setTimeout(type, 45); }
    else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); }
  }
  setTimeout(type, 2200);
}

/* ── MARQUEE PAUSE ───────────────────────────────────────── */

function initMarquee() {
  const track = document.querySelector('.marquee-track');
  const strip = track?.closest('.marquee-strip');
  if (!strip) return;
  strip.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  strip.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */

function initCounters() {
  const statEls = document.querySelectorAll('.stat-num');
  if (!statEls.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const raw = e.target.textContent;
      const end = parseInt(raw.replace(/\D/g, ''));
      if (!end) return;
      const suffix = raw.replace(/\d/g, '');
      let cur = 0;
      const step = Math.ceil(end / 40);
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        e.target.textContent = cur + suffix;
        if (cur >= end) clearInterval(t);
      }, 35);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => obs.observe(el));
}

/* ── BOOTSTRAP OFFCANVAS ─────────────────────────────────── */
// Bootstrap handles data-bs-toggle="offcanvas" automatically.
// We only hook into show.bs.offcanvas to keep cart fresh.

function initCartSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  if (!sidebar) return;
  sidebar.addEventListener('show.bs.offcanvas', renderCart);
}

/* ── BOOT ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderAlbums();

  updateCartBadge();
  renderCart();

  initEventDelegation();
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
  initTypingEffect();
  initMarquee();
  initCounters();
  initCartSidebar();
});
