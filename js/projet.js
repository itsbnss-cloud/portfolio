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
    // Build pairs: [{ web, mobile }]
    const pairs = [];
    for (let i = 0; i < project.gallery.length; i += 2) {
      pairs.push({ web: project.gallery[i], mobile: project.gallery[i + 1] || null });
    }

    // Overview: only web banners as clickable cards
    container.innerHTML = `<div class="format-overview">${
      pairs.map((pair, i) => `
        <div class="format-card" data-pair="${i}" tabindex="0" role="button" aria-label="Voir ${pair.web.caption}">
          <img src="${pair.web.src}" alt="${project.title} — ${pair.web.caption}" loading="${i < 3 ? 'eager' : 'lazy'}" />
          <div class="format-card-overlay">
            <span class="format-card-caption">${pair.web.caption}</span>
            <span class="format-card-hint">Web + Mobile →</span>
          </div>
        </div>
      `).join('')
    }</div>`;

    // Click → open pair detail overlay
    const detail    = document.getElementById('format-detail');
    const detailWeb = document.getElementById('format-detail-web');
    const detailMob = document.getElementById('format-detail-mob');
    const detailCap = document.getElementById('format-detail-caption');
    const detailClose = document.getElementById('format-detail-close');

    function openDetail(pair) {
      detailCap.textContent  = pair.web.caption || '';
      detailWeb.src          = pair.web.src;
      detailWeb.alt          = pair.web.caption + ' — Web';
      const mobItem = detailMob.closest('.format-detail-item');
      if (pair.mobile) {
        detailMob.src  = pair.mobile.src;
        detailMob.alt  = pair.mobile.caption + ' — Mobile';
        mobItem.style.display = '';
        mobItem.classList.toggle('format-detail-item--mobile-wide', !!pair.mobile.wide);
      } else {
        mobItem.style.display = 'none';
        mobItem.classList.remove('format-detail-item--mobile-wide');
      }
      detail.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
      detail.classList.remove('open');
      document.body.style.overflow = '';
    }

    container.querySelectorAll('.format-card').forEach(card => {
      card.addEventListener('click', () => openDetail(pairs[+card.dataset.pair]));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openDetail(pairs[+card.dataset.pair]); });
    });

    detailClose.addEventListener('click', closeDetail);
    detail.addEventListener('click', e => { if (e.target === detail) closeDetail(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

  } else {
    // Legacy: plain string gallery
    container.innerHTML = project.gallery.map((src, i) => `
      <div class="projet-img-wrap${i === 0 ? ' projet-img-hero' : ''}">
        <img src="${src}" alt="${project.title} — visuel ${i + 1}" loading="${i < 2 ? 'eager' : 'lazy'}" />
      </div>
    `).join('');

    // ── Lightbox carousel (blur + fondu) ──
    const lb        = document.getElementById('lb');
    const lbTrack   = document.getElementById('lb-track');
    const lbSlides  = Array.from(lbTrack.querySelectorAll('.lb-slide'));
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');
    const lbCounter = document.getElementById('lb-counter');
    const nav       = document.getElementById('nav');
    const srcs      = project.gallery;
    let lbIdx  = 0;
    let lbBusy = false;
    let dragStart = null;
    let dragging  = false;

    const slide  = pos => lbSlides.find(s => s.dataset.pos === String(pos));
    const W      = ()  => lb.offsetWidth;

    // Met à jour le contenu des 3 slots sans animation
    const syncContent = () => {
      slide(-1).querySelector('img').src = srcs[(lbIdx - 1 + srcs.length) % srcs.length];
      slide( 0).querySelector('img').src = srcs[lbIdx];
      slide( 1).querySelector('img').src = srcs[(lbIdx + 1) % srcs.length];
      lbCounter.textContent = `${lbIdx + 1} / ${srcs.length}`;
    };

    // Navigation (boutons, clavier, trackpad)
    const lbGo = (newIdx, dir) => {
      // dir: 1 = next, -1 = prev
      if (lbBusy) return;
      lbBusy = true;
      lbIdx  = (newIdx + srcs.length) % srcs.length;

      // Le slide recyclé saute instantanément à l'opposé (il est hors écran)
      const recycled = slide(dir > 0 ? -1 : 1);
      recycled.style.transition = 'none';
      recycled.dataset.pos      = String(dir > 0 ? 1 : -1);
      recycled.querySelector('img').src = srcs[(lbIdx + (dir > 0 ? 1 : -1) + srcs.length) % srcs.length];

      // Les deux autres slides s'animent avec CSS transition
      requestAnimationFrame(() => requestAnimationFrame(() => {
        recycled.style.transition = '';
        slide(0).dataset.pos      = String(-dir);
        slide(dir > 0 ? 1 : -1).dataset.pos = '0';
        lbCounter.textContent     = `${lbIdx + 1} / ${srcs.length}`;
        setTimeout(() => { lbBusy = false; }, 500);
      }));
    };

    const openLb = idx => {
      lbIdx = (idx + srcs.length) % srcs.length;
      // Placer tous les slides sans transition
      lbSlides.forEach(s => { s.style.transition = 'none'; });
      lbSlides[0].dataset.pos = '-1';
      lbSlides[1].dataset.pos = '0';
      lbSlides[2].dataset.pos = '1';
      syncContent();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (nav) nav.style.opacity = '0';
      requestAnimationFrame(() => {
        lbSlides.forEach(s => { s.style.transition = ''; });
      });
    };

    const closeLb = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (nav) nav.style.opacity = '';
    };

    // ── Drag : déplace les 3 slides ensemble ──
    const onStart = x => {
      if (lbBusy) return;
      dragStart = x; dragging = false;
      lbSlides.forEach(s => { s.style.transition = 'none'; });
    };

    const onMove = x => {
      if (dragStart === null) return;
      const dx = x - dragStart;
      dragging = Math.abs(dx) > 6;
      lbSlides.forEach(s => {
        const pos = parseInt(s.dataset.pos);
        s.style.transform = `translateX(calc(${pos * 100}% + ${dx}px))`;
      });
      // Blur progressif sur l'image qui arrive
      const progress  = Math.min(Math.abs(dx) / (W() * 0.45), 1);
      const arriving  = slide(dx < 0 ? 1 : -1);
      const aImg      = arriving.querySelector('img');
      const blur      = 7 * (1 - progress);
      const bright    = 0.4 + 0.6 * progress;
      const sc        = 0.82 + 0.18 * progress;
      aImg.style.filter    = `blur(${blur}px) brightness(${bright})`;
      aImg.style.opacity   = String(0.5 + 0.5 * progress);
      aImg.style.transform = `scale(${sc})`;
    };

    const onEnd = x => {
      if (dragStart === null) return;
      const dx  = x - dragStart;
      const thr = W() * 0.22;
      dragStart = null;

      // Reset inline img styles (CSS classes reprennent le relais)
      lbSlides.forEach(s => {
        const img = s.querySelector('img');
        img.style.filter = img.style.opacity = img.style.transform = '';
      });

      if (Math.abs(dx) > thr) {
        // Compléter le swipe depuis la position actuelle
        const dir = dx < 0 ? 1 : -1;
        lbIdx = (lbIdx + dir + srcs.length) % srcs.length;
        lbBusy = true;

        const recycled = lbSlides.find(s => parseInt(s.dataset.pos) === -dir);
        recycled.style.transition = 'none';
        recycled.style.transform  = `translateX(${dir * W()}px)`;
        recycled.dataset.pos      = String(dir);
        recycled.querySelector('img').src = srcs[(lbIdx + dir + srcs.length) % srcs.length];

        requestAnimationFrame(() => requestAnimationFrame(() => {
          lbSlides.forEach(s => {
            s.style.transition = 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1)';
          });
          recycled.style.transition = '';
          lbSlides.find(s => parseInt(s.dataset.pos) === 0).dataset.pos  = String(-dir);
          lbSlides.find(s => parseInt(s.dataset.pos) === dir).dataset.pos = '0';
          lbCounter.textContent = `${lbIdx + 1} / ${srcs.length}`;
          setTimeout(() => {
            lbSlides.forEach(s => { s.style.transform = s.style.transition = ''; });
            lbBusy = false;
          }, 420);
        }));

      } else {
        // Snap back élastique
        lbSlides.forEach(s => {
          s.style.transition = 'transform 0.48s cubic-bezier(0.34,1.56,0.64,1)';
          s.style.transform  = `translateX(${parseInt(s.dataset.pos) * 100}%)`;
        });
        setTimeout(() => {
          lbSlides.forEach(s => { s.style.transform = s.style.transition = ''; });
        }, 500);
      }
    };

    // Mouse
    lbTrack.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragStart !== null) onMove(e.clientX); });
    window.addEventListener('mouseup',   e => { if (dragStart !== null) onEnd(e.clientX); });

    // Touch
    lbTrack.addEventListener('touchstart', e => { onStart(e.touches[0].clientX); }, { passive: true });
    lb.addEventListener('touchmove', e => {
      if (dragStart !== null && Math.abs(e.touches[0].clientX - dragStart) > 8) e.preventDefault();
      onMove(e.touches[0].clientX);
    }, { passive: false });
    lb.addEventListener('touchend', e => { onEnd(e.changedTouches[0].clientX); });

    lb.addEventListener('click', e => { if (e.target === lb && !dragging) closeLb(); });

    container.querySelectorAll('.projet-img-wrap img').forEach((img, i) => {
      img.addEventListener('click', () => openLb(i));
    });
    lbPrev.addEventListener('click', e => { e.stopPropagation(); lbGo(lbIdx - 1, -1); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); lbGo(lbIdx + 1,  1); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  lbGo(lbIdx - 1, -1);
      if (e.key === 'ArrowRight') lbGo(lbIdx + 1,  1);
    });

    let wheelCooldown = false;
    lb.addEventListener('wheel', e => {
      e.preventDefault();
      if (wheelCooldown) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 30) return;
      wheelCooldown = true;
      d > 0 ? lbGo(lbIdx + 1, 1) : lbGo(lbIdx - 1, -1);
      setTimeout(() => { wheelCooldown = false; }, 520);
    }, { passive: false });
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

  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
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

  /* ── Gallery scroll animation (bidirectional) ── */
  let observerReady = false;

  // Set initial hidden state on all gallery elements
  document.querySelectorAll('.projet-img-wrap, .format-card').forEach(el => {
    gsap.set(el, { opacity: 0, y: 28 });
  });

  const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el    = entry.target;
      const rect  = entry.boundingClientRect;
      const fromBelow = rect.top > 0; // element is below viewport midpoint

      if (entry.isIntersecting) {
        // Entering viewport — elastic bounce in
        gsap.fromTo(el,
          { opacity: 0, y: fromBelow ? 40 : -30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1,
            duration: 0.85,
            ease: 'back.out(1.6)',
            overwrite: 'auto' }
        );
      } else if (observerReady) {
        // Leaving viewport — quick snap out
        if (fromBelow) {
          gsap.to(el, { opacity: 0, y: 40, scale: 0.96, duration: 0.3, ease: 'back.in(1.4)', overwrite: 'auto' });
        } else {
          gsap.to(el, { opacity: 0, y: -30, scale: 0.96, duration: 0.3, ease: 'back.in(1.4)', overwrite: 'auto' });
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.projet-img-wrap, .format-card').forEach(el => {
    scrollObserver.observe(el);
  });

  // Mark observer as ready after initial cycle so load-visible items don't hide
  requestAnimationFrame(() => requestAnimationFrame(() => { observerReady = true; }));

});
