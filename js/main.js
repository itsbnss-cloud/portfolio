/* ============================================================
   Jeune Designer Studio — Portfolio
   main.js
   ============================================================ */

try { gsap.registerPlugin(ScrollTrigger); } catch(e) { console.warn('GSAP ScrollTrigger not loaded:', e); }

// Always start at top — suppress hash scroll on load/refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

/* ============================================================
   iOS-SAFE SCROLL LOCK  (used by both mobile menu & lightbox)
   ============================================================ */
let savedScrollY = 0;

function lockScroll() {
  savedScrollY = window.scrollY;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  // window.scrollY is unchanged — no restore needed
}

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');

  // Skip loader if already seen this session
  if (sessionStorage.getItem('loaderSeen')) {
    loader.style.display = 'none';
    initHeroAnimation();
    return;
  }

  const logo = loader.querySelector('.loader-logo');
  const fill = document.getElementById('loader-fill');

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          sessionStorage.setItem('loaderSeen', '1');
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
try {
  gsap.set('.hero-tag',         { opacity: 0, y: 30 });
  gsap.set('.hero-wordmark',    { opacity: 0, y: 40 });
  gsap.set('.hero-sub',         { opacity: 0, y: 30 });
  gsap.set('.hero-btns',        { opacity: 0, y: 30 });
  gsap.set('.hero-right',       { opacity: 0, x: 60 });
  gsap.set('.hero-scroll-hint', { opacity: 0 });
} catch(e) { console.warn('GSAP initial set failed:', e); }

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Only on desktop — matches the CSS 900px hide breakpoint
  if (window.innerWidth <= 900) return;

  // GSAP-native centering: xPercent/yPercent stack correctly with x/y
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let visible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.set(dot, { x: mx, y: my });

    // Fade in on first real mouse move (avoids cursor flash at 0,0 on load)
    if (!visible) {
      visible = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.35 });
    }
  });

  // Hide cursor when mouse leaves the window
  document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 }));
  document.addEventListener('mouseenter', () => { if (visible) gsap.to([dot, ring], { opacity: 1, duration: 0.2 }); });

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
   SMOOTH SCROLL HELPER
   ============================================================ */
function easedScrollTo(targetEl) {
  const navH    = document.getElementById('nav')?.offsetHeight || 70;
  const targetY = Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - navH);
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNav() {
  const nav        = document.getElementById('nav');
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks   = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections   = document.querySelectorAll('section[id]');

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

  // Burger toggle
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    nav.classList.toggle('menu-open', isOpen);
    isOpen ? lockScroll() : unlockScroll();
  });

  // Close menu on link click then smooth scroll
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const href   = link.getAttribute('href') || '';
      const hash   = href.includes('#') ? '#' + href.split('#')[1] : null;
      const target = hash ? document.querySelector(hash) : null;

      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      nav.classList.remove('menu-open');

      if (target) {
        e.preventDefault();
        unlockScroll();
        easedScrollTo(target);
      } else {
        unlockScroll();
      }
    });
  });

  // Smooth scroll for desktop anchor links
  document.querySelectorAll('a[href^="#"]:not(#mobile-menu a)').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      easedScrollTo(target);
    });
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
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

  // Hero parallax — desktop only (avoid jank on mobile)
  if (window.innerWidth >= 768) {
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
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${(window.scrollY / max * 100).toFixed(2)}%` : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   SERVICE CARD SPOTLIGHT
   ============================================================ */
function initServiceSpotlight() {
  if (window.innerWidth < 900) return;
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
      card.style.setProperty('--spot-y', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
    });
  });
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
   PROJECTS GRID
   ============================================================ */
let pgInfiniteHandler = null;

function attachCardEvents(card) {
  card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  card.addEventListener('click', () => {
    const id = card.dataset.id;
    if (id) window.location.href = `projet.html?id=${id}`;
  });

  // 3D tilt on desktop
  if (window.innerWidth >= 900) {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(card, {
        rotateY: x * 14,
        rotateX: -y * 10,
        transformPerspective: 900,
        scale: 1.03,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0, scale: 1,
        duration: 0.7, ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    });
  }
}

function renderProjects(filter = 'all') {
  const grid     = document.getElementById('projects-grid');
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  // Remove previous infinite scroll listener
  if (pgInfiniteHandler) { grid.removeEventListener('scroll', pgInfiniteHandler); pgInfiniteHandler = null; }

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="padding:3rem;color:var(--muted);font-size:13px;font-weight:600;">Bientôt disponible ✦</div>`;
    return;
  }

  // Render original cards
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

  const cards = [...grid.querySelectorAll('.project-card')];
  cards.forEach(attachCardEvents);

  try { gsap.from(cards, { opacity: 0, y: 16, duration: 0.5, stagger: 0.07, ease: 'power2.out', clearProps: 'transform,opacity' }); } catch(e) {}
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

  // Arrow nav buttons
  const grid = document.getElementById('projects-grid');
  const prevBtn = document.getElementById('proj-prev');
  const nextBtn = document.getElementById('proj-next');

  function scrollByCard(dir) {
    const card = grid.querySelector('.project-card');
    if (!card) return;
    const step = card.offsetWidth + 20; // card width + gap
    grid.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));

  // cursor-hover on nav buttons
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Drag-to-scroll on projects grid (desktop only — touch devices use native scroll)
  if (window.innerWidth < 768) return;

  let pgDragging = false, pgStartX = 0, pgScrollLeft = 0, pgDragged = false;

  grid.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    pgDragging   = true;
    pgDragged    = false;
    pgStartX     = e.clientX;
    pgScrollLeft = grid.scrollLeft;
    grid.classList.add('is-dragging');
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!pgDragging) return;
    const dx = e.clientX - pgStartX;
    if (Math.abs(dx) > 4) pgDragged = true;
    grid.scrollLeft = pgScrollLeft - dx;
  });
  window.addEventListener('mouseup', () => {
    if (!pgDragging) return;
    pgDragging = false;
    grid.classList.remove('is-dragging');
  });
  // Suppress click on card after a drag
  grid.addEventListener('click', e => {
    if (pgDragged) { pgDragged = false; e.stopPropagation(); }
  }, true);
}

