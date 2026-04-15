/* ============================================================
   Jeune Designer Studio — Portfolio
   main.js
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader    = document.getElementById('loader');
  const logo      = loader.querySelector('.loader-logo');
  const fill      = document.getElementById('loader-fill');

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          initHeroAnimation();
        }
      });
    }
  });

  tl.to(logo, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
    .to(fill, { width: '100%', duration: 1.2, ease: 'power2.inOut' }, '-=0.2')
    .to(logo, { scale: 1.1, duration: 0.2, ease: 'power2.in' }, '+=0.1')
    .to(logo, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
}

/* ============================================================
   HERO ENTRANCE
   ============================================================ */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-tag',      { opacity: 1, y: 0, duration: 0.7 }, 0.1)
    .to('.hero-wordmark', { opacity: 1, y: 0, duration: 0.8 }, 0.25)
    .to('.hero-sub',      { opacity: 1, y: 0, duration: 0.7 }, 0.4)
    .to('.hero-btns',     { opacity: 1, y: 0, duration: 0.7 }, 0.55)
    .to('.hero-right',    { opacity: 1, x: 0, duration: 1, ease: 'back.out(1.2)' }, 0.3)
    .to('.hero-scroll-hint', { opacity: 1, duration: 0.6 }, 0.9);

  // Set starting positions
  gsap.set('.hero-tag',         { y: 30 });
  gsap.set('.hero-wordmark',    { y: 40 });
  gsap.set('.hero-sub',         { y: 30 });
  gsap.set('.hero-btns',        { y: 30 });
  gsap.set('.hero-right',       { x: 60 });
}

// Set initial states before loader finishes
gsap.set('.hero-tag',         { opacity: 0, y: 30 });
gsap.set('.hero-wordmark',    { opacity: 0, y: 40 });
gsap.set('.hero-sub',         { opacity: 0, y: 30 });
gsap.set('.hero-btns',        { opacity: 0, y: 30 });
gsap.set('.hero-right',       { opacity: 0, x: 60 });
gsap.set('.hero-scroll-hint', { opacity: 0 });

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (window.innerWidth < 480) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });

  // Ring follows with lerp
  function followRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(followRing);
  }
  followRing();

  // Hover state on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .service-card, .project-card, .filter-btn, .chip, input, textarea'
  );

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNav() {
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  // Scroll class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Active section highlight
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  // Burger
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   GSAP SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  // Services stagger — opacity only, no Y offset to keep grid alignment
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 82%',
    },
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Contact form
  gsap.from('.contact-form .form-group', {
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Hero parallax
  gsap.to('.hero-character', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: -80,
    ease: 'none'
  });
}

/* ============================================================
   STATS COUNTER
   ============================================================ */
