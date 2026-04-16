/* ============================================================
   Jeune Designer Studio — Project Page
   projet.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Load project from URL ?id=X ── */
  const params  = new URLSearchParams(window.location.search);
  const id      = parseInt(params.get('id'));
  const project = projects.find(p => p.id === id);

  if (!project) {
    window.location.href = 'index.html#projects';
    return;
  }

  /* ── Meta ── */
  document.title = `${project.title} — Jeune Designer`;
  document.getElementById('projet-title').textContent = project.title;
  document.getElementById('projet-tag').textContent   = project.tag;

  /* ── Gallery ── */
  const container = document.getElementById('projet-images');

  // Detect if gallery uses { src, label, caption } objects or plain strings
  const isStructured = project.gallery.length > 0 && typeof project.gallery[0] === 'object';

  if (isStructured) {
    // Group pairs: each Web + its Mobile version together
    const pairs = [];
    for (let i = 0; i < project.gallery.length; i += 2) {
      pairs.push(project.gallery.slice(i, i + 2));
    }

    container.innerHTML = pairs.map((pair, pairIdx) => {
      const caption = pair[0].caption || '';
      const items = pair.map((item, i) => {
        const isMobile = item.label === 'Mobile';
        const isFirst  = pairIdx === 0 && i === 0;
        return `
          <div class="projet-img-wrap${isFirst ? ' projet-img-hero' : ''}${isMobile ? ' projet-img-mobile' : ''}">
            <span class="projet-format-badge projet-format-badge--${item.label.toLowerCase()}">${item.label}</span>
            <img
              src="${item.src}"
              alt="${project.title} — ${item.caption} ${item.label}"
              loading="${isFirst ? 'eager' : 'lazy'}"
            />
          </div>`;
      }).join('');

      return `
        <div class="projet-pair">
          ${caption ? `<p class="projet-pair-caption">${caption}</p>` : ''}
          <div class="projet-pair-grid">${items}</div>
        </div>`;
    }).join('');

  } else {
    // Legacy: plain string gallery
    container.innerHTML = project.gallery.map((src, i) => `
      <div class="projet-img-wrap${i === 0 ? ' projet-img-hero' : ''}">
        <img
          src="${src}"
          alt="${project.title} — visuel ${i + 1}"
          loading="${i < 2 ? 'eager' : 'lazy'}"
        />
      </div>
    `).join('');
  }

  /* ── Entrance animation ── */
  gsap.from('.projet-header', { opacity: 0, y: 30, duration: 0.7, delay: 0.15, ease: 'power3.out' });
  gsap.from('.back-btn',      { opacity: 0, x: -20, duration: 0.5, delay: 0.05, ease: 'power3.out' });
  gsap.from('.projet-img-wrap', {
    opacity: 0, y: 24,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.3,
    ease: 'power2.out'
  });

  /* ── Prev / Next ── */
  const idx     = projects.indexOf(project);
  const prev    = projects[idx - 1] || null;
  const next    = projects[idx + 1] || null;

  const prevBtn  = document.getElementById('proj-prev-btn');
  const nextBtn  = document.getElementById('proj-next-btn');
  const prevName = document.getElementById('proj-prev-name');
  const nextName = document.getElementById('proj-next-name');

  if (prev) {
    prevBtn.href       = `projet.html?id=${prev.id}`;
    prevName.textContent = prev.title;
  } else {
    prevBtn.classList.add('proj-nav-item--hidden');
  }

  if (next) {
    nextBtn.href       = `projet.html?id=${next.id}`;
    nextName.textContent = next.title;
  } else {
    nextBtn.classList.add('proj-nav-item--hidden');
  }

  /* ── Nav burger (mobile) ── */
  const nav        = document.getElementById('nav');
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  let savedScrollY = 0;
  function lockScroll() {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${savedScrollY}px`;
    document.body.style.width    = '100%';
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  }

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    nav.classList.toggle('menu-open', isOpen);
    isOpen ? lockScroll() : unlockScroll();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      nav.classList.remove('menu-open');
      unlockScroll();
    });
  });

  /* ── Custom cursor (desktop) ── */
  if (window.innerWidth > 900) {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    let mx = 0, my = 0, rx = 0, ry = 0, visible = false;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.35 });
      }
    });
    document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 }));
    document.addEventListener('mouseenter', () => { if (visible) gsap.to([dot, ring], { opacity: 1, duration: 0.2 }); });

    (function followRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      gsap.set(ring, { x: rx, y: ry });
      requestAnimationFrame(followRing);
    })();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

});