/* ============================================================
   LIGHTBOX — Vertical Reel
   ============================================================ */
let lbIndex = 0;
let lbProject = null;
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
  const next = (lbIndex + dir + n) % n; // wrap around infinitely
  const reel = document.getElementById('lb-reel');
  const center = reel.scrollTop + reel.clientHeight / 2;
  // Find the nearest clone of target index to current position
  const candidates = [...reel.querySelectorAll(`.lb-slide[data-index="${next}"]`)];
  if (!candidates.length) return;
  let closest = candidates[0], closestDist = Infinity;
  candidates.forEach(s => {
    const dist = Math.abs((s.offsetTop + s.offsetHeight / 2) - center);
    if (dist < closestDist) { closestDist = dist; closest = s; }
  });
  closest.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function buildLbReel(project) {
  const reel = document.getElementById('lb-reel');
  if (lbReelOnScroll) reel.removeEventListener('scroll', lbReelOnScroll);

  const slideHtml = (src, i, eager) => `
    <div class="lb-slide" data-index="${i}">
      <img src="${src}" alt="${project.title}" class="lb-slide-img" loading="${eager ? 'eager' : 'lazy'}" />
    </div>`;

  // [clone A] [original] [clone B] — triple set for infinite loop
  const origHtml  = project.gallery.map((src, i) => slideHtml(src, i, i === 0)).join('');
  const cloneHtml = project.gallery.map((src, i) => slideHtml(src, i, false)).join('');
  reel.innerHTML  = cloneHtml + origHtml + cloneHtml;

  function updateActiveSlide() {
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
      if (ni !== lbIndex) { lbIndex = ni; updateLbCounter(); updateLbProgress(); }
    }
  }

  // Start at original set (skip clone A)
  requestAnimationFrame(() => {
    const setH = reel.scrollHeight / 3;
    reel.scrollTop = setH;
    updateActiveSlide();

    lbReelOnScroll = () => {
      // Infinite loop jump
      const sh = reel.scrollHeight / 3;
      if (reel.scrollTop >= sh * 2)  reel.scrollTop -= sh;
      else if (reel.scrollTop <= 0)  reel.scrollTop += sh;
      updateActiveSlide();
    };
    reel.addEventListener('scroll', lbReelOnScroll, { passive: true });
  });
}

function openLightbox(project) {
  lbProject = project;
  lbIndex   = 0;

  const lb = document.getElementById('lightbox');
  lb.querySelector('.lb-title').textContent = project.title;
  lb.querySelector('.lb-tag').textContent   = project.tag;
  updateLbCounter();
  updateLbProgress();

  buildLbReel(project);
  lb.classList.add('open');
  lockScroll();
}

