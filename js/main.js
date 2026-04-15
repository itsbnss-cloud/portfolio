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
   CAROUSEL
   ============================================================ */
let carIndex = 0;
const CAR_GAP = 24; // 1.5rem

function getCardsPerView() {
  if (window.innerWidth < 768) return 1;
  return 2;
}

function updateCarousel(animate = true) {
  const grid = document.getElementById('projects-grid');
  const vp   = document.getElementById('carousel-viewport');
  const dots = document.getElementById('carousel-dots');
  if (!grid || !vp) return;

  const perView = getCardsPerView();
  const cardW   = (vp.offsetWidth - CAR_GAP * (perView - 1)) / perView;
  const cards   = Array.from(grid.querySelectorAll('.project-card'));
  const maxIdx  = Math.max(0, cards.length - perView);

  carIndex = Math.min(Math.max(carIndex, 0), maxIdx);
  cards.forEach(c => { c.style.width = cardW + 'px'; c.style.flexShrink = '0'; });

  const offset = -(carIndex * (cardW + CAR_GAP));
  animate
    ? gsap.to(grid,  { x: offset, duration: 0.55, ease: 'power3.out' })
    : gsap.set(grid, { x: offset });

  const prevBtn = document.getElementById('car-prev');
  const nextBtn = document.getElementById('car-next');
  if (prevBtn) prevBtn.disabled = (carIndex === 0);
  if (nextBtn) nextBtn.disabled = (carIndex >= maxIdx);

  if (dots) {
    const count = maxIdx + 1;
    if (dots.children.length !== count) {
      dots.innerHTML = Array.from({ length: count }, (_, i) =>
        `<button class="carousel-dot${i === carIndex ? ' active' : ''}" data-i="${i}" aria-label="Slide ${i+1}"></button>`
      ).join('');
      dots.querySelectorAll('.carousel-dot').forEach(d => {
        d.addEventListener('click', () => { carIndex = +d.dataset.i; updateCarousel(); });
      });
    } else {
      dots.querySelectorAll('.carousel-dot').forEach((d, i) =>
        d.classList.toggle('active', i === carIndex)
      );
    }
  }
}

function initCarousel() {
  document.getElementById('car-prev').addEventListener('click', () => { carIndex--; updateCarousel(); });
  document.getElementById('car-next').addEventListener('click', () => { carIndex++; updateCarousel(); });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updateCarousel(false), 150);
  });

  // Touch swipe
  const vp = document.getElementById('carousel-viewport');
  let tx = 0;
  vp.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  vp.addEventListener('touchend',   e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) { carIndex += dx > 0 ? 1 : -1; updateCarousel(); }
  }, { passive: true });

  // Mouse drag
  let dragging = false, dragX = 0;
  vp.addEventListener('mousedown', e => { dragging = true; dragX = e.clientX; vp.style.cursor = 'grabbing'; });
  window.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    vp.style.cursor = '';
    const dx = dragX - e.clientX;
    if (Math.abs(dx) > 50) { carIndex += dx > 0 ? 1 : -1; updateCarousel(); }
  });
}

/* ============================================================
   PROJECTS GRID
   ============================================================ */
