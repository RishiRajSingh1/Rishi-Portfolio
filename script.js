/* ==========================================================================
   RISHI RAJ SINGH — Midnight Campus · script.js
   GSAP + ScrollTrigger + Lenis. Vanilla JS only.
   ========================================================================== */
(() => {
  'use strict';

  // If a CDN script failed to load, show everything statically instead of a blank page.
  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add('no-anim');
    const l = document.getElementById('loader'); l && l.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePtr   = window.matchMedia('(pointer: fine)').matches;
  const isMobile  = window.matchMedia('(max-width: 768px)').matches;
  const isIOS     = /iP(hone|ad|od)/.test(navigator.userAgent);

  /* ----------------------------------------------------------------------
     0. Lenis smooth scroll, synced to GSAP
  ---------------------------------------------------------------------- */
  let lenis = null;
  function initLenis() {
    if (reduced || typeof Lenis === 'undefined') return;   // native scrolling fallback
    lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  function scrollTo(target, opts = {}) {
    document.dispatchEvent(new Event('navscroll:start'));
    const done = () => document.dispatchEvent(new Event('navscroll:done'));
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.6, ...opts, onComplete: done });
    else { const el = typeof target === 'string' ? $(target) : target; el && el.scrollIntoView({ behavior: 'smooth' }); setTimeout(done, 1200); }
  }

  /* ----------------------------------------------------------------------
     1. Text splitter (words, masked)
  ---------------------------------------------------------------------- */
  function splitWords(el) {
    if (el.dataset.split) return $$('.word', el);
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
            const wrap = document.createElement('span'); wrap.className = 'word-wrap';
            const w = document.createElement('span'); w.className = 'word'; w.textContent = tok;
            wrap.appendChild(w); frag.appendChild(wrap);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    el.dataset.split = '1';
    return $$('.word', el);
  }

  /* ----------------------------------------------------------------------
     2. Shared video scrub helper
  ---------------------------------------------------------------------- */
  function videoScrub(video, triggerOpts) {
    if (!video) return;
    const proxy = { t: 0 };
    let ready = false;
    const apply = () => { if (ready && Number.isFinite(video.duration)) { try { video.currentTime = proxy.t * video.duration; } catch (e) {} } };

    const arm = () => {
      ready = true;
      video.pause();
      apply();
    };
    if (video.readyState >= 1) arm(); else video.addEventListener('loadedmetadata', arm, { once: true });

    // iOS Safari scrubbing is unreliable: fall back to autoplay loop
    if (isIOS || reduced) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    gsap.to(proxy, {
      t: 1, ease: 'none',
      scrollTrigger: { scrub: 0.6, ...triggerOpts },
      onUpdate: apply,
    });
  }

  /* ----------------------------------------------------------------------
     3. Loader + Hero
  ---------------------------------------------------------------------- */
  function initHero() {
    const loader = $('#loader');
    const bar = $('.loader__bar span');
    const hero = $('#hero');
    const lines = $$('.hero__title .line');

    // wrap each line's contents so we can mask-reveal
    lines.forEach((l) => { const s = document.createElement('span'); while (l.firstChild) s.appendChild(l.firstChild); l.appendChild(s); });

    const tl = gsap.timeline({ paused: true });
    tl.to(bar, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' })
      .to(loader, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=0.1')
      .set(loader, { display: 'none' })
      .to(lines.map((l) => l.firstChild), { y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.09 }, '-=0.6')
      .add(() => $('.strike') && $('.strike').classList.add('is-struck'), '-=0.9')
      .to('.hero__eyebrow', { opacity: 1, duration: 0.8 }, '-=0.9')
      .to(['.hero__sub', '.hero__actions', '.hero__trust'], { opacity: 1, duration: 0.9, stagger: 0.1 }, '-=0.6')
      .fromTo('.hero__portrait', { opacity: 0, y: 60, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: 'power3.out' }, '-=1.8')
      .from('.chip', { opacity: 0, y: 24, scale: 0.9, duration: 0.9, stagger: 0.12, ease: 'back.out(1.6)' }, '-=1.0')
      .add(() => $('#nav').classList.toggle('is-visible', window.scrollY > innerHeight * 0.8));

    const start = () => tl.play();
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
    setTimeout(start, 2500); // never trap the user behind the loader

    // Floating chips + mouse parallax on the portrait layers
    if (!reduced) {
      $$('.chip').forEach((c, i) => gsap.to(c, { y: i % 2 ? 14 : -14, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 }));
      if (finePtr) {
        const layers = $$('#portrait [data-depth]');
        window.addEventListener('mousemove', (e) => {
          const dx = (e.clientX / innerWidth - 0.5), dy = (e.clientY / innerHeight - 0.5);
          layers.forEach((l) => { const d = parseFloat(l.dataset.depth) * 600; gsap.to(l, { x: dx * d, rotateY: 0, duration: 1.2, ease: 'power2.out', overwrite: 'auto' }); });
          gsap.to('.portrait__glow--lime', { x: dx * -40, y: dy * -30, duration: 1.5 });
        });
      }
      gsap.to('.hero__portrait', { y: '18vh', ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }
    if (!reduced) {
      gsap.to('.hero__copy', { y: '-12vh', opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('#heroScrollLine', { scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  /* ----------------------------------------------------------------------
     4. Stats — odometer counters + marquees
  ---------------------------------------------------------------------- */
  function initStats() {
    $$('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const suf = el.dataset.suffix || '';
      const o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => gsap.to(o, { v: target, duration: 1.8, ease: 'expo.out',
          onUpdate: () => { el.textContent = o.v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; } }),
      });
    });

    // Marquees — velocity-coupled, direction follows scroll
    $$('[data-marquee]').forEach((track) => {
      const base = parseFloat(track.dataset.marqueeSpeed || '40');
      const half = () => track.scrollWidth / 2;
      let x = 0, dir = 1, vel = 0;
      ScrollTrigger.create({ onUpdate: (self) => { vel = self.getVelocity(); dir = vel < 0 ? -1 : 1; } });
      gsap.ticker.add((t, dt) => {
        const boost = Math.min(Math.abs(vel) / 400, 4);
        x -= dir * (base * (1 + boost)) * (dt / 1000);
        const h = half(); if (!h) return;
        if (x <= -h) x += h; if (x > 0) x -= h;
        track.style.transform = `translate3d(${x}px,0,0)`;
        vel *= 0.92;
      });
    });
  }

  /* ----------------------------------------------------------------------
     5. Mission — pinned word-light
  ---------------------------------------------------------------------- */
  function initMission() {
    const text = $('[data-wordlight]');
    const words = splitWords(text);
    if (reduced) { words.forEach((w) => w.classList.add('is-lit')); return; }
    const glow = $('.glow--mission');
    ScrollTrigger.create({
      trigger: text, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: (self) => {
        const n = Math.floor(self.progress * (words.length + 1));
        words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
        const cur = words[Math.min(Math.max(n - 1, 0), words.length - 1)];
        if (cur && glow) {
          const r = cur.getBoundingClientRect();
          gsap.to(glow, { x: r.left + r.width / 2 - innerWidth / 2, y: r.top - innerHeight / 2 + r.height, duration: 0.6, overwrite: true });
        }
      },
    });
  }

  /* ----------------------------------------------------------------------
     6. Pillars — card stack + visuals
  ---------------------------------------------------------------------- */
  function initPillars() {
    const pillars = $$('.pillar');

    // Entrance: each panel fades and rises in once, nothing is pinned or scaled out
    pillars.forEach((p) => ScrollTrigger.create({ trigger: p, start: 'top 70%', once: true, onEnter: () => p.classList.add('is-in') }));

    // Word reveals for all headlines
    $$('.reveal-words').forEach((h) => {
      const words = splitWords(h);
      gsap.to(words, { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.04,
        scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    });

    // 01 Loan lifecycle flow
    const flow = $$('#flow li');
    if (flow.length) ScrollTrigger.create({ trigger: '#flow', start: 'top 80%', once: true, onEnter: () => {
      gsap.to(flow, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', onComplete: () => flow.forEach((li, i) => setTimeout(() => li.classList.add('pulse'), i * 400)) });
    } });

    // 02 Roles matrix + cost bars
    const roleCells = $$('#roles i'), bars = $$('#finBars i');
    if (roleCells.length) ScrollTrigger.create({ trigger: '#roles', start: 'top 80%', once: true, onEnter: () => {
      gsap.to(roleCells, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' });
      gsap.to(bars, { scaleY: 1, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.5 });
    } });

    // 03 Stack grid
    const stack = $$('#stackgrid div');
    if (stack.length) ScrollTrigger.create({ trigger: '#stackgrid', start: 'top 80%', once: true, onEnter: () => {
      gsap.to(stack, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.6)' });
    } });

    // Tilt cards
    if (finePtr && !reduced) {
      $$('.tilt').forEach((wrap) => {
        const card = $('.card', wrap);
        wrap.addEventListener('mousemove', (e) => {
          const r = wrap.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -8, ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
          gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.6, ease: 'power2.out' });
        });
        wrap.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' }));
      });
    }
  }

  /* ----------------------------------------------------------------------
     7. Story — video scrub, beats, timeline, signature
  ---------------------------------------------------------------------- */
  function initStory() {

    const beats = $$('.beat'), dots = $$('.timeline li'), fill = $('#timelineFill');
    beats.forEach((b, i) => {
      ScrollTrigger.create({ trigger: b, start: 'top 75%', once: true,
        onEnter: () => { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }); dots.slice(0, i + 1).forEach((d) => d.classList.add('is-on')); } });
    });
    gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.story__body', start: 'top 60%', end: 'bottom 60%', scrub: true } });

    const sig = $('.signature span');
    if (sig) {
      gsap.to(sig, { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.signature', start: 'top 85%', once: true,
          onEnter: () => dots.forEach((d) => d.classList.add('is-on')) } });
    }
  }

  /* ----------------------------------------------------------------------
     8. Product — dashboard flatten + live tiles
  ---------------------------------------------------------------------- */
  function initGitHub() {
    const langColors = { JavaScript: '#F1E05A', TypeScript: '#3178C6', Java: '#B07219', HTML: '#E34C26', CSS: '#563D7C', Python: '#3572A5', Kotlin: '#A97BFF', Dart: '#00B4AB' };
    const render = (user, repos) => {
      if (user) {
        $('#ghRepos').textContent = user.public_repos; $('#ghFollowers').textContent = user.followers;
        $('#heroRepos').textContent = user.public_repos; $('#statRepos').dataset.count = user.public_repos;
        $('#ghSince').textContent = 'Since ' + new Date(user.created_at).getFullYear();
      }
      if (repos && repos.length) {
        const counts = {}; repos.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
        const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]); const total = entries.reduce((n, e) => n + e[1], 0);
        $('#ghLangs').textContent = entries.length;
        const bar = $('#ghLangBar'); bar.innerHTML = ''; $$('.gh__legend').forEach((el) => el.remove());
        const legend = document.createElement('div'); legend.className = 'gh__legend';
        entries.forEach(([lang, n]) => {
          const i = document.createElement('i'); i.style.width = (n / total * 100) + '%'; i.style.background = langColors[lang] || '#97A3B8'; i.title = `${lang} · ${n}`; bar.appendChild(i);
          const l = document.createElement('span'); l.innerHTML = `<i style="background:${langColors[lang] || '#97A3B8'}"></i>${lang} ${Math.round(n / total * 100)}%`; legend.appendChild(l);
        });
        bar.after(legend);
        gsap.from(bar.children, { scaleX: 0, transformOrigin: 'left', duration: 1.2, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: bar, start: 'top 90%', once: true } });
      }
    };
    // snapshot first (works offline), then live refresh
    Promise.all([fetch('assets/data/github-user.json').then((r) => r.json()), fetch('assets/data/github-repos.json').then((r) => r.json())])
      .then(([u, r]) => render(u, r)).catch(() => {});
    Promise.all([fetch('https://api.github.com/users/RishiRajSingh1').then((r) => r.ok ? r.json() : null), fetch('https://api.github.com/users/RishiRajSingh1/repos?per_page=100').then((r) => r.ok ? r.json() : null)])
      .then(([u, r]) => (u && r) && render(u, r)).catch(() => {});
  }

  /* ----------------------------------------------------------------------
     9. Work — horizontal gallery
  ---------------------------------------------------------------------- */
  function initWork() {
    if (isMobile || reduced) return; // native scroll-snap on mobile
    const track = $('#workTrack'), pin = $('.work__pin');
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top 12%', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
    $$('.wcard').forEach((c) => {
      const s = parseFloat(c.dataset.speed || '1');
      gsap.to(c, { y: (s - 1) * -120, ease: 'none', scrollTrigger: { trigger: pin, start: 'top 12%', end: () => '+=' + dist(), scrub: true } });
    });
  }

  /* ----------------------------------------------------------------------
     10. CTA — video scrub + magnetic
  ---------------------------------------------------------------------- */
  function initCTA() {
    if (!finePtr || reduced) return;
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        gsap.to(btn, { x: gsap.utils.clamp(-24, 24, dx * 0.3), y: gsap.utils.clamp(-24, 24, dy * 0.3), duration: 0.5, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' }));
    });
  }

  /* ----------------------------------------------------------------------
     11. Nav, menu, sound, progress, clock
  ---------------------------------------------------------------------- */
  function initNav() {
    const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
    ScrollTrigger.create({ start: () => innerHeight * 0.8, end: 'max',
      onToggle: (s) => nav.classList.toggle('is-visible', s.isActive) });
    gsap.to('#progressBar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    const closeMenu = () => { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); };
    burger.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', String(!open)); burger.setAttribute('aria-expanded', String(open));
      lenis && (open ? lenis.stop() : lenis.start());
    });
    $$('[data-scroll]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href'); if (!id || !id.startsWith('#')) return;
      e.preventDefault(); closeMenu(); scrollTo(id, { offset: id === '#hero' ? 0 : -80 });
    }));

    // Ambient sound (off by default)
    const audio = $('#ambient'), toggle = $('#soundToggle');
    toggle.addEventListener('click', async () => {
      const on = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', String(on));
      if (on) { audio.volume = 0; try { await audio.play(); gsap.to(audio, { volume: 0.5, duration: 1.5 }); } catch (e) { toggle.setAttribute('aria-pressed', 'false'); } }
      else gsap.to(audio, { volume: 0, duration: 1, onComplete: () => audio.pause() });
    });

    // Local clock
    const clock = $('#clock');
    const tick = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST'; };
    tick(); setInterval(tick, 30000);
  }

  /* ----------------------------------------------------------------------
     12. Cursor + grain
  ---------------------------------------------------------------------- */
  function initCursor() {
    if (!finePtr || reduced) return;
    const c = $('#cursor'), label = $('.cursor__label', c);
    document.body.classList.add('has-cursor');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }, cur = { ...pos };
    window.addEventListener('mousemove', (e) => { pos.x = e.clientX; pos.y = e.clientY; });
    gsap.ticker.add(() => { cur.x += (pos.x - cur.x) * 0.2; cur.y += (pos.y - cur.y) * 0.2; c.style.transform = `translate3d(${cur.x}px,${cur.y}px,0)`; });
    $$('a, button').forEach((el) => { el.addEventListener('mouseenter', () => c.classList.add('is-link')); el.addEventListener('mouseleave', () => c.classList.remove('is-link')); });
    $$('.hero__portrait, .globe, .cine').forEach((el) => {
      el.addEventListener('mouseenter', () => { c.classList.add('is-video'); label.textContent = el.classList.contains('cine') ? 'SCROLL' : el.id === 'globe' ? 'WORLD' : 'HELLO'; });
      el.addEventListener('mouseleave', () => c.classList.remove('is-video'));
    });
  }
  function initGrain() {
    if (reduced) return;
    const g = $('.grain'); let i = 0;
    setInterval(() => { i = (i + 1) % 8; g.style.backgroundPosition = `${(i * 37) % 300}px ${(i * 71) % 300}px`; }, 125);
  }

  /* ----------------------------------------------------------------------
     13. Aurora canvases — drifting blurred blobs, only while on screen
  ---------------------------------------------------------------------- */
  function initAurora() {
    if (reduced) return;
    const palettes = {
      auroraHero:  [[47,120,196,0.55], [25,78,130,0.7], [144,192,54,0.28], [20,40,90,0.8]],
      auroraStory: [[25,78,130,0.6], [47,120,196,0.35], [144,192,54,0.14]],
      auroraCta:   [[25,78,130,0.7], [47,120,196,0.4], [144,192,54,0.2]],
    };
    $$('.aurora').forEach((cv) => {
      const ctx = cv.getContext('2d'); const cols = palettes[cv.id] || palettes.auroraStory;
      const blobs = cols.map((c, i) => ({ c, x: Math.random(), y: Math.random(), r: 0.35 + Math.random() * 0.25, vx: (Math.random() - 0.5) * 0.00025, vy: (Math.random() - 0.5) * 0.0002, ph: i * 1.7 }));
      let w, h, on = false, t = 0;
      const size = () => { const dpr = 0.5; w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr; };
      size(); window.addEventListener('resize', size);
      const draw = () => {
        if (!on) return;
        t += 0.016;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        blobs.forEach((b) => {
          b.x += b.vx + Math.sin(t * 0.3 + b.ph) * 0.0004; b.y += b.vy + Math.cos(t * 0.25 + b.ph) * 0.0003;
          if (b.x < -0.2 || b.x > 1.2) b.vx *= -1; if (b.y < -0.2 || b.y > 1.2) b.vy *= -1;
          const R = b.r * Math.max(w, h);
          const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, R);
          g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.c[3]})`); g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
          ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        });
        requestAnimationFrame(draw);
      };
      new IntersectionObserver(([en]) => { const was = on; on = en.isIntersecting; if (on && !was) draw(); }, { rootMargin: '20%' }).observe(cv);
    });
  }

  /* ----------------------------------------------------------------------
     14. Particles — slow rising motes in the hero
  ---------------------------------------------------------------------- */
  function initParticles() {
    const cv = $('#particles'); if (!cv || reduced) return;
    const ctx = cv.getContext('2d'); let w, h, on = false;
    const N = isMobile ? 30 : 70;
    const ps = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6, v: 0.00015 + Math.random() * 0.0004, a: 0.15 + Math.random() * 0.5, lime: Math.random() < 0.18 }));
    const size = () => { w = cv.width = cv.clientWidth; h = cv.height = cv.clientHeight; };
    size(); window.addEventListener('resize', size);
    const draw = () => {
      if (!on) return;
      ctx.clearRect(0, 0, w, h);
      ps.forEach((p) => {
        p.y -= p.v; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.lime ? `rgba(144,192,54,${p.a})` : `rgba(180,205,240,${p.a * 0.7})`; ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    new IntersectionObserver(([en]) => { const was = on; on = en.isIntersecting; if (on && !was) draw(); }).observe(cv);
  }

  /* ----------------------------------------------------------------------
     15. Globe — rotating dotted sphere with pulsing school pins
  ---------------------------------------------------------------------- */
  function initGlobe() {
    const cv = $('#globe'); if (!cv) return;
    const ctx = cv.getContext('2d'); let w, h, on = false, rot = 0;
    const dots = [];
    const N = isMobile ? 900 : 1800;
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; dots.push([r * Math.cos(th), y, r * Math.sin(th)]); }
    const pins = [[28.6, 77.2], [19.1, 72.9], [12.9, 77.6], [22.6, 88.4], [25.3, 55.3], [1.35, 103.8], [-1.3, 36.8], [51.5, -0.1], [40.7, -74], [23.8, 90.4], [27.7, 85.3], [6.5, 3.4]]
      .map(([lat, lon]) => { const la = lat * Math.PI / 180, lo = lon * Math.PI / 180; return { p: [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)], ph: Math.random() * 6 }; });
    const size = () => { const dpr = Math.min(devicePixelRatio, 1.5); w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr; };
    size(); window.addEventListener('resize', size);
    const proj = ([x, y, z]) => { const c = Math.cos(rot), s = Math.sin(rot); const X = x * c - z * s, Z = x * s + z * c; return [X, y, Z]; };
    let t = 0;
    const draw = () => {
      if (!on) return;
      t += 0.016; rot += reduced ? 0 : 0.0018;
      ctx.clearRect(0, 0, w, h);
      const R = w * 0.42, cx = w / 2, cy = h / 2;
      const tilt = -0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
      const view = (p) => { const [X, y, Z] = proj(p); const Y = y * ct - Z * st, Z2 = y * st + Z * ct; return [cx + X * R, cy - Y * R, Z2]; };
      dots.forEach((d) => { const [x, y, z] = view(d); if (z < -0.05) return; const a = 0.12 + (z + 0.05) * 0.55; ctx.beginPath(); ctx.arc(x, y, 1.1 + z * 0.9, 0, 6.283); ctx.fillStyle = `rgba(130,180,240,${a})`; ctx.fill(); });
      pins.forEach((pin) => { const [x, y, z] = view(pin.p); if (z < 0) return; const k = (Math.sin(t * 2 + pin.ph) + 1) / 2;
        ctx.beginPath(); ctx.arc(x, y, 3 + z * 2, 0, 6.283); ctx.fillStyle = `rgba(144,192,54,${0.6 + z * 0.4})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 6 + k * 14, 0, 6.283); ctx.strokeStyle = `rgba(144,192,54,${(1 - k) * 0.6 * z})`; ctx.lineWidth = 1.2; ctx.stroke(); });
      requestAnimationFrame(draw);
    };
    new IntersectionObserver(([en]) => { const was = on; on = en.isIntersecting; if (on && !was) draw(); }, { rootMargin: '10%' }).observe(cv);
  }

  /* ----------------------------------------------------------------------
     15b. Scene videos — optional. If the files exist they fade in behind the
     canvas layers and scrub with scroll; if not, they are removed silently.
  ---------------------------------------------------------------------- */
  function initSceneVideos() {
    $$('.scene-video').forEach((v) => {
      const section = v.closest('section');
      const srcs = $$('source', v); const last = srcs[srcs.length - 1];
      last.addEventListener('error', () => v.remove());
      v.addEventListener('loadedmetadata', () => {
        section.classList.add('has-video');
        const scene = v.dataset.scene;
        if (scene === 'scene-01-hero') v.play().catch(() => {});
      }, { once: true });
      v.load();
    });
  }

  /* ----------------------------------------------------------------------
     15c. Cinematic interludes — pin the section, scrub the whole clip
     across 200vh of scroll. Nothing is layered on top; the nav hides too.
  ---------------------------------------------------------------------- */
  function initCine() {
    const nav = $('#nav'), html = document.documentElement;
    const block = (e) => { e.preventDefault(); };
    const keys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
    const blockKeys = (e) => { if (keys.has(e.key)) e.preventDefault(); };
    const lock = (on) => {
      if (lenis) on ? lenis.stop() : lenis.start();
      html.style.overflow = on ? 'hidden' : ''; html.style.touchAction = on ? 'none' : '';
      document.body.style.overscrollBehavior = on ? 'none' : '';
      const m = on ? 'addEventListener' : 'removeEventListener';
      window[m]('touchmove', block, { passive: false }); window[m]('wheel', block, { passive: false }); window[m]('keydown', blockKeys);
      nav.classList.toggle('is-hidden', on);
    };
    // reduced-motion viewers: skip the cinematic interludes entirely
    if (reduced) { $$('.cine').forEach((sec) => sec.remove()); return; }
    let navScroll = false;
    document.addEventListener('navscroll:start', () => { navScroll = true; });
    document.addEventListener('navscroll:done', () => { navScroll = false; });
    const jumpTo = (y) => { if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); };

    $$('.cine').forEach((sec) => {
      const v = $('video', sec);
      const srcs = $$('source', v); srcs[srcs.length - 1].addEventListener('error', () => sec.remove());
      const rate = parseFloat(sec.dataset.rate || '2');
      const next = sec.nextElementSibling;
      let trigger, watcher, timer, state = 'armed';
      v.load();

      // Viewer jumped past the clip (nav link, fast scroll): remove it without playing,
      // shifting the scroll position so what is on screen does not move.
      const silentCollapse = () => {
        if (state !== 'armed') return; state = 'collapsed';
        trigger && trigger.kill();
        const keep = Math.max(0, window.scrollY - sec.offsetHeight);
        sec.style.display = 'none';
        lenis && lenis.resize(); ScrollTrigger.sort(); ScrollTrigger.refresh();
        jumpTo(keep);
        watcher = next && ScrollTrigger.create({ trigger: next, start: 'top bottom', onLeaveBack: restore });
      };
      const passed = () => sec.getBoundingClientRect().bottom < innerHeight * 0.5;   // mostly above the fold
      document.addEventListener('navscroll:done', () => { if (state === 'armed' && passed()) silentCollapse(); });

      // Section reaches the top → snap to it, lock scrolling, play the clip through once.
      const begin = () => {
        if (state !== 'armed' || navScroll) return;
        if (passed()) return silentCollapse();
        state = 'playing';
        if (lenis) lenis.scrollTo(sec, { immediate: true, force: true }); else sec.scrollIntoView();
        lock(true);
        v.playbackRate = rate;
        try { v.currentTime = 0; } catch (e) {}
        v.play().catch(finish);
        clearTimeout(timer); timer = setTimeout(finish, (Number.isFinite(v.duration) ? v.duration / rate : 6) * 1000 + 1500); // never trap the viewer
      };

      // Clip ended → fade the section out, drop it from the page (the next section now
      // sits exactly where the viewer is looking) and release scrolling.
      const finish = () => {
        if (state !== 'playing') return; state = 'finishing';
        clearTimeout(timer); v.pause();
        trigger && trigger.kill();
        gsap.to(sec, { opacity: 0, duration: 0.7, ease: 'power2.inOut', onComplete: () => {
          // the clip filled the viewport from its top edge, so removing it leaves the
          // next section exactly where the viewer is looking — no scroll change needed
          const keep = window.scrollY;
          sec.style.display = 'none';
          lenis && lenis.resize();
          ScrollTrigger.sort(); ScrollTrigger.refresh();
          jumpTo(keep);
          lock(false); state = 'collapsed';
          // re-arm only once the viewer has scrolled back above where the clip lives
          watcher = next && ScrollTrigger.create({ trigger: next, start: 'top bottom', onLeaveBack: restore });
        } });
      };
      const restore = () => {
        if (state !== 'collapsed') return; state = 'armed';
        watcher && watcher.kill();
        try { v.currentTime = 0; } catch (e) {}
        sec.style.display = ''; gsap.set(sec, { opacity: 1 });
        arm(); ScrollTrigger.sort(); ScrollTrigger.refresh();
      };
      const arm = () => { trigger = ScrollTrigger.create({ trigger: sec, start: 'top top', onEnter: begin }); };
      v.addEventListener('ended', finish);
      arm();
    });
  }

  /* ----------------------------------------------------------------------
     15d. Theme — dark / light, remembered per viewer
  ---------------------------------------------------------------------- */
  function initTheme() {
    const root = document.documentElement, btn = $('#themeToggle');
    const set = (t, save) => { root.setAttribute('data-theme', t); if (save) { try { localStorage.setItem('theme', t); } catch (e) {} } };
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.classList.add('theming'); set(next, true); setTimeout(() => root.classList.remove('theming'), 700);
    });
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => { try { if (!localStorage.getItem('theme')) set(e.matches ? 'light' : 'dark', false); } catch (err) {} });
  }

  /* ----------------------------------------------------------------------
     16. Video lifecycle — pause off-screen, play on-screen (iOS path)
  ---------------------------------------------------------------------- */
  function initVideoLifecycle() {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) { if (v.loop) v.play().catch(() => {}); }
      else v.pause();
    }), { rootMargin: '50% 0px' });
    $$('video:not(.cine__video)').forEach((v) => io.observe(v));
  }

  /* ----------------------------------------------------------------------
     Boot
  ---------------------------------------------------------------------- */
  function boot() {
    initLenis();
    initHero();
    initStats();
    initMission();
    initPillars();
    initStory();
    initGitHub();
    initWork();
    initCTA();
    initNav();
    initCursor();
    initGrain();
    initAurora();
    initParticles();
    initGlobe();
    initSceneVideos();
    initCine();
    initTheme();
    initVideoLifecycle();
    // pins created out of DOM order (cinematic interludes) must refresh in position order
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener('load', () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