function closeLightbox() {
  const lb   = document.getElementById('lightbox');
  const reel = document.getElementById('lb-reel');
  gsap.to(lb, {
    opacity: 0, duration: 0.35, ease: 'power2.in',
    onComplete: () => {
      lb.classList.remove('open');
      gsap.set(lb, { clearProps: 'opacity' });
      unlockScroll();
      if (lbReelOnScroll) reel.removeEventListener('scroll', lbReelOnScroll);
      reel.innerHTML = '';
      lbProject = null;
    }
  });
}

function initLightbox() {
  const lb   = document.getElementById('lightbox');
  const reel = document.getElementById('lb-reel');
  const close = lb.querySelector('.lb-close');

  close.addEventListener('click', closeLightbox);

  // ── Drag-to-scroll (desktop / mouse only) ───────────────────
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  let isDragging    = false;
  let dragStartY    = 0;
  let dragScrollTop = 0;
  let hasDragged    = false;

  if (!isTouch) {
    reel.addEventListener('mouseenter', () => document.body.classList.add('cursor-drag'));
    reel.addEventListener('mouseleave', () => { if (!isDragging) document.body.classList.remove('cursor-drag'); });
  }

  if (!isTouch) reel.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDragging    = true;
    hasDragged    = false;
    dragStartY    = e.clientY;
    dragScrollTop = reel.scrollTop;
    document.body.classList.add('cursor-dragging');
    e.preventDefault(); // prevent text selection — desktop only
  });

  if (!isTouch) {
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dy) > 4) hasDragged = true;
      reel.scrollTop = dragScrollTop - dy;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      document.body.classList.remove('cursor-dragging');
      if (!reel.matches(':hover')) document.body.classList.remove('cursor-drag');
    });
  }

  // Click on empty space → close (only if not a drag)
  reel.addEventListener('click', e => {
    if (hasDragged) { hasDragged = false; return; }
    if (e.target === reel || e.target.classList.contains('lb-slide')) closeLightbox();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lbProject) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); navigateLb(1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); navigateLb(-1); }
  });

  // Mouse wheel: free native scroll inside reel — no interception

  // Swipe down to close (when reel is at top)
  let swipeTouchY = 0, swipeStartScroll = 0;
  lb.addEventListener('touchstart', e => {
    swipeTouchY      = e.touches[0].clientY;
    swipeStartScroll = reel.scrollTop;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (!lbProject) return;
    const dy = e.changedTouches[0].clientY - swipeTouchY;
    if (dy > 90 && swipeStartScroll < 20) closeLightbox();
  }, { passive: true });

  // Cursor hover on close
  close.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  close.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initForm() {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn      = form.querySelector('button[type="submit"]');
    const btnLabel = btn.querySelector('span');

    btnLabel.textContent = 'Envoi en cours…';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/mvzdkwkd', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        btnLabel.textContent = 'Message envoyé ✓';
        gsap.to(btn, { background: '#22c55e', duration: 0.3 });
        form.reset();
        setTimeout(() => {
          btnLabel.textContent = 'Envoyer le message';
          gsap.to(btn, { background: 'var(--y)', duration: 0.3 });
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      btnLabel.textContent = 'Erreur — réessayez';
      gsap.to(btn, { background: '#ef4444', duration: 0.3 });
      setTimeout(() => {
        btnLabel.textContent = 'Envoyer le message';
        gsap.to(btn, { background: 'var(--y)', duration: 0.3 });
        btn.disabled = false;
      }, 3000);
    }
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  try { initLoader(); }           catch(e) { console.error('initLoader:', e); }
  try { initScrollProgress(); }   catch(e) { console.error('initScrollProgress:', e); }
  try { initCursor(); }           catch(e) { console.error('initCursor:', e); }
  try { initNav(); }              catch(e) { console.error('initNav:', e); }
  try { initScrollReveal(); }     catch(e) { console.error('initScrollReveal:', e); }
  try { initScrollAnimations(); } catch(e) { console.error('initScrollAnimations:', e); }
  try { initCounters(); }         catch(e) { console.error('initCounters:', e); }
  try { initMagnetic(); }         catch(e) { console.error('initMagnetic:', e); }
  try { initServiceSpotlight(); } catch(e) { console.error('initServiceSpotlight:', e); }
  try { initProjects(); }         catch(e) { console.error('initProjects:', e); }
  try { initLightbox(); }         catch(e) { console.error('initLightbox:', e); }
  try { initForm(); }             catch(e) { console.error('initForm:', e); }

  // If navigating from another page with a hash, scroll to that section
  const navType = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0] || {}).type;
  if (navType === 'navigate' && window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) setTimeout(() => easedScrollTo(target), 100);
  }
});
