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
  // Services stagger
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
    },
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Projects stagger
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    scale: 0.95,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out'
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
   PROJECTS GRID
   ============================================================ */
function renderProjects(filter = 'all') {
  const grid = document.getElementById('projects-grid');
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted);font-size:13px;font-weight:600;">Bientôt disponible ✦</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-id="${p.id}" style="cursor:none">
      <img src="${p.thumb}" alt="${p.title}" class="project-card-img" loading="lazy" />
      <div class="project-overlay">
        <p class="project-tag">${p.tag}</p>
        <h3 class="project-title">${p.title}</h3>
        ${p.gallery.length > 1 ? `<span class="project-count">${p.gallery.length} slides</span>` : ''}
      </div>
    </div>
  `).join('');

  gsap.from('.project-card', {
    opacity: 0, y: 30, scale: 0.96,
    duration: 0.5, stagger: 0.08, ease: 'power2.out'
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

function renderLbSlide() {
  const lb  = document.getElementById('lightbox');
  const img = lb.querySelector('.lb-img');
  const counter = lb.querySelector('.lb-counter');

  img.classList.add('fade');
  setTimeout(() => {
    img.src = lbProject.gallery[lbIndex];
    img.alt = lbProject.title;
    img.classList.remove('fade');
    counter.textContent = `${lbIndex + 1} / ${lbProject.gallery.length}`;
    lb.querySelectorAll('.lb-dot').forEach((d, i) => d.classList.toggle('active', i === lbIndex));
  }, 180);
}

function renderLbDots() {
  const lb   = document.getElementById('lightbox');
  const dots = lb.querySelector('.lb-dots');
  dots.innerHTML = lbProject.gallery.map((_, i) =>
    `<span class="lb-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
  ).join('');

  dots.querySelectorAll('.lb-dot').forEach(d => {
    d.addEventListener('click', () => { lbIndex = parseInt(d.dataset.i); renderLbSlide(); });
  });
}

function initLightbox() {
  const lb   = document.getElementById('lightbox');
  const prev = lb.querySelector('.lb-prev');
  const next = lb.querySelector('.lb-next');
  const close = lb.querySelector('.lb-close');

  close.addEventListener('click', closeLightbox);
  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);

  prev.addEventListener('click', () => {
    if (!lbProject) return;
    lbIndex = (lbIndex - 1 + lbProject.gallery.length) % lbProject.gallery.length;
    renderLbSlide();
  });

  next.addEventListener('click', () => {
    if (!lbProject) return;
    lbIndex = (lbIndex + 1) % lbProject.gallery.length;
    renderLbSlide();
  });

  document.addEventListener('keydown', e => {
    if (!lbProject) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbProject.gallery.length) % lbProject.gallery.length; renderLbSlide(); }
    if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbProject.gallery.length; renderLbSlide(); }
  });

  // Swipe support
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50 && lbProject) {
      lbIndex = diff > 0
        ? (lbIndex + 1) % lbProject.gallery.length
        : (lbIndex - 1 + lbProject.gallery.length) % lbProject.gallery.length;
      renderLbSlide();
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
