/* =========================================================
   RaimiOS — window manager, shell and apps
   ========================================================= */
(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => matchMedia('(max-width: 768px)').matches;
  const isTouch = () => matchMedia('(hover: none)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = '') =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  const tile = (app, size = '') =>
    `<span class="tile ${size}" style="--c:${app.color};${app.glyph ? `--g:${app.glyph}` : ''}">${icon(app.icon)}</span>`;
  const thumb = (p, tag = 'div') =>
    `<${tag} class="ex-thumb${p.image ? ' has-img' : ''}" style="--c:${p.color}">${
      p.image
        ? `<img src="${esc(p.image)}" alt="Screenshot of ${esc(p.name)}" loading="lazy" decoding="async">`
        : icon(p.type === 'work' ? 'layers' : 'code')
    }${p.link ? '<span class="ex-live">Live</span>' : ''}</${tag}>`;
  let logoN = 0;
  const RA_R = 'M303 362H490C527 362 556 394 556 434C556 474 527 506 490 506H418L528 607H470L342 468H490C505 468 516 453 516 434C516 415 505 402 490 402H303Z';
  const RA_A = 'M592 368H604L733 607H686L600 448L528 580L502 555Z';
  const logo = (cls = '') => {
    const id = 'ra-cut-' + logoN++;
    return `<svg class="ra-logo ${cls}" viewBox="290 350 460 270" fill="currentColor" role="img" aria-label="RA logo"><defs><mask id="${id}"><rect x="290" y="350" width="460" height="270" fill="#fff"/><path d="${RA_A}" fill="#000" stroke="#000" stroke-width="16" stroke-linejoin="round"/></mask></defs><path class="ra-r" mask="url(#${id})" d="${RA_R}"/><path class="ra-a" d="${RA_A}"/></svg>`;
  };
  const avatarHTML = () => (PROFILE.photo ? `<img src="${esc(PROFILE.photo)}" alt="${esc(PROFILE.name)}">` : logo('in-avatar'));
  const anim = (el, frames, opts) => (reduceMotion || !el.animate ? { finished: Promise.resolve(), cancel() {} } : el.animate(frames, opts));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- apps ---------- */
  const APPS = {
    about: { title: 'About Me', icon: 'user', color: '#F7CBCA', w: 760, h: 580, render: renderAbout },
    skills: { title: 'Skills', icon: 'sparkles', color: '#B0D7D8', w: 860, h: 600, render: renderSkills },
    experience: { title: 'Experience', icon: 'briefcase', color: '#D5E5E5', w: 800, h: 620, render: renderExperience },
    trainings: { title: 'Trainings & Events', icon: 'presentation', color: '#F7CBCA', w: 1000, h: 660, render: renderTrainings, flush: true },
    projects: { title: 'Projects', icon: 'folder', color: '#F7CBCA', w: 980, h: 620, render: renderProjects, flush: true },
    education: { title: 'Education', icon: 'cap', color: '#DDD3D3', w: 640, h: 440, render: renderEducation },
    certs: { title: 'Certificates', icon: 'award', color: '#B0D7D8', w: 640, h: 460, render: renderCerts },
    contact: { title: 'Contact', icon: 'mail', color: '#F7CBCA', w: 820, h: 580, render: renderContact },
    resume: { title: 'Resume.pdf', icon: 'file', color: '#F1F7F7', w: 780, h: 680, render: renderResume, flush: true },
    terminal: { title: 'Terminal', icon: 'terminal', color: '#5D6B6B', glyph: '#F7CBCA', w: 720, h: 460, render: renderTerminal, flush: true, dark: true },
  };
  const DESKTOP_ORDER = ['about', 'skills', 'experience', 'trainings', 'projects', 'education', 'certs', 'contact', 'resume', 'terminal'];
  const PINNED = ['about', 'projects', 'experience', 'trainings', 'skills', 'terminal', 'contact'];
  const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const GALLERY_TYPES = { all: 'All photos', community: 'Community training', public: 'Public sector', events: 'Events & booths' };

  /* =========================================================
     Static text fill
     ========================================================= */
  function fillStatic() {
    $$('[data-text]').forEach((el) => (el.textContent = PROFILE[el.dataset.text] || ''));
    $$('[data-avatar]').forEach((el) => (el.innerHTML = avatarHTML()));
    $$('[data-icon]').forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
    $$('[data-logo]').forEach((el) => (el.innerHTML = logo()));

    // Hero title split into animated characters
    const words = PROFILE.name.split(' ');
    let d = 0;
    $('#heroTitle').innerHTML = words
      .map((w, wi) => {
        const chars = [...w].map((c) => `<span class="ch" style="--d:${d++}">${esc(c)}</span>`).join('');
        return `<span class="word">${wi === words.length - 1 ? `<em>${chars}</em>` : chars}</span>`;
      })
      .join(' ');
    $('#heroRoles').innerHTML = PROFILE.roles.map((r) => `<span>${esc(r)}</span>`).join('');
    $('#stats').innerHTML = STATS.map((s, i) => (i ? '<i></i>' : '') + `<span>${esc(s)}</span>`).join('');

    // Scene buttons
    $('#heroScenes').innerHTML = SCENES.map((s, i) => `<button data-scene="${i}" aria-pressed="false">${esc(s.label)}</button>`).join('');
    $('#sfGrid').innerHTML = SCENES.map(
      (s, i) => `<button class="sf-item" data-scene="${i}"><span style="--sw:${s.swatch}"></span><b>${esc(s.label)}</b></button>`
    ).join('');

    // Desktop icons
    $('#icons').innerHTML = DESKTOP_ORDER.map((id, i) => {
      const a = APPS[id];
      return `<button class="d-icon" role="listitem" data-icon-app="${id}" style="--i:${i}" aria-label="Open ${esc(a.title)}">${tile(a)}<span>${esc(a.title)}</span></button>`;
    }).join('');

    // Start menu
    $('#smGrid').innerHTML = DESKTOP_ORDER.map(
      (id, i) => `<button class="sm-app" data-open="${id}" style="--i:${i}">${tile(APPS[id], 'md')}<span>${esc(APPS[id].title)}</span></button>`
    ).join('');
    const rec = [
      { open: 'resume', t: 'Resume.pdf', s: 'Updated November 2026', app: APPS.resume },
      { project: 'msme-ai', t: 'MSME AI Chatbot', s: 'Projects › Work', app: APPS.projects },
      { open: 'trainings', t: 'Trainings & Events', s: `${TRAININGS.length} sessions · ${GALLERY.length} photos`, app: APPS.trainings },
      { open: 'contact', t: 'Get in touch', s: 'Contact', app: APPS.contact },
    ];
    $('#smRec').innerHTML = rec
      .map(
        (r, i) =>
          `<button class="sm-rec-item" style="--i:${i + 9}" ${r.open ? `data-open="${r.open}"` : `data-project="${r.project}"`}>${tile(r.app, 'md')}<span><b>${esc(r.t)}</b><small>${esc(r.s)}</small></span></button>`
      )
      .join('');
  }

  /* =========================================================
     Scenes (video wallpaper)
     ========================================================= */
  const Scenes = {
    idx: 0,
    busy: false,
    vids: [],
    init() {
      let saved = 0;
      try { saved = +localStorage.getItem('scene') || 0; } catch (e) {}
      if (!SCENES[saved]) saved = 0;
      this.idx = saved;
      const box = $('#scenes');
      SCENES.forEach((s, i) => {
        const v = document.createElement('video');
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.preload = i === saved ? 'auto' : 'none';
        v.className = 'scene' + (i === saved ? ' active' : '');
        if (i === saved) { v.src = s.src; v.autoplay = true; }
        box.appendChild(v);
        this.vids.push(v);
      });
      const first = this.vids[saved];
      first.play().catch(() => {});
      // Warm up the other scenes after the first one is playing
      first.addEventListener('canplay', () => setTimeout(() => this.vids.forEach((v, i) => {
        if (!v.getAttribute('src')) { v.src = SCENES[i].src; v.preload = 'auto'; v.load(); }
      }), 4000), { once: true });

      const img = $('#overlayImg');
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.src = OVERLAY_IMG;
      this.sync();
    },
    set(i) {
      i = +i;
      if (i === this.idx || this.busy || !SCENES[i]) return;
      this.busy = true;
      const v = this.vids[i];
      if (!v.getAttribute('src')) v.src = SCENES[i].src;
      let done = false;
      const go = () => {
        if (done) return;
        done = true;
        v.play().catch(() => {});
        const prev = this.vids[this.idx];
        prev.classList.remove('active');
        v.classList.add('active');
        this.idx = i;
        this.sync();
        try { localStorage.setItem('scene', i); } catch (e) {}
        setTimeout(() => { prev.pause(); this.busy = false; }, 1000);
      };
      if (v.readyState >= 3) go();
      else { v.addEventListener('canplay', go, { once: true }); v.load(); setTimeout(go, 2500); }
    },
    next() { this.set((this.idx + 1) % SCENES.length); },
    sync() {
      body.classList.toggle('scene-dark', !!SCENES[this.idx].darkText);
      $$('[data-scene]').forEach((b) => {
        const on = +b.dataset.scene === this.idx;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on);
      });
      const lbl = $('#tbScene');
      if (lbl) lbl.textContent = SCENES[this.idx].label;
    },
  };

  /* =========================================================
     Window manager
     ========================================================= */
  const WM = {
    wins: new Map(),
    z: 10,
    top: null,
    cascade: 0,
    area() { return $('#windows').getBoundingClientRect(); },

    open(id, originEl) {
      const app = APPS[id];
      if (!app) return null;
      Flyouts.closeAll();
      const existing = this.wins.get(id);
      if (existing) {
        if (existing.min) this.restore(id);
        else { this.focus(id); this.attention(existing.el); }
        return existing;
      }

      const el = document.createElement('section');
      el.className = 'win' + (app.dark ? ' dark' : '');
      el.dataset.app = id;
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', app.title);
      el.tabIndex = -1;
      el.innerHTML = `
        <header class="win-bar">
          <div class="win-title">${tile(app, 'sm')}<span>${esc(app.title)}</span></div>
          <div class="win-ctrls">
            <button class="wc min" aria-label="Minimise">${icon('minus')}</button>
            <button class="wc max" aria-label="Maximise">${icon('square')}</button>
            <button class="wc close" aria-label="Close">${icon('x')}</button>
          </div>
        </header>
        <div class="win-body${app.flush ? ' flush' : ''}"></div>
        <div class="win-resize" aria-hidden="true"></div>`;

      const A = this.area();
      const W = Math.min(app.w, A.width - 40);
      const H = Math.min(app.h, A.height - 30);
      const off = (this.cascade++ % 6) * 30;
      const x = Math.max(12, Math.min((A.width - W) / 2 + 40 + off - 90, A.width - W - 12));
      const y = Math.max(10, Math.min((A.height - H) / 2 - 10 + off - 60, A.height - H - 10));
      Object.assign(el.style, { left: x + 'px', top: y + 'px', width: W + 'px', height: H + 'px' });
      $('#windows').appendChild(el);

      const w = { id, el, min: false, max: false, snap: null, api: {} };
      this.wins.set(id, w);
      app.render($('.win-body', el), w);
      this.bind(w);
      if (isMobile()) this.setMax(w, true, false);
      this.focus(id);
      Taskbar.render();
      Taskbar.bounce(id);

      // Open animation: grow out of the icon that launched it
      let from = 'translateY(24px) scale(.92)';
      if (originEl && originEl.getBoundingClientRect) {
        const o = originEl.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const dx = o.left + o.width / 2 - (r.left + r.width / 2);
        const dy = o.top + o.height / 2 - (r.top + r.height / 2);
        from = `translate(${dx}px, ${dy}px) scale(.12)`;
      }
      anim(el, [
        { opacity: 0, transform: from, borderRadius: '40px' },
        { opacity: 1, offset: 0.45 },
        { opacity: 1, transform: 'none', borderRadius: getComputedStyle(el).borderRadius },
      ], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
      return w;
    },

    bind(w) {
      const { el, id } = w;
      const bar = $('.win-bar', el);
      el.addEventListener('pointerdown', () => this.focus(id), true);
      $('.wc.close', el).addEventListener('click', () => this.close(id));
      $('.wc.min', el).addEventListener('click', () => this.minimize(id));
      $('.wc.max', el).addEventListener('click', () => this.setMax(w, !w.max, true));
      bar.addEventListener('dblclick', (e) => { if (!e.target.closest('.wc') && !isMobile()) this.setMax(w, !w.max, true); });

      // Drag + snap
      bar.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('.wc') || isMobile()) return;
        const A = this.area();
        const sx = e.clientX, sy = e.clientY;
        let r = el.getBoundingClientRect();
        let ox = sx - r.left, oy = sy - r.top;
        let moved = false, snap = null;
        bar.setPointerCapture(e.pointerId);

        const move = (ev) => {
          if (!moved) {
            if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
            moved = true;
            el.classList.add('dragging');
            if (w.max) {
              const ratio = ox / r.width;
              this.setMax(w, false, false);
              r = el.getBoundingClientRect();
              ox = r.width * ratio; oy = 22;
            } else if (w.snap) {
              const ratio = ox / r.width;
              el.style.width = w.snap.w + 'px';
              el.style.height = w.snap.h + 'px';
              w.snap = null;
              r = el.getBoundingClientRect();
              ox = r.width * ratio; oy = 22;
            }
          }
          let x = ev.clientX - A.left - ox;
          let y = ev.clientY - A.top - oy;
          x = Math.max(-r.width + 100, Math.min(x, A.width - 100));
          y = Math.max(0, Math.min(y, A.height - 44));
          el.style.left = x + 'px';
          el.style.top = y + 'px';
          const px = ev.clientX - A.left, py = ev.clientY - A.top;
          snap = py <= 2 ? 'max' : px <= 2 ? 'left' : px >= A.width - 3 ? 'right' : null;
          Snap.show(snap, A);
        };
        const up = () => {
          bar.removeEventListener('pointermove', move);
          bar.removeEventListener('pointerup', up);
          bar.removeEventListener('pointercancel', up);
          el.classList.remove('dragging');
          Snap.show(null);
          if (!moved) return;
          if (snap === 'max') this.setMax(w, true, true);
          else if (snap) {
            w.snap = { w: el.offsetWidth, h: el.offsetHeight };
            el.classList.add('anim');
            Object.assign(el.style, {
              left: (snap === 'left' ? 0 : A.width / 2) + 'px', top: '0px',
              width: A.width / 2 + 'px', height: A.height + 'px',
            });
            setTimeout(() => el.classList.remove('anim'), 340);
          }
        };
        bar.addEventListener('pointermove', move);
        bar.addEventListener('pointerup', up);
        bar.addEventListener('pointercancel', up);
      });

      // Resize
      const grip = $('.win-resize', el);
      grip.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        grip.setPointerCapture(e.pointerId);
        const sx = e.clientX, sy = e.clientY, sw = el.offsetWidth, sh = el.offsetHeight;
        const A = this.area();
        el.classList.add('dragging');
        w.snap = null;
        const move = (ev) => {
          el.style.width = Math.max(340, Math.min(sw + ev.clientX - sx, A.width - el.offsetLeft)) + 'px';
          el.style.height = Math.max(260, Math.min(sh + ev.clientY - sy, A.height - el.offsetTop)) + 'px';
        };
        const up = () => {
          el.classList.remove('dragging');
          grip.removeEventListener('pointermove', move);
          grip.removeEventListener('pointerup', up);
          grip.removeEventListener('pointercancel', up);
        };
        grip.addEventListener('pointermove', move);
        grip.addEventListener('pointerup', up);
        grip.addEventListener('pointercancel', up);
      });
    },

    focus(id) {
      const w = this.wins.get(id);
      if (!w) return;
      if (this.top !== id) {
        w.el.style.zIndex = ++this.z;
        this.top = id;
      }
      this.wins.forEach((o) => o.el.classList.toggle('focused', o.id === id));
      Taskbar.render();
    },

    topVisible() {
      let best = null;
      this.wins.forEach((w) => { if (!w.min && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w; });
      return best;
    },

    setMax(w, on, animate) {
      w.max = on;
      if (animate && !reduceMotion) {
        w.el.classList.add('anim');
        setTimeout(() => w.el.classList.remove('anim'), 340);
      }
      w.el.classList.toggle('max', on);
      const b = $('.wc.max', w.el);
      b.innerHTML = icon(on ? 'restore' : 'square');
      b.setAttribute('aria-label', on ? 'Restore' : 'Maximise');
    },

    async close(id) {
      const w = this.wins.get(id);
      if (!w || w.closing) return;
      w.closing = true;
      w.api.onClose && w.api.onClose();
      await anim(w.el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.94) translateY(8px)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' }).finished;
      w.el.remove();
      this.wins.delete(id);
      if (this.top === id) {
        this.top = null;
        const next = this.topVisible();
        if (next) this.focus(next.id);
      }
      Taskbar.render();
    },

    async minimize(id) {
      const w = this.wins.get(id);
      if (!w || w.min) return;
      const target = $(`.tb-app[data-app="${id}"]`);
      const r = w.el.getBoundingClientRect();
      let to = 'translateY(60px) scale(.3)';
      if (target) {
        const t = target.getBoundingClientRect();
        to = `translate(${t.left + t.width / 2 - (r.left + r.width / 2)}px, ${t.top + t.height / 2 - (r.top + r.height / 2)}px) scale(.08)`;
      }
      w.min = true;
      const a = anim(w.el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: to }], { duration: 380, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
      await a.finished;
      w.el.classList.add('minimized');
      a.cancel();
      if (this.top === id) {
        this.top = null;
        w.el.classList.remove('focused');
        const next = this.topVisible();
        if (next) this.focus(next.id);
      }
      Taskbar.render();
    },

    restore(id) {
      const w = this.wins.get(id);
      if (!w) return;
      const target = $(`.tb-app[data-app="${id}"]`);
      w.min = false;
      w.el.classList.remove('minimized');
      this.focus(id);
      const r = w.el.getBoundingClientRect();
      let from = 'translateY(60px) scale(.3)';
      if (target) {
        const t = target.getBoundingClientRect();
        from = `translate(${t.left + t.width / 2 - (r.left + r.width / 2)}px, ${t.top + t.height / 2 - (r.top + r.height / 2)}px) scale(.08)`;
      }
      anim(w.el, [{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' });
    },

    toggleFromTaskbar(id, el) {
      const w = this.wins.get(id);
      if (!w) return this.open(id, el);
      if (w.min) return this.restore(id);
      if (this.top === id) return this.minimize(id);
      this.focus(id);
    },

    attention(el) {
      anim(el, [{ transform: 'none' }, { transform: 'scale(1.015)' }, { transform: 'none' }], { duration: 300, easing: 'ease-out' });
    },

    closeAll() { [...this.wins.keys()].forEach((id) => this.close(id)); },
  };

  const Snap = {
    show(kind, A) {
      const el = $('#snapPreview');
      if (!kind) { el.classList.remove('show'); return; }
      const g = 8;
      const rect = kind === 'max'
        ? { left: g, top: g, width: A.width - g * 2, height: A.height - g * 2 }
        : { left: kind === 'left' ? g : A.width / 2 + g / 2, top: g, width: A.width / 2 - g * 1.5, height: A.height - g * 2 };
      Object.assign(el.style, { left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px', height: rect.height + 'px' });
      el.classList.add('show');
    },
  };

  /* =========================================================
     Taskbar
     ========================================================= */
  const Taskbar = {
    render() {
      const ids = [...PINNED, ...[...WM.wins.keys()].filter((k) => !PINNED.includes(k))];
      const box = $('#tbApps');
      // Reuse buttons so CSS transitions on the indicator can play
      const existing = new Map($$('.tb-app', box).map((b) => [b.dataset.app, b]));
      ids.forEach((id) => {
        let b = existing.get(id);
        if (!b) {
          const a = APPS[id];
          b = document.createElement('button');
          b.className = 'tb-app reveal';
          b.dataset.app = id;
          b.setAttribute('aria-label', a.title);
          b.innerHTML = `${tile(a)}<i class="tb-dot"></i><span class="tb-tip">${esc(a.title)}</span>`;
        }
        box.appendChild(b);
        existing.delete(id);
        const w = WM.wins.get(id);
        b.classList.toggle('open', !!w);
        b.classList.toggle('active', !!w && !w.min && WM.top === id);
      });
      existing.forEach((b) => b.remove());
    },
    bounce(id) {
      const b = $(`.tb-app[data-app="${id}"]`);
      if (!b) return;
      b.classList.remove('bounce');
      void b.offsetWidth;
      b.classList.add('bounce');
    },
  };

  /* =========================================================
     Clock + calendar
     ========================================================= */
  const Clock = {
    tick() {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const date = now.toLocaleDateString('en-GB');
      $('#tbTime').textContent = time;
      $('#tbDate').textContent = date;
      $('#lockTime').textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      $('#lockDate').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    },
    start() { this.tick(); setInterval(() => this.tick(), 1000); },
    renderCal() {
      const now = new Date();
      $('#calNow').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      const y = now.getFullYear(), m = now.getMonth();
      const first = new Date(y, m, 1);
      const startDow = (first.getDay() + 6) % 7; // Monday first
      const days = new Date(y, m + 1, 0).getDate();
      const prevDays = new Date(y, m, 0).getDate();
      let cells = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => `<div class="dow">${d}</div>`).join('');
      for (let i = startDow; i > 0; i--) cells += `<div class="d mute">${prevDays - i + 1}</div>`;
      for (let d = 1; d <= days; d++) cells += `<div class="d${d === now.getDate() ? ' today' : ''}">${d}</div>`;
      const total = startDow + days;
      for (let d = 1; d <= (7 - (total % 7)) % 7; d++) cells += `<div class="d mute">${d}</div>`;
      $('#cal').innerHTML = `<div class="cal-head"><span>${now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>${icon('calendar')}</div><div class="cal-grid">${cells}</div>`;
    },
  };

  /* =========================================================
     Flyouts, start menu, search, context menu
     ========================================================= */
  const Flyouts = {
    toggle(id) {
      const el = $('#' + id);
      const open = !el.classList.contains('open');
      this.closeAll();
      if (open) {
        if (id === 'calFlyout') Clock.renderCal();
        el.classList.add('open');
        if (id === 'startMenu') {
          $('#startBtn').classList.add('on');
          const s = $('#smSearch');
          s.value = '';
          Search.run('');
          setTimeout(() => !isTouch() && s.focus(), 60);
        }
      }
      return open;
    },
    closeAll() {
      $$('.flyout.open').forEach((f) => f.classList.remove('open'));
      $('#startBtn').classList.remove('on');
      Ctx.close();
    },
  };

  const Search = {
    run(q) {
      q = q.trim().toLowerCase();
      const res = $('#smResults'), bodyEl = $('#smBody');
      if (!q) { res.hidden = true; bodyEl.hidden = false; return; }
      bodyEl.hidden = true;
      res.hidden = false;
      const apps = DESKTOP_ORDER.filter((id) => APPS[id].title.toLowerCase().includes(q));
      const projects = PROJECTS.filter((p) => (p.name + ' ' + p.tags.join(' ') + ' ' + p.summary).toLowerCase().includes(q));
      const skills = [];
      SKILLS.forEach((g) => g.items.forEach((s) => { if (s.toLowerCase().includes(q) || g.group.toLowerCase().includes(q)) skills.push({ s, g: g.group }); }));
      let html = '';
      let i = 0;
      if (apps.length) html += `<div class="sm-group">Apps</div>` + apps.map((id) => `<button class="sm-rec-item" style="--i:${i++}" data-open="${id}">${tile(APPS[id], 'md')}<span><b>${esc(APPS[id].title)}</b><small>App</small></span></button>`).join('');
      if (projects.length) html += `<div class="sm-group">Projects</div>` + projects.map((p) => `<button class="sm-rec-item" style="--i:${i++}" data-project="${p.id}">${tile({ ...APPS.projects, color: p.color }, 'md')}<span><b>${esc(p.name)}</b><small>${esc(p.type === 'work' ? 'Work project' : 'Academic project')}</small></span></button>`).join('');
      const trs = TRAININGS.filter((t) => (t.programme + ' ' + t.venue + ' ' + t.place + ' trainer training nadi').toLowerCase().includes(q));
      if (trs.length) html += `<div class="sm-group">Trainings</div>` + trs.map((t) => `<button class="sm-rec-item" style="--i:${i++}" data-open="trainings">${tile(APPS.trainings, 'md')}<span><b>${esc(t.venue)}</b><small>${esc(t.programme)} · ${esc(fmtDate(t.date))}</small></span></button>`).join('');
      if (skills.length) html += `<div class="sm-group">Skills</div>` + skills.slice(0, 8).map((k) => `<button class="sm-rec-item" style="--i:${i++}" data-open="skills">${tile(APPS.skills, 'md')}<span><b>${esc(k.s)}</b><small>${esc(k.g)}</small></span></button>`).join('');
      res.innerHTML = html || `<div class="sm-none">No results for “${esc(q)}”</div>`;
    },
  };

  const Ctx = {
    open(x, y) {
      const m = $('#contextMenu');
      m.innerHTML = `
        <div class="cm-label">Wallpaper</div>
        ${SCENES.map((s, i) => `<button class="cm-item" data-scene="${i}">${icon('image')}${esc(s.label)}${i === Scenes.idx ? '<kbd>✓</kbd>' : ''}</button>`).join('')}
        <div class="cm-sep"></div>
        <button class="cm-item" data-action="refresh">${icon('refresh')}Refresh<kbd>F5</kbd></button>
        <button class="cm-item" data-open="terminal">${icon('terminal')}Open in Terminal</button>
        <button class="cm-item" data-action="simple">${icon('list')}Simple view</button>
        <div class="cm-sep"></div>
        <button class="cm-item" data-open="about">${icon('user')}About this portfolio</button>`;
      m.classList.add('open');
      const r = m.getBoundingClientRect();
      m.style.left = Math.min(x, innerWidth - r.width - 8) + 'px';
      m.style.top = Math.min(y, innerHeight - r.height - 8) + 'px';
    },
    close() { $('#contextMenu').classList.remove('open'); },
  };

  /* =========================================================
     Toasts
     ========================================================= */
  function toast(title, msg, appId = 'about', life = 6000) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.setProperty('--life', life + 'ms');
    t.innerHTML = `${tile(APPS[appId], 'md')}<div><b>${esc(title)}</b><p>${esc(msg)}</p></div><button class="toast-x" aria-label="Dismiss">${icon('x')}</button>`;
    $('#toasts').appendChild(t);
    const kill = () => { if (t.classList.contains('out')) return; t.classList.add('out'); setTimeout(() => t.remove(), 360); };
    $('.toast-x', t).addEventListener('click', kill);
    setTimeout(kill, life);
  }

  /* =========================================================
     App renderers
     ========================================================= */
  function renderAbout(b) {
    const p = PROFILE;
    b.innerHTML = `
      <div class="pad stagger">
        <div class="about-head" style="--i:0">
          <div class="avatar-ring"><div class="avatar lg">${avatarHTML()}</div></div>
          <div>
            <span class="chip-status"><i></i>${esc(p.status)}</span>
            <h2 class="display">${esc(p.fullName)}</h2>
            <p class="muted" style="margin:6px 0 0">${esc(p.title)} · ${p.roles.map(esc).join(' · ')}</p>
            <div class="meta">
              <span>${icon('pin')}${esc(p.location)}</span>
              <span>${icon('globe')}${p.languages.map((l) => esc(l.split(' (')[0])).join(' & ')}</span>
            </div>
          </div>
        </div>
        <p class="lead" style="--i:1">${esc(p.summary)}</p>
        <p class="lead" style="--i:2">${esc(p.strengths)}</p>
        <div class="facts" style="--i:3">
          <div class="card fact"><span class="eyebrow">Current role</span><b>Solution Architect, Pepper Labs</b></div>
          <div class="card fact"><span class="eyebrow">Focus</span><b>AI solutions & AWS</b></div>
          <div class="card fact"><span class="eyebrow">Education</span><b>Bachelor of IT (Hons.), UiTM</b></div>
          <div class="card fact"><span class="eyebrow">Languages</span><b>Malay, English</b></div>
        </div>
        <div class="actions" style="--i:4">
          <button class="btn btn-dark" data-open="projects">${icon('folder')}View projects</button>
          <button class="btn btn-pink" data-open="contact">${icon('mail')}Contact me</button>
          <button class="btn btn-line" data-open="resume">${icon('file')}Open resume</button>
        </div>
      </div>`;
  }

  function renderSkills(b) {
    b.innerHTML = `
      <div class="pad">
        <span class="eyebrow">What I work with</span>
        <h2 class="h-sec">Skills & tools</h2>
        <div class="skills-grid">
          ${SKILLS.map((g, i) => `
            <div class="card skill-card" style="animation:fade-up .6s ${i * 70 + 100}ms var(--out) both">
              <header>${tile({ color: ['#B0D7D8', '#F7CBCA', '#D5E5E5', '#DDD3D3'][i % 4], icon: g.icon }, 'md')}<h3>${esc(g.group)}</h3></header>
              <div class="chips">${g.items.map((s, j) => `<span class="chip${j % 3 === 1 ? ' pink' : ''}" style="--i:${i};--j:${j}">${esc(s)}</span>`).join('')}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderExperience(b) {
    b.innerHTML = `
      <div class="pad">
        <span class="eyebrow">Career</span>
        <h2 class="h-sec">Experience</h2>
        <div class="timeline">
          ${EXPERIENCE.map((e, i) => {
            const main = e.points.slice(0, 3), rest = e.points.slice(3);
            const extra = rest.length || e.groups.length;
            return `
            <article class="card tl-item${e.current ? ' current' : ''}" style="animation:fade-up .7s ${i * 150 + 250}ms var(--out) both">
              <div class="tl-top">
                <div><h3>${esc(e.role)}${e.current ? '<span class="tag-now">Current</span>' : ''}</h3><div class="tl-company">${esc(e.company)}</div></div>
                <span class="tl-period">${icon('calendar')}${esc(e.period)}</span>
              </div>
              <ul>${main.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
              ${extra ? `
                <div class="tl-collapse"><div>
                  ${rest.length ? `<ul>${rest.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
                  ${e.groups.map((g) => `<div class="tl-group"><h4>${icon('sparkles')}${esc(g.title)}</h4><ul>${g.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`).join('')}
                </div></div>
                <button class="tl-more" aria-expanded="false"><span>Show more</span>${icon('chevronR')}</button>` : ''}
            </article>`;
          }).join('')}
        </div>
      </div>`;
    $$('.tl-more', b).forEach((btn) => btn.addEventListener('click', () => {
      const c = btn.previousElementSibling;
      const open = !c.classList.contains('open');
      c.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      btn.firstElementChild.textContent = open ? 'Show less' : 'Show more';
    }));
  }

  function renderProjects(b, w) {
    let filter = 'all', sel = null, q = '';
    const hist = [];
    const labels = { all: 'All projects', work: 'Work', academic: 'Academic' };
    b.innerHTML = `
      <div class="explorer">
        <div class="ex-toolbar">
          <div class="ex-nav"><button class="ex-back" aria-label="Back" disabled>${icon('chevronL')}</button></div>
          <div class="ex-crumbs"></div>
          <label class="ex-search">${icon('search')}<input type="text" placeholder="Search projects" aria-label="Search projects"></label>
        </div>
        <div class="ex-main">
          <aside class="ex-side">
            ${Object.keys(labels).map((k) => `<button data-f="${k}">${icon(k === 'all' ? 'folder' : k === 'work' ? 'briefcase' : 'cap')}${labels[k]}<em>${k === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.type === k).length}</em></button>`).join('')}
          </aside>
          <div class="ex-grid" role="list"></div>
          <article class="ex-detail" aria-live="polite"><div class="ex-detail-inner"></div></article>
        </div>
        <footer class="ex-status"></footer>
      </div>`;
    const grid = $('.ex-grid', b), detail = $('.ex-detail', b), crumbs = $('.ex-crumbs', b), back = $('.ex-back', b);

    const list = () => PROJECTS.filter((p) => (filter === 'all' || p.type === filter) && (!q || (p.name + ' ' + p.tags.join(' ')).toLowerCase().includes(q)));
    const draw = (animateGrid = true) => {
      $$('.ex-side button', b).forEach((x) => x.classList.toggle('active', x.dataset.f === filter));
      const items = list();
      const sp = PROJECTS.find((p) => p.id === sel);
      crumbs.innerHTML = `${icon('folder')}<span>Portfolio</span>${icon('chevronR')}<span>Projects</span>${icon('chevronR')}<b>${labels[filter]}</b>${sp ? icon('chevronR') + `<b>${esc(sp.name)}</b>` : ''}`;
      if (animateGrid) {
        grid.innerHTML = items.length
          ? items.map((p, i) => `
              <button class="ex-item${p.id === sel ? ' active' : ''}" data-id="${p.id}" role="listitem" style="--i:${i}">
                ${thumb(p, 'span')}
                <h4>${esc(p.name)}</h4><small>${p.type} project</small>
              </button>`).join('')
          : `<div class="ex-empty">No projects match “${esc(q)}”.</div>`;
      } else {
        $$('.ex-item', grid).forEach((x) => x.classList.toggle('active', x.dataset.id === sel));
      }
      $('.ex-status', b).textContent = `${items.length} item${items.length === 1 ? '' : 's'}${sp ? ' · 1 selected' : ''}`;
      back.disabled = !hist.length && !sel;
      if (sp) {
        $('.ex-detail-inner', b).innerHTML = `
          <button class="ex-close" aria-label="Close details">${icon('x')}</button>
          <span class="eyebrow">${sp.type === 'work' ? 'Work project' : 'Academic project'}</span>
          <h3>${esc(sp.name)}</h3>
          ${sp.link ? `<a class="ex-shot" href="${esc(sp.link)}" target="_blank" rel="noopener" aria-label="Visit ${esc(sp.linkLabel)}">${thumb(sp)}<span class="ex-shot-cta">${icon('external')}Visit site</span></a>` : thumb(sp)}
          <p>${esc(sp.summary)}</p>
          ${sp.link ? `<a class="btn btn-dark ex-visit" href="${esc(sp.link)}" target="_blank" rel="noopener">${icon('globe')}${esc(sp.linkLabel)}${icon('external')}</a>` : ''}
          <div class="chips">${sp.tags.map((t, i) => `<span class="chip${i % 2 ? ' pink' : ''}">${esc(t)}</span>`).join('')}</div>
          <ul>${sp.details.map((d, i) => `<li style="--i:${i}">${esc(d)}</li>`).join('')}</ul>`;
        detail.classList.add('open');
      } else detail.classList.remove('open');
    };

    b.addEventListener('click', (e) => {
      const f = e.target.closest('[data-f]');
      if (f) { hist.push(filter); filter = f.dataset.f; sel = null; draw(); return; }
      const it = e.target.closest('.ex-item');
      if (it) { sel = sel === it.dataset.id ? null : it.dataset.id; draw(false); return; }
      if (e.target.closest('.ex-close')) { sel = null; draw(false); return; }
      if (e.target.closest('.ex-back')) {
        if (sel) sel = null;
        else if (hist.length) filter = hist.pop();
        draw();
      }
    });
    $('.ex-search input', b).addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); draw(); });
    w.api.select = (id) => { filter = 'all'; q = ''; $('.ex-search input', b).value = ''; sel = id; draw(); };
    draw();
  }

  function renderTrainings(b, w) {
    let tab = 'sessions', filter = 'all';
    b.innerHTML = `
      <div class="tr">
        <div class="tr-tabs" role="tablist">
          <button role="tab" data-tab="sessions">${icon('presentation')}Training sessions</button>
          <button role="tab" data-tab="gallery">${icon('camera')}Photo gallery <em>${GALLERY.length}</em></button>
          <span class="tr-ink"></span>
        </div>
        <div class="tr-body"></div>
      </div>`;
    const bodyEl = $('.tr-body', b);

    const sessions = () => `
      <div class="pad">
        <span class="eyebrow">Trainer</span>
        <h2 class="h-sec">AI training I've delivered</h2>
        <div class="tr-stats">${TRAINING_STATS.map((s, i) => `<div class="card tr-stat" style="animation:fade-up .6s ${i * 80 + 100}ms var(--out) both"><b data-count="${esc(s.n)}">0</b><span>${esc(s.label)}</span></div>`).join('')}</div>
        <div class="tr-list">
          ${TRAININGS.map((t, i) => {
            const d = new Date(t.date + 'T00:00:00');
            return `
            <article class="card tr-item" style="animation:fade-up .6s ${i * 70 + 250}ms var(--out) both">
              <div class="tr-date"><b>${d.getDate()}</b><span>${d.toLocaleDateString('en-GB', { month: 'short' })}</span><small>${d.getFullYear()}</small></div>
              <div class="tr-info">
                <span class="chip${t.programme.startsWith('Kampung') ? ' pink' : ''}">${esc(t.programme)}</span>
                <h3>${esc(t.venue)}</h3>
                <p>${icon('pin')}${esc(t.place)}${t.online ? ` <span class="tr-online">${icon('video')}Online</span>` : ''}</p>
              </div>
              <span class="tr-role">${icon('star')}Trainer</span>
            </article>`;
          }).join('')}
        </div>
        <div class="card tr-public" style="animation:fade-up .6s 750ms var(--out) both">
          ${tile({ color: '#B0D7D8', icon: 'landmark' }, 'md')}
          <div><h3>Public sector training</h3><p>${esc(PUBLIC_SECTOR_NOTE)}</p>
          <button class="btn btn-line" data-gal="public">${icon('camera')}See public sector photos</button></div>
        </div>
      </div>`;

    const gallery = () => {
      const items = GALLERY.filter((g) => filter === 'all' || g.type === filter);
      return `
        <div class="gal-bar">
          ${Object.keys(GALLERY_TYPES).map((k) => `<button class="gal-f${k === filter ? ' active' : ''}" data-gal="${k}">${GALLERY_TYPES[k]}<em>${k === 'all' ? GALLERY.length : GALLERY.filter((g) => g.type === k).length}</em></button>`).join('')}
        </div>
        ${filter === 'public' ? `<p class="gal-note">${icon('landmark')}${esc(PUBLIC_SECTOR_NOTE)}</p>` : ''}
        <div class="gal-grid">
          ${items.map((g, i) => `
            <button class="gal-item" data-photo="${esc(g.file)}" style="--i:${i}" aria-label="${esc(g.caption)}">
              <img src="assets/events/thumbs/${esc(g.file)}.jpg" alt="${esc(g.caption)}" loading="lazy" decoding="async">
              <span class="gal-cap">${esc(g.caption)}</span>
            </button>`).join('')}
        </div>`;
    };

    const draw = () => {
      $$('.tr-tabs [data-tab]', b).forEach((t) => { const on = t.dataset.tab === tab; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); });
      const act = $(`.tr-tabs [data-tab="${tab}"]`, b);
      const ink = $('.tr-ink', b);
      ink.style.left = act.offsetLeft + 'px';
      ink.style.width = act.offsetWidth + 'px';
      bodyEl.innerHTML = tab === 'sessions' ? sessions() : gallery();
      bodyEl.scrollTop = 0;
      if (tab === 'sessions') countUp(bodyEl);
    };

    b.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]');
      if (t) { tab = t.dataset.tab; draw(); return; }
      const f = e.target.closest('[data-gal]');
      if (f) { tab = 'gallery'; filter = f.dataset.gal; draw(); return; }
      const ph = e.target.closest('[data-photo]');
      if (ph) {
        const list = GALLERY.filter((g) => filter === 'all' || g.type === filter);
        Lightbox.open(list, list.findIndex((g) => g.file === ph.dataset.photo), $('img', ph));
      }
    });
    w.api.show = (t, f) => { tab = t || 'sessions'; filter = f || 'all'; draw(); };
    requestAnimationFrame(draw);
  }

  function countUp(root) {
    $$('[data-count]', root).forEach((el) => {
      const end = parseInt(el.dataset.count, 10);
      if (reduceMotion || !end) { el.textContent = el.dataset.count; return; }
      const t0 = performance.now(), dur = 1100;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- Photo viewer ---------- */
  const Lightbox = {
    list: [], i: 0, el: null,
    build() {
      const el = document.createElement('div');
      el.className = 'lightbox';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', 'Photo viewer');
      el.innerHTML = `
        <button class="lb-btn lb-x" aria-label="Close">${icon('x')}</button>
        <button class="lb-btn lb-prev" aria-label="Previous photo">${icon('chevronL')}</button>
        <figure class="lb-fig"><img alt=""><figcaption><span class="lb-cap"></span><small class="lb-n"></small></figcaption></figure>
        <button class="lb-btn lb-next" aria-label="Next photo">${icon('chevronR')}</button>
        <div class="lb-strip"></div>`;
      document.body.appendChild(el);
      el.addEventListener('click', (e) => {
        if (e.target === el || e.target.closest('.lb-x')) this.close();
        else if (e.target.closest('.lb-prev')) this.go(-1);
        else if (e.target.closest('.lb-next')) this.go(1);
        else { const s = e.target.closest('[data-lb]'); if (s) this.show(+s.dataset.lb); }
      });
      let sx = null;
      el.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
      el.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) this.go(dx < 0 ? 1 : -1); sx = null; });
      this.el = el;
    },
    open(list, i, fromImg) {
      if (!this.el) this.build();
      this.list = list;
      $('.lb-strip', this.el).innerHTML = list.map((g, k) => `<button data-lb="${k}" aria-label="Photo ${k + 1}"><img src="assets/events/thumbs/${esc(g.file)}.jpg" alt="" loading="lazy"></button>`).join('');
      this.el.classList.add('open');
      this.show(Math.max(0, i), fromImg);
    },
    show(i, fromImg) {
      const n = this.list.length;
      const dir = i > this.i ? 1 : -1;
      this.i = (i + n) % n;
      const g = this.list[this.i];
      const img = $('.lb-fig img', this.el);
      img.src = `assets/events/${g.file}.jpg`;
      img.alt = g.caption;
      $('.lb-cap', this.el).textContent = g.caption;
      $('.lb-n', this.el).textContent = `${this.i + 1} / ${n}`;
      $$('[data-lb]', this.el).forEach((s) => s.classList.toggle('active', +s.dataset.lb === this.i));
      $(`[data-lb="${this.i}"]`, this.el)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      if (fromImg) {
        const r = fromImg.getBoundingClientRect();
        img.onload = () => {
          img.onload = null;
          const t = img.getBoundingClientRect();
          anim(img, [
            { transform: `translate(${r.left + r.width / 2 - (t.left + t.width / 2)}px, ${r.top + r.height / 2 - (t.top + t.height / 2)}px) scale(${r.width / t.width})`, opacity: .6 },
            { transform: 'none', opacity: 1 },
          ], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
        };
      } else {
        anim(img, [{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    },
    go(d) { this.show(this.i + d); },
    close() {
      if (!this.el || !this.el.classList.contains('open')) return;
      this.el.classList.remove('open');
    },
    isOpen() { return !!this.el && this.el.classList.contains('open'); },
  };

  function renderEducation(b) {
    b.innerHTML = `
      <div class="pad">
        <span class="eyebrow">Studies</span>
        <h2 class="h-sec">Education</h2>
        <div class="edu-list">
          ${EDUCATION.map((e, i) => `
            <div class="card edu-card" style="animation:fade-up .6s ${i * 120 + 150}ms var(--out) both">
              ${tile({ color: i ? '#DDD3D3' : '#F7CBCA', icon: 'cap' }, 'md')}
              <div><h3>${esc(e.degree)}</h3><p>${esc(e.school)} · ${esc(e.place)}</p><p>${esc(e.period)}</p></div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderCerts(b) {
    b.innerHTML = `
      <div class="pad">
        <span class="eyebrow">Learning</span>
        <h2 class="h-sec">Certifications & training</h2>
        <div class="cert-list">
          ${CERTS.map((c, i) => `
            <div class="card cert-card" style="animation:fade-up .6s ${i * 110 + 150}ms var(--out) both">
              ${tile({ color: ['#B0D7D8', '#F7CBCA', '#D5E5E5'][i % 3], icon: 'award' }, 'md')}
              <div><h3>${esc(c.name)}</h3><p>${esc(c.issuer)} · ${esc(c.date)}</p></div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderContact(b) {
    const p = PROFILE;
    b.innerHTML = `
      <div class="pad">
        <span class="eyebrow">Say hello</span>
        <h2 class="h-sec">Let's work together</h2>
        <p class="lead muted" style="margin-bottom:20px">Have a project, role or idea in mind? Send me a message and I'll get back to you.</p>
        <div class="contact">
          <div class="contact-side stagger">
            <div class="card c-row" style="--i:0">${tile(APPS.contact, 'md')}<div><small>Email</small><b>${esc(p.email)}</b></div><button class="c-copy" data-copy="${esc(p.email)}" aria-label="Copy email" title="Copy">${icon('copy')}</button></div>
            <a class="card c-row" style="--i:1" href="${esc(p.github)}" target="_blank" rel="noopener">${tile({ color: '#D5E5E5', icon: 'github' }, 'md')}<div><small>GitHub</small><b>${esc(p.githubLabel)}</b></div>${icon('external')}</a>
            <div class="card c-row" style="--i:2">${tile({ color: '#DDD3D3', icon: 'pin' }, 'md')}<div><small>Location</small><b>${esc(p.location)}</b></div></div>
          </div>
          <form class="form" novalidate>
            <div class="field"><input id="cf-name" name="name" placeholder=" " autocomplete="name"><label for="cf-name">Your name</label><span class="err">Please enter your name.</span></div>
            <div class="field"><input id="cf-email" name="email" type="email" placeholder=" " autocomplete="email"><label for="cf-email">Your email</label><span class="err">Please enter a valid email address.</span></div>
            <div class="field"><textarea id="cf-msg" name="message" placeholder=" "></textarea><label for="cf-msg">Message</label><span class="err">Please write at least 10 characters.</span></div>
            <div><button class="btn btn-dark" type="submit">${icon('send')}Send message</button></div>
          </form>
        </div>
      </div>`;
    const form = $('form', b);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
      const checks = [
        [form.name, name.length >= 2],
        [form.email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)],
        [form.message, msg.length >= 10],
      ];
      let ok = true;
      checks.forEach(([f, valid]) => {
        const fld = f.closest('.field');
        fld.classList.remove('invalid');
        if (!valid) { void fld.offsetWidth; fld.classList.add('invalid'); ok = false; }
      });
      if (!ok) return;
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const bodyTxt = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${p.email}?subject=${subject}&body=${bodyTxt}`;
      toast('Opening your email app', 'Your message is ready to send from your email app.', 'contact');
      form.reset();
    });
    form.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('invalid'));
  }

  function renderResume(b) {
    const p = PROFILE;
    let zoom = 1;
    b.innerHTML = `
      <div class="viewer">
        <div class="viewer-bar">
          <button class="icon-btn" data-z="-1" aria-label="Zoom out">${icon('zoomOut')}</button>
          <span class="zoom-lbl">100%</span>
          <button class="icon-btn" data-z="1" aria-label="Zoom in">${icon('zoomIn')}</button>
          <span class="grow"></span>
          <a class="btn btn-pink" href="${esc(p.resumePdf)}" download>${icon('download')}Download PDF</a>
        </div>
        <div class="viewer-scroll">
          <div class="paper">
            <h1>${esc(p.fullName)}</h1>
            <div class="p-sub">${esc(p.title)} | ${p.roles.map(esc).join(' | ')}</div>
            <div class="p-contact">${esc(p.location)} • ${esc(p.email)} • ${esc(p.githubLabel)}</div>
            <h2>Professional profile</h2><p>${esc(p.summary)} ${esc(p.strengths)}</p>
            <h2>Core technical skills</h2>
            ${SKILLS.map((s) => `<div class="p-skill"><b>${esc(s.group)}</b><span>${s.items.map(esc).join(', ')}</span></div>`).join('')}
            <h2>Professional experience</h2>
            ${EXPERIENCE.map((e) => `<h3>${esc(e.role)} | ${esc(e.company)}<span>${esc(e.period)}</span></h3><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${e.groups.map((g) => `<b>${esc(g.title)}</b><ul>${g.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}`).join('')}
            <h2>Selected projects</h2>
            ${PROJECTS.filter((x) => x.type === 'work').map((x) => `<h3>${esc(x.name)}</h3><p>${esc(x.details.join(' '))}</p>`).join('')}
            <h2>Education</h2>
            ${EDUCATION.map((e) => `<h3>${esc(e.degree)}<span>${esc(e.period)}</span></h3><p>${esc(e.school)}, ${esc(e.place)}</p>`).join('')}
            <h2>Academic projects</h2>
            <ul>${PROJECTS.filter((x) => x.type === 'academic').map((x) => `<li><b>${esc(x.name)}</b> — ${esc(x.summary)} ${esc(x.details.join(' '))}</li>`).join('')}</ul>
            <h2>Certifications & training</h2>
            <ul>${CERTS.map((c) => `<li>${esc(c.name)} — ${esc(c.issuer)} (${esc(c.date)})</li>`).join('')}</ul>
            <h2>Languages</h2><p>${p.languages.map(esc).join(' • ')}</p>
          </div>
        </div>
      </div>`;
    const paper = $('.paper', b);
    $$('[data-z]', b).forEach((btn) => btn.addEventListener('click', () => {
      zoom = Math.max(0.6, Math.min(1.6, +(zoom + 0.1 * +btn.dataset.z).toFixed(1)));
      paper.style.setProperty('--zoom', zoom);
      $('.zoom-lbl', b).textContent = Math.round(zoom * 100) + '%';
    }));
  }

  function renderTerminal(b, w) {
    b.innerHTML = `
      <div class="term">
        <div class="term-out" aria-live="polite"></div>
        <label class="term-line"><span class="term-ps">raimi@portfolio:<b>~</b>$</span><input class="term-in" spellcheck="false" autocomplete="off" aria-label="Terminal input"></label>
      </div>`;
    const term = $('.term', b), out = $('.term-out', b), inp = $('.term-in', b);
    const history = [];
    let hi = 0;
    const print = (html, cls = '') => {
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.innerHTML = html;
      out.appendChild(d);
      term.scrollTop = term.scrollHeight;
    };
    const line = (s, cls) => print(esc(s), cls);
    const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));

    const cmds = {
      help: () => {
        print('<span class="t-head">Available commands</span>');
        [
          ['whoami', 'Who is Raimi?'], ['about', 'Professional profile'], ['skills', 'Skills by category'],
          ['experience', 'Work history'], ['trainings', 'Trainings I have delivered'], ['projects', 'List projects'], ['project <n>', 'Open a project'],
          ['education', 'Studies'], ['certs', 'Certifications'], ['contact', 'How to reach me'],
          ['open <app>', 'Open a window (about, skills, projects…)'], ['scene <1-4>', 'Change wallpaper'],
          ['neofetch', 'System info'], ['simple', 'Open the simple view'], ['date', 'Current date & time'],
          ['clear', 'Clear the screen'], ['exit', 'Close the terminal'],
        ].forEach(([c, d]) => print(`  <span class="t-teal">${esc(pad(c, 16))}</span><span class="t-dim">${esc(d)}</span>`));
      },
      whoami: () => { line(`${PROFILE.fullName}`, 't-head'); line(`${PROFILE.title} · ${PROFILE.roles.join(' · ')}`, 't-pink'); line(PROFILE.tagline, 't-dim'); },
      about: () => { line(PROFILE.summary); line(PROFILE.strengths, 't-dim'); },
      skills: () => SKILLS.forEach((s) => print(`<span class="t-pink">${esc(pad(s.group, 24))}</span>${esc(s.items.join(', '))}`)),
      experience: () => EXPERIENCE.forEach((e) => { print(`<span class="t-head">${esc(e.role)}</span> <span class="t-dim">@ ${esc(e.company)} · ${esc(e.period)}</span>`); e.points.slice(0, 2).forEach((p) => line('  • ' + p)); }),
      projects: () => { PROJECTS.forEach((p, i) => print(`  <span class="t-teal">[${i + 1}]</span> ${esc(p.name)} <span class="t-dim">(${p.type})</span>${p.link ? ` <a class="t-link" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.linkLabel)}</a>` : ''}`)); line("Type 'project <n>' to open one.", 't-dim'); },
      project: (a) => {
        const p = PROJECTS[+a[0] - 1] || PROJECTS.find((x) => x.id === a[0]);
        if (!p) return line('Usage: project <number>. Type "projects" for the list.', 't-err');
        line(`Opening ${p.name}…`, 't-dim');
        openProject(p.id);
      },
      education: () => EDUCATION.forEach((e) => print(`<span class="t-head">${esc(e.degree)}</span>\n  <span class="t-dim">${esc(e.school)}, ${esc(e.place)} · ${esc(e.period)}</span>`)),
      trainings: () => {
        print('<span class="t-head">Trainings delivered as trainer</span>');
        TRAININGS.forEach((t) => print(`  <span class="t-pink">${esc(fmtDate(t.date).padEnd(18))}</span>${esc(t.programme)} <span class="t-dim">— ${esc(t.venue)}, ${esc(t.place)}${t.online ? ' (online)' : ''}</span>`));
        line(PUBLIC_SECTOR_NOTE, 't-dim');
        line("Type 'open trainings' to see the photo gallery.", 't-dim');
      },
      certs: () => CERTS.forEach((c) => print(`  <span class="t-pink">★</span> ${esc(c.name)} <span class="t-dim">— ${esc(c.issuer)}, ${esc(c.date)}</span>`)),
      contact: () => {
        print(`  <span class="t-teal">email </span> <a class="t-link" href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a>`);
        print(`  <span class="t-teal">github</span> <a class="t-link" href="${esc(PROFILE.github)}" target="_blank" rel="noopener">${esc(PROFILE.githubLabel)}</a>`);
      },
      open: (a) => {
        const id = (a[0] || '').toLowerCase().replace('.pdf', '');
        const key = APPS[id] ? id : Object.keys(APPS).find((k) => APPS[k].title.toLowerCase().startsWith(id));
        if (!id || !key) return line(`Usage: open <${Object.keys(APPS).join('|')}>`, 't-err');
        line(`Opening ${APPS[key].title}…`, 't-dim');
        WM.open(key);
      },
      scene: (a) => {
        const n = +a[0] - 1;
        const idx = SCENES[n] ? n : SCENES.findIndex((s) => s.label.toLowerCase().startsWith((a.join(' ') || '#').toLowerCase()));
        if (idx < 0) return SCENES.forEach((s, i) => print(`  <span class="t-teal">${i + 1}</span> ${esc(s.label)}${i === Scenes.idx ? ' <span class="t-pink">(current)</span>' : ''}`));
        Scenes.set(idx);
        line(`Wallpaper set to ${SCENES[idx].label}.`, 't-dim');
      },
      neofetch: () => {
        const art = ['  ▄▄▄▄ ▄▄▄▄ ', '  ████ ████ ', '  ▀▀▀▀ ▀▀▀▀ ', '  ▄▄▄▄ ▄▄▄▄ ', '  ████ ████ ', '  ▀▀▀▀ ▀▀▀▀ '];
        const info = [
          `<span class="t-pink">raimi</span>@<span class="t-teal">portfolio</span>`,
          `<span class="t-teal">OS</span>       RaimiOS (Windows-style web)`,
          `<span class="t-teal">Role</span>     ${esc(PROFILE.title)}`,
          `<span class="t-teal">Company</span>  Pepper Labs Sdn. Bhd.`,
          `<span class="t-teal">Stack</span>    AWS · RAG · HTML/CSS/JS · Python`,
          `<span class="t-teal">Location</span> ${esc(PROFILE.location)}`,
        ];
        art.forEach((a, i) => print(`<span class="${i < 3 ? 't-pink' : 't-teal'}">${esc(a)}</span>  ${info[i] || ''}`));
      },
      simple: () => { line('Opening simple view…', 't-dim'); Simple.open(); },
      date: () => line(new Date().toString()),
      clear: () => { out.innerHTML = ''; },
      echo: (a) => line(a.join(' ')),
      sudo: (a) => {
        if (a.join(' ').toLowerCase().includes('hire')) { line('[sudo] password for recruiter: ********', 't-dim'); line('Access granted. Opening contact form…', 't-pink'); setTimeout(() => WM.open('contact'), 600); }
        else line('Nice try. Permission denied.', 't-err');
      },
      exit: () => WM.close(w.id),
    };
    cmds.ls = cmds.projects;
    cmds.cls = cmds.clear;

    const run = (raw) => {
      const s = raw.trim();
      print(`<span class="term-ps">raimi@portfolio:<b>~</b>$</span> ${esc(s)}`);
      if (!s) return;
      history.push(s);
      hi = history.length;
      const [c, ...args] = s.split(/\s+/);
      const fn = cmds[c.toLowerCase()];
      if (fn) fn(args); else line(`command not found: ${c}. Type 'help' to see commands.`, 't-err');
    };

    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { run(inp.value); inp.value = ''; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) inp.value = history[--hi]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(history.length, hi + 1); inp.value = history[hi] || ''; }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const m = Object.keys(cmds).filter((k) => k.startsWith(inp.value.toLowerCase()));
        if (m.length === 1) inp.value = m[0] + ' ';
      }
    });
    term.addEventListener('click', () => { if (!getSelection().toString()) inp.focus(); });

    // Typed intro
    (async () => {
      const intro = [
        ['RaimiOS Terminal [Version 1.0.2026]', 't-head'],
        ['(c) Raimi Akasyah. All rights reserved.', 't-dim'],
        ['', ''],
        ["Type 'help' to see what you can do. Try 'neofetch' or 'sudo hire raimi'.", 't-pink'],
      ];
      inp.disabled = true;
      for (const [t, c] of intro) {
        const d = document.createElement('div');
        d.className = c;
        out.appendChild(d);
        if (reduceMotion) { d.textContent = t || ' '; continue; }
        for (let i = 0; i <= t.length; i += 2) { d.textContent = t.slice(0, i) || ' '; await wait(8); }
        d.textContent = t || ' ';
      }
      inp.disabled = false;
      if (!isTouch()) inp.focus();
    })();
  }

  function openProject(id) {
    const w = WM.open('projects');
    if (w && w.api.select) w.api.select(id);
  }

  /* =========================================================
     Simple view
     ========================================================= */
  const Simple = {
    built: false,
    build() {
      const p = PROFILE;
      $('#simple').innerHTML = `
        <nav class="s-nav">
          <span class="s-logo">${logo()}<span>${esc(p.name)}</span></span>
          <div class="s-links"><a href="#s-about">About</a><a href="#s-skills">Skills</a><a href="#s-exp">Experience</a><a href="#s-train">Trainings</a><a href="#s-proj">Projects</a><a href="#s-edu">Education</a><a href="#s-contact">Contact</a></div>
          <button class="btn btn-dark" data-action="desktop">${icon('square')}Desktop view</button>
        </nav>
        <header class="s-hero">
          <div class="avatar-ring" style="display:inline-block"><div class="avatar lg">${avatarHTML()}</div></div>
          <h1>${esc(p.name)}</h1>
          <p class="eyebrow" style="margin-bottom:14px">${esc(p.title)} · ${p.roles.map(esc).join(' · ')}</p>
          <p>${esc(p.tagline)}</p>
          <div class="actions"><a class="btn btn-dark" href="#s-proj">${icon('folder')}View projects</a><a class="btn btn-pink" href="mailto:${esc(p.email)}">${icon('mail')}Email me</a><a class="btn btn-line" href="${esc(p.resumePdf)}" download>${icon('download')}Resume</a></div>
        </header>
        <section class="s-sec rv" id="s-about"><h2>About me</h2><p class="lead">${esc(p.summary)}</p><p class="lead">${esc(p.strengths)}</p></section>
        <div class="s-alt"><section class="s-sec rv" id="s-skills"><h2>Skills</h2><div class="skills-grid">${SKILLS.map((g, i) => `<div class="card skill-card"><header>${tile({ color: ['#B0D7D8', '#F7CBCA', '#F1F7F7', '#DDD3D3'][i % 4], icon: g.icon }, 'md')}<h3>${esc(g.group)}</h3></header><div class="chips">${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>`).join('')}</div></section></div>
        <section class="s-sec rv" id="s-exp"><h2>Experience</h2><div class="timeline">${EXPERIENCE.map((e) => `<article class="card tl-item${e.current ? ' current' : ''}"><div class="tl-top"><div><h3>${esc(e.role)}${e.current ? '<span class="tag-now">Current</span>' : ''}</h3><div class="tl-company">${esc(e.company)}</div></div><span class="tl-period">${icon('calendar')}${esc(e.period)}</span></div><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${e.groups.map((g) => `<div class="tl-group"><h4>${icon('sparkles')}${esc(g.title)}</h4><ul>${g.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</article>`).join('')}</div></section>
        <div class="s-alt"><section class="s-sec rv" id="s-train"><h2>Trainings & events</h2>
          <div class="tr-list">${TRAININGS.map((t) => { const d = new Date(t.date + 'T00:00:00'); return `<article class="card tr-item"><div class="tr-date"><b>${d.getDate()}</b><span>${d.toLocaleDateString('en-GB', { month: 'short' })}</span><small>${d.getFullYear()}</small></div><div class="tr-info"><span class="chip${t.programme.startsWith('Kampung') ? ' pink' : ''}">${esc(t.programme)}</span><h3>${esc(t.venue)}</h3><p>${icon('pin')}${esc(t.place)}${t.online ? ` <span class="tr-online">${icon('video')}Online</span>` : ''}</p></div><span class="tr-role">${icon('star')}Trainer</span></article>`; }).join('')}</div>
          <p class="lead" style="margin-top:22px">${esc(PUBLIC_SECTOR_NOTE)}</p>
          <div class="gal-grid s-gal">${GALLERY.map((g) => `<button class="gal-item" data-sphoto="${esc(g.file)}" aria-label="${esc(g.caption)}"><img src="assets/events/thumbs/${esc(g.file)}.jpg" alt="${esc(g.caption)}" loading="lazy" decoding="async"><span class="gal-cap">${esc(g.caption)}</span></button>`).join('')}</div>
        </section></div>
        <section class="s-sec rv" id="s-proj"><h2>Projects</h2><div class="s-proj-grid">${PROJECTS.map((x) => `<article class="card s-proj">${x.link ? `<a class="ex-shot" href="${esc(x.link)}" target="_blank" rel="noopener" aria-label="Visit ${esc(x.linkLabel)}">${thumb(x)}<span class="ex-shot-cta">${icon('external')}Visit site</span></a>` : thumb(x)}<span class="eyebrow">${x.type === 'work' ? 'Work' : 'Academic'}</span><h3>${esc(x.name)}</h3><p>${esc(x.summary)}</p><div class="chips">${x.tags.map((t) => `<span class="chip pink">${esc(t)}</span>`).join('')}</div></article>`).join('')}</div></section>
        <div class="s-alt"><section class="s-sec rv" id="s-edu"><h2>Education & certifications</h2><div class="edu-list">${EDUCATION.map((e) => `<div class="card edu-card">${tile({ color: '#F7CBCA', icon: 'cap' }, 'md')}<div><h3>${esc(e.degree)}</h3><p>${esc(e.school)} · ${esc(e.place)} · ${esc(e.period)}</p></div></div>`).join('')}${CERTS.map((c) => `<div class="card cert-card">${tile({ color: '#B0D7D8', icon: 'award' }, 'md')}<div><h3>${esc(c.name)}</h3><p>${esc(c.issuer)} · ${esc(c.date)}</p></div></div>`).join('')}</div></section></div>
        <section class="s-sec rv" id="s-contact"><h2>Contact</h2><div class="contact-side" style="max-width:520px"><a class="card c-row" href="mailto:${esc(p.email)}">${tile(APPS.contact, 'md')}<div><small>Email</small><b>${esc(p.email)}</b></div></a><a class="card c-row" href="${esc(p.github)}" target="_blank" rel="noopener">${tile({ color: '#D5E5E5', icon: 'github' }, 'md')}<div><small>GitHub</small><b>${esc(p.githubLabel)}</b></div>${icon('external')}</a><div class="card c-row">${tile({ color: '#DDD3D3', icon: 'pin' }, 'md')}<div><small>Location</small><b>${esc(p.location)}</b></div></div></div></section>
        <footer class="s-foot">© ${new Date().getFullYear()} ${esc(p.fullName)}</footer>`;
      const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { root: $('#simple'), threshold: 0.12 });
      $$('#simple .rv').forEach((el) => io.observe(el));
      $('#simple').addEventListener('click', (e) => {
        const ph = e.target.closest('[data-sphoto]');
        if (ph) Lightbox.open(GALLERY, GALLERY.findIndex((g) => g.file === ph.dataset.sphoto), $('img', ph));
      });
      $$('#simple a[href^="#s-"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); $(a.getAttribute('href')).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }));
      this.built = true;
    },
    open() {
      if (!this.built) this.build();
      Flyouts.closeAll();
      const s = $('#simple');
      s.hidden = false;
      s.scrollTop = 0;
      history.replaceState(null, '', '#simple');
    },
    close() {
      $('#simple').hidden = true;
      history.replaceState(null, '', location.pathname + location.search);
      if (!body.classList.contains('phase-desktop')) Shell.toDesktop(true);
    },
  };

  /* =========================================================
     Shell: boot → lock → login → desktop
     ========================================================= */
  const Shell = {
    phase: 'boot',
    setPhase(p) {
      body.classList.remove('phase-boot', 'phase-lock', 'phase-login', 'phase-desktop');
      body.classList.add('phase-' + p);
      this.phase = p;
    },
    async boot(fast) {
      await wait(fast ? 300 : 2200);
      $('#boot').classList.add('done');
      setTimeout(() => $('#boot').remove(), 800);
    },
    toLock() {
      WM.wins.forEach((w) => w.el.classList.remove('focused'));
      Flyouts.closeAll();
      $('#lock').classList.remove('signing');
      this.setPhase('lock');
      $('#lock').focus();
    },
    toLogin() {
      if (this.phase !== 'lock') return;
      this.setPhase('login');
      setTimeout(() => $('#enterBtn').focus(), 300);
    },
    async signIn() {
      if (this.phase !== 'login') return;
      $('#lock').classList.add('signing');
      await wait(reduceMotion ? 0 : 900);
      this.toDesktop();
    },
    toDesktop(quiet) {
      const first = !this.everDesktop;
      this.everDesktop = true;
      this.setPhase('desktop');
      $('#lock').classList.remove('signing');
      Taskbar.render();
      if (first && !quiet) {
        setTimeout(() => toast('Welcome to my portfolio 👋', isTouch() ? 'Tap an icon to open it, or use the Start button.' : 'Double-click an icon to open it, drag windows around, or right-click the desktop.', 'about', 8000), 1500);
      }
    },
  };

  /* =========================================================
     Global events
     ========================================================= */
  function bindGlobal() {
    // Delegated actions
    document.addEventListener('click', (e) => {
      const t = e.target;
      const open = t.closest('[data-open]');
      if (open) { WM.open(open.dataset.open, open); return; }
      const proj = t.closest('[data-project]');
      if (proj) { openProject(proj.dataset.project); return; }
      const sc = t.closest('[data-scene]');
      if (sc) { Scenes.set(sc.dataset.scene); Ctx.close(); return; }
      const copy = t.closest('[data-copy]');
      if (copy) {
        navigator.clipboard?.writeText(copy.dataset.copy).then(
          () => toast('Copied', `${copy.dataset.copy} is on your clipboard.`, 'contact', 3500),
          () => toast('Copy failed', 'Please copy the email address manually.', 'contact', 3500)
        );
        return;
      }
      const tb = t.closest('.tb-app');
      if (tb) { Flyouts.closeAll(); WM.toggleFromTaskbar(tb.dataset.app, tb); return; }
      const act = t.closest('[data-action]');
      if (act) {
        const a = act.dataset.action;
        if (a === 'start') Flyouts.toggle('startMenu');
        else if (a === 'search') { if (!$('#startMenu').classList.contains('open')) Flyouts.toggle('startMenu'); setTimeout(() => $('#smSearch').focus(), 60); }
        else if (a === 'scenes') Flyouts.toggle('sceneFlyout');
        else if (a === 'calendar') Flyouts.toggle('calFlyout');
        else if (a === 'simple') Simple.open();
        else if (a === 'desktop') Simple.close();
        else if (a === 'lock') Shell.toLock();
        else if (a === 'refresh') refreshIcons();
        Ctx.close();
        return;
      }
    });

    // Close flyouts when clicking outside
    document.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.flyout, .taskbar, .context-menu')) Flyouts.closeAll();
      else if (!e.target.closest('.context-menu')) Ctx.close();
      if (!e.target.closest('.d-icon')) $$('.d-icon.selected').forEach((i) => i.classList.remove('selected'));
    });

    // Desktop icons: single click selects, double click opens (single tap on touch)
    const icons = $('#icons');
    icons.addEventListener('click', (e) => {
      const ic = e.target.closest('.d-icon');
      if (!ic) return;
      if (isTouch() || e.detail === 0) { WM.open(ic.dataset.iconApp, $('.tile', ic)); return; }
      $$('.d-icon.selected').forEach((i) => i.classList.remove('selected'));
      ic.classList.add('selected');
    });
    icons.addEventListener('dblclick', (e) => {
      const ic = e.target.closest('.d-icon');
      if (ic && !isTouch()) WM.open(ic.dataset.iconApp, $('.tile', ic));
    });

    // Context menu on empty desktop
    $('#desktop').addEventListener('contextmenu', (e) => {
      if (e.target.closest('.win, .taskbar, .flyout, input, textarea')) return;
      e.preventDefault();
      Flyouts.closeAll();
      Ctx.open(e.clientX, e.clientY);
    });

    // Start menu search
    $('#smSearch').addEventListener('input', (e) => Search.run(e.target.value));
    $('#smSearch').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const first = $('#smResults:not([hidden]) .sm-rec-item'); if (first) first.click(); }
    });

    // Lock screen
    $('#lock').addEventListener('click', () => { if (Shell.phase === 'lock') Shell.toLogin(); });
    $('#enterBtn').addEventListener('click', (e) => { e.stopPropagation(); Shell.signIn(); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (Lightbox.isOpen()) {
        if (e.key === 'Escape') Lightbox.close();
        else if (e.key === 'ArrowLeft') Lightbox.go(-1);
        else if (e.key === 'ArrowRight') Lightbox.go(1);
        e.preventDefault();
        return;
      }
      if (Shell.phase === 'lock' && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); Shell.toLogin(); return; }
      if (Shell.phase === 'login' && e.key === 'Enter' && document.activeElement?.tagName !== 'BUTTON') { Shell.signIn(); return; }
      if (e.key === 'Escape') {
        if (!$('#simple').hidden) { Simple.close(); return; }
        if ($('.flyout.open, .context-menu.open')) { Flyouts.closeAll(); return; }
      }
      if (Shell.phase !== 'desktop' || !$('#simple').hidden) return;
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || '');
      if (e.key === 'F5' && !e.ctrlKey) { e.preventDefault(); refreshIcons(); }
      if (!typing && e.key === 'Enter') { const sel = $('.d-icon.selected'); if (sel) WM.open(sel.dataset.iconApp, $('.tile', sel)); }
      if (e.altKey && (e.key === 'w' || e.key === 'W') && WM.top) { e.preventDefault(); WM.close(WM.top); }
    });

    // Parallax + Fluent reveal (rAF-throttled)
    let raf = 0, lx = 0, ly = 0, lt = null;
    document.addEventListener('pointermove', (e) => {
      lx = e.clientX; ly = e.clientY; lt = e.target;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!reduceMotion && !isTouch()) {
          const st = $('#stage').style;
          st.setProperty('--px', ((lx / innerWidth) * 2 - 1).toFixed(3));
          st.setProperty('--py', ((ly / innerHeight) * 2 - 1).toFixed(3));
        }
        const rv = lt && lt.closest && lt.closest('.reveal');
        if (rv) {
          const r = rv.getBoundingClientRect();
          rv.style.setProperty('--mx', lx - r.left + 'px');
          rv.style.setProperty('--my', ly - r.top + 'px');
        }
      });
    }, { passive: true });

    // Keep windows inside the screen on resize
    addEventListener('resize', () => {
      const A = WM.area();
      WM.wins.forEach((w) => {
        if (isMobile() && !w.max) WM.setMax(w, true, false);
        const el = w.el;
        el.style.width = Math.min(el.offsetWidth, A.width) + 'px';
        el.style.height = Math.min(el.offsetHeight, A.height) + 'px';
        el.style.left = Math.max(0, Math.min(el.offsetLeft, A.width - 120)) + 'px';
        el.style.top = Math.max(0, Math.min(el.offsetTop, A.height - 44)) + 'px';
      });
    });

    // Pause videos when the tab is hidden
    document.addEventListener('visibilitychange', () => {
      const v = Scenes.vids[Scenes.idx];
      if (!v) return;
      if (document.hidden) v.pause(); else v.play().catch(() => {});
    });
  }

  function refreshIcons() {
    $$('.d-icon').forEach((ic) => { ic.style.animation = 'none'; void ic.offsetWidth; ic.style.animation = ''; ic.style.animationDelay = `calc(var(--i) * 50ms)`; });
  }

  /* =========================================================
     Init
     ========================================================= */
  fillStatic();
  Scenes.init();
  Clock.start();
  bindGlobal();

  const hash = location.hash.replace('#', '');
  let visited = false;
  try { visited = sessionStorage.getItem('booted') === '1'; sessionStorage.setItem('booted', '1'); } catch (e) {}

  if (hash === 'simple') {
    Shell.boot(true);
    Shell.toDesktop(true);
    Simple.open();
  } else if (hash === 'desktop') {
    Shell.boot(true);
    Shell.toDesktop();
  } else {
    Shell.boot(visited || reduceMotion).then(() => Shell.toLock());
  }
})();