function initCounters() {
  const stats = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const start = performance.now();

        const tick = now => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(s => observer.observe(s));
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagnetic() {
  if (window.innerWidth < 900) return;

  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ============================================================
   PROJECTS GRID — vertical snap with focus/blur depth
   ============================================================ */
let projectsScrollLocked = false;
let projectsScrollUnlisten = null;
let projectsWheelUnlisten = null;

function initProjectsFocus(scrollWrap) {
  // Detach previous listeners
  if (projectsScrollUnlisten) projectsScrollUnlisten();
  if (projectsWheelUnlisten)  projectsWheelUnlisten();

  function updateActive() {
    const center = scrollWrap.scrollTop + scrollWrap.clientHeight / 2;
    const cards  = scrollWrap.querySelectorAll('.project-card');
    let closest = null, closestDist = Infinity;
    cards.forEach(card => {
      const dist = Math.abs((card.offsetTop + card.offsetHeight / 2) - center);
      if (dist < closestDist) { closestDist = dist; closest = card; }
    });
    cards.forEach(c => c.classList.toggle('is-active', c === closest));
  }

  scrollWrap.addEventListener('scroll', updateActive, { passive: true });
  projectsScrollUnlisten = () => scrollWrap.removeEventListener('scroll', updateActive);

  // Wheel: one card at a time, boundary-aware
  const onWheel = e => {
    const cards = Array.from(scrollWrap.querySelectorAll('.project-card'));
    if (!cards.length) return;
    const active = cards.find(c => c.classList.contains('is-active')) || cards[0];
    const idx    = cards.indexOf(active);
    const next   = idx + (e.deltaY > 0 ? 1 : -1);
    if (next < 0 || next >= cards.length) return; // let page scroll at boundaries
    e.preventDefault();
    if (projectsScrollLocked) return;
    projectsScrollLocked = true;
    cards[next].scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { projectsScrollLocked = false; }, 700);
  };
  scrollWrap.addEventListener('wheel', onWheel, { passive: false });
  projectsWheelUnlisten = () => scrollWrap.removeEventListener('wheel', onWheel);

  // First active card
  updateActive();
}

function renderProjects(filter = 'all') {
  const grid      = document.getElementById('projects-grid');
  const scrollWrap = document.getElementById('projects-scroll-wrap');
  const filtered  = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  if (scrollWrap) scrollWrap.scrollTop = 0;

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="padding:3rem;color:var(--muted);font-size:13px;font-weight:600;">Bientôt disponible ✦</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-id="${p.id}">
      <img src="${p.thumb}" alt="${p.title}" class="project-card-img" loading="lazy" />
      <div class="project-overlay">
        <h3 class="project-title">${p.title}</h3>
        <div class="project-info">
          <p class="project-tag">${p.tag}</p>
          ${p.gallery.length > 1 ? `<span class="project-count">${p.gallery.length} slides</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    card.addEventListener('click', () => {
      const project = projects.find(p => p.id === parseInt(card.dataset.id));
      if (project) openLightbox(project);
    });
  });

  requestAnimationFrame(() => {
    gsap.from('.project-card', { opacity: 0, y: 30, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    initProjectsFocus(scrollWrap);
  });
}

function initProjects() {
  renderProjects();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}

/* ============================================================
   LIGHTBOX — Vertical Reel
   ============================================================ */
let lbIndex = 0;
let lbProject = null;
let lbScrollLocked = false;
let lbReelOnScroll = null;

function updateLbProgress() {
  const fill = document.querySelector('.lb-progress-fill');
  if (!fill || !lbProject) return;
  const pct = lbProject.gallery.length > 1
    ? (lbIndex / (lbProject.gallery.length - 1)) * 100
    : 100;
  fill.style.width = pct + '%';
}

function updateLbCounter() {
  const el = document.querySelector('.lb-counter');
  if (el && lbProject) el.textContent = `${lbIndex + 1} / ${lbProject.gallery.length}`;
}

function navigateLb(dir) {
  if (!lbProject) return;
  const n = lbProject.gallery.length;
  const next = Math.max(0, Math.min(n - 1, lbIndex + dir));
  if (next === lbIndex) return;
  const reel = document.getElementById('lb-reel');
  const slides = reel.querySelectorAll('.lb-slide');
  slides[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function buildLbReel(project) {
  const reel = document.getElementById('lb-reel');

  // Remove previous scroll listener
  if (lbReelOnScroll) reel.removeEventListener('scroll', lbReelOnScroll);

  reel.innerHTML = project.gallery.map((src, i) => `
    <div class="lb-slide" data-index="${i}">
      <img src="${src}" alt="${project.title}" class="lb-slide-img" loading="${i === 0 ? 'eager' : 'lazy'}" />
    </div>
  `).join('');

  reel.scrollTop = 0;

  // Activate first slide after paint
  requestAnimationFrame(() => {
    const first = reel.querySelector('.lb-slide');
    if (first) first.classList.add('is-active');
  });

  // Track which slide is centered
  lbReelOnScroll = () => {
    const center = reel.scrollTop + reel.clientHeight / 2;
    const slides = reel.querySelectorAll('.lb-slide');
    let closest = null, closestDist = Infinity;
    slides.forEach(s => {
      const dist = Math.abs((s.offsetTop + s.offsetHeight / 2) - center);
      if (dist < closestDist) { closestDist = dist; closest = s; }
    });
    slides.forEach(s => s.classList.toggle('is-active', s === closest));
    if (closest) {
      const ni = parseInt(closest.dataset.index);
      if (ni !== lbIndex) {
        lbIndex = ni;
        updateLbCounter();
        updateLbProgress();
      }
    }
  };
  reel.addEventListener('scroll', lbReelOnScroll, { passive: true });
}

function openLightbox(project) {
  lbProject = project;
  lbIndex   = 0;
  lbScrollLocked = false;

  const lb = document.getElementById('lightbox');
  lb.querySelector('.lb-title').textContent = project.title;
  lb.querySelector('.lb-tag').textContent   = project.tag;
  updateLbCounter();
  updateLbProgress();

  buildLbReel(project);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb   = document.getElementById('lightbox');
  const reel = document.getElementById('lb-reel');
  gsap.to(lb, {
    opacity: 0, duration: 0.35, ease: 'power2.in',
    onComplete: () => {
      lb.classList.remove('open');
      gsap.set(lb, { clearProps: 'opacity' });
      document.body.style.overflow = '';
      if (lbReelOnScroll) reel.removeEventListener('scroll', lbReelOnScroll);
      reel.innerHTML = '';
      lbProject = null;
      lbScrollLocked = false;
    }
  });
}

function initLightbox() {
  const lb   = document.getElementById('lightbox');
  const reel = document.getElementById('lb-reel');
  const close = lb.querySelector('.lb-close');

  close.addEventListener('click', closeLightbox);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lbProject) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); navigateLb(1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); navigateLb(-1); }
  });

  // Mouse wheel: one slide at a time
  lb.addEventListener('wheel', e => {
    if (!lbProject) return;
    e.preventDefault();
    if (lbScrollLocked) return;
    lbScrollLocked = true;
    navigateLb(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { lbScrollLocked = false; }, 650);
  }, { passive: false });

  // Cursor hover on close
  close.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  close.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initForm() {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"] span');
    btn.textContent = 'Message envoyé ✓';
    gsap.to(form.querySelector('button'), {
      background: '#22c55e',
      duration: 0.3
    });
    setTimeout(() => {
      btn.textContent = 'Envoyer le message';
      gsap.to(form.querySelector('button'), {
        background: 'var(--y)',
        duration: 0.3
      });
      form.reset();
    }, 3000);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initScrollReveal();
  initScrollAnimations();
  initCounters();
  initMagnetic();
  initProjects();
  initLightbox();
  initForm();
});