function renderProjects(filter = 'all') {
  carIndex = 0;
  const grid = document.getElementById('projects-grid');
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="padding:3rem;color:var(--muted);font-size:13px;font-weight:600;white-space:nowrap;">Bientôt disponible ✦</div>`;
    gsap.set(grid, { x: 0 });
    requestAnimationFrame(() => updateCarousel(false));
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-id="${p.id}" style="cursor:none">
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

  gsap.set(grid, { x: 0 });
  requestAnimationFrame(() => {
    updateCarousel(false);
    gsap.from('.project-card', { opacity: 0, y: 20, scale: 0.97, duration: 0.45, stagger: 0.07, ease: 'power2.out' });
  });

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    card.addEventListener('click', () => {
      const project = projects.find(p => p.id === parseInt(card.dataset.id));
      if (project) openLightbox(project);
    });
  });
}

function initProjects() {
  renderProjects();
  initCarousel();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
let lbIndex = 0;
let lbProject = null;

function openLightbox(project) {
  lbProject = project;
  lbIndex   = 0;

  const lb      = document.getElementById('lightbox');
  const img     = lb.querySelector('.lb-img');
  const title   = lb.querySelector('.lb-title');
  const tag     = lb.querySelector('.lb-tag');

  title.textContent = project.title;
  tag.textContent   = project.tag;

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  renderLbSlide();
  renderLbDots();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
  lbProject = null;
}

// dir: 0 = initial, 1 = forward, -1 = backward
function renderLbSlide(dir = 0) {
  const lb      = document.getElementById('lightbox');
  const img     = lb.querySelector('.lb-img');
  const counter = lb.querySelector('.lb-counter');

  // Cinematic: subtle drift (not a carousel slide), combined with opacity + scale
  const drift = 26 * dir; // pixels — very soft, just whispers direction

  const show = () => {
    img.src = lbProject.gallery[lbIndex];
    img.alt = lbProject.title;
    counter.textContent = `${lbIndex + 1} / ${lbProject.gallery.length}`;
    lb.querySelectorAll('.lb-dot').forEach((d, i) => d.classList.toggle('active', i === lbIndex));
    gsap.fromTo(img,
      { opacity: 0, x: -drift * 0.55, scale: 0.975 },
      { opacity: 1, x: 0,             scale: 1,     duration: 0.52, ease: 'power3.out' }
    );
  };

  if (dir !== 0) {
    gsap.to(img, {
      opacity: 0, x: drift, scale: 0.975,
      duration: 0.26, ease: 'power2.in',
      onComplete: show
    });
  } else {
    gsap.set(img, { x: 0, scale: 1, opacity: 0 });
    show();
  }
}

function renderLbDots() {
  const lb   = document.getElementById('lightbox');
  const dots = lb.querySelector('.lb-dots');
  dots.innerHTML = lbProject.gallery.map((_, i) =>
    `<span class="lb-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
  ).join('');

  dots.querySelectorAll('.lb-dot').forEach(d => {
    d.addEventListener('click', () => {
      const newIdx = parseInt(d.dataset.i);
      const dir = newIdx > lbIndex ? 1 : -1;
      lbIndex = newIdx;
      renderLbSlide(dir);
    });
  });
}

function initLightbox() {
  const lb   = document.getElementById('lightbox');
  const prev = lb.querySelector('.lb-prev');
  const next = lb.querySelector('.lb-next');
  const close = lb.querySelector('.lb-close');

  close.addEventListener('click', closeLightbox);

  // Click on the dark area around the image (not the image itself) → close
  lb.querySelector('.lb-viewport').addEventListener('click', e => {
    if (e.target === lb.querySelector('.lb-viewport')) closeLightbox();
  });

  const navigate = (dir) => {
    if (!lbProject) return;
    const n = lbProject.gallery.length;
    lbIndex = (lbIndex + dir + n) % n;
    renderLbSlide(dir); // dots updated inside renderLbSlide → show()
  };

  prev.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', e => {
    if (!lbProject) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Scroll wheel + trackpad — one gesture = one slide
  // Lock for 800 ms (full animation) and filter micro-deltas from momentum decay
  let wheelLock = false;
  lb.addEventListener('wheel', e => {
    e.preventDefault();
    if (!lbProject) return;
    if (wheelLock) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 4) return; // ignore residual inertia events
    wheelLock = true;
    navigate(delta > 0 ? 1 : -1);
    setTimeout(() => { wheelLock = false; }, 800);
  }, { passive: false });

  // Touch swipe — horizontal on desktop, vertical on mobile
  let touchStartX = 0, touchStartY = 0;
  lb.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', e => {
    if (!lbProject) return;
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (window.innerWidth < 768) {
      if (Math.abs(dy) > 40) navigate(dy > 0 ? 1 : -1);
    } else {
      if (Math.abs(dx) > 40) navigate(dx > 0 ? 1 : -1);
    }
  });

  // Cursor hover on lightbox buttons
  [prev, next, close, lb.querySelector('.lb-backdrop')].forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
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
