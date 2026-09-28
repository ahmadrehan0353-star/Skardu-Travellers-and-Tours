/* ===========================================================
   Skardu Traveller and Tours — site scripts (v2)
   Load order: js/config.js, js/data.js, js/main.js
   =========================================================== */
(function () {
  "use strict";

  const C = (typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {});
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const bg = (url) => `background-image:url('${esc(url)}')`;
  // Your own photo first (image), then a backup (imageFallback) if the file isn't there yet
  const bgStack = (p) => p.imageFallback ? `background-image:url('${esc(p.image)}'),url('${esc(p.imageFallback)}')` : bg(p.image);

  /* ---------- Icons ---------- */
  const I = {
    logo: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="13" fill="#0E2F3D"/><circle cx="35" cy="13.5" r="4.2" fill="#F2A541"/><path d="M6 38 L19 15 L26 26 L30 20 L42 38 Z" fill="#fff"/><path d="M26 26 L30 20 L42 38 L26 38 Z" fill="#B9D3DE"/><path d="M19 15 L23.8 23.6 L21.4 22 L19 24.4 L16.6 22 L14.2 23.6 Z" fill="#F2A541"/><path d="M6 41.5 H42" stroke="#F2A541" stroke-width="2" stroke-linecap="round"/></svg>',
    peak: '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M3 34 L15 12 L22 23 L27 16 L37 34 Z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M11.5 18.5 L15 12 L18.5 18" stroke="#F2A541" stroke-width="2.4" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>'
  };

  /* ---------- Contact helpers ---------- */
  const isPlaceholder = (v) => !v || /\[.*\]/.test(v);
  const digits = (v) => String(v || "").replace(/\D/g, "");
  function whatsappURL(text) {
    if (isPlaceholder(C.whatsapp) || !digits(C.whatsapp)) return null;
    return `https://wa.me/${digits(C.whatsapp)}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  }
  function sendWhatsApp(text) {
    const url = whatsappURL(text);
    if (!url) { toast("Add your WhatsApp number in js/config.js to switch this on."); return; }
    window.open(url, "_blank", "noopener");
  }
  function sendEmail(subject, body) {
    if (isPlaceholder(C.email)) { toast("Add your email address in js/config.js to switch this on."); return; }
    window.location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3800);
  }

  /* ---------- Confetti ---------- */
  function confetti() {
    if (reduceMotion) return;
    const colors = ["#F2A541", "#7FB3C4", "#0E2F3D", "#FFFFFF", "#6B3F2A"];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.setProperty("--x", (Math.random() * 200 - 100) + "px");
      c.style.setProperty("--r", (Math.random() * 720) + "deg");
      c.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
      c.style.animationDelay = Math.random() * .4 + "s";
      c.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }
  }

  /* ---------- Header, footer, floating buttons ---------- */
  const PAGES = [
    ["index.html", "Home", "home"],
    ["destinations.html", "Destinations", "destinations"],
    ["tours.html", "Tours", "tours"],
    ["seasons.html", "Seasons", "seasons"],
    ["plan.html", "Plan a trip", "plan"]
  ];

  function renderChrome() {
    const page = document.body.dataset.page;
    const header = $("#site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML = `
        <nav class="wrap nav" aria-label="Main">
          <a class="brand" href="index.html" aria-label="${esc(C.businessName || "Skardu Traveller and Tours")} home">${I.logo}<span class="brand-text"><b>${esc(C.logoTop || "Skardu")}</b><small>${esc(C.logoSub || "Traveller & Tours")}</small></span></a>
          <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu">${I.menu}</button>
          <ul class="nav-links" id="nav-links">
            ${PAGES.map(([href, label, id]) => `<li><a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}
            <li><a class="btn btn-primary" href="contact.html"${page === "contact" ? ' aria-current="page"' : ""}>Contact us</a></li>
          </ul>
        </nav>`;
      const toggle = $(".nav-toggle", header), links = $("#nav-links");
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        toggle.innerHTML = open ? I.close : I.menu;
      });
      const onScroll = () => header.classList.toggle("solid", window.scrollY > 60);
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.className = "site-footer";
      const social = [
        C.facebook ? `<li><a href="${esc(C.facebook)}" target="_blank" rel="noopener">Facebook</a></li>` : "",
        C.instagram ? `<li><a href="${esc(C.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : ""
      ].join("");
      footer.innerHTML = `
        <div class="wrap">
          <div class="footer-grid">
            <div><div class="footer-brand">${esc(C.businessName || "")}</div><p>Trips across Skardu and Baltistan, planned by people who know the roads.</p></div>
            <div><h4>Explore</h4><ul>${PAGES.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}<li><a href="contact.html">Contact</a></li></ul></div>
            <div><h4>Get in touch</h4><ul>
              <li><a data-link="phone" data-config="phone" href="#"></a></li>
              <li><a data-link="whatsapp" href="#">WhatsApp: <span data-config="whatsapp"></span></a></li>
              <li><a data-link="email" data-config="email" href="#"></a></li>
              <li data-config="address"></li>${social}
            </ul></div>
          </div>
          <div class="footer-bottom">
            <span>© <span id="year"></span> ${esc(C.businessName || "")}</span>
            <span class="credit">Photos from Unsplash photographers</span>
          </div>
        </div>`;
      $("#year", footer).textContent = new Date().getFullYear();
    }

    // Scroll progress bar
    const bar = document.createElement("div"); bar.className = "progress"; bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    // Floating WhatsApp
    const fab = document.createElement("button");
    fab.className = "fab"; fab.setAttribute("aria-label", "Chat with us on WhatsApp");
    fab.innerHTML = `${I.whatsapp}<span class="fab-tip">Chat with us</span>`;
    fab.addEventListener("click", () => sendWhatsApp("Assalam o Alaikum! I'd like to know more about your tours."));
    document.body.appendChild(fab);
    setTimeout(() => { fab.classList.add("hello"); setTimeout(() => fab.classList.remove("hello"), 3500); }, 4000);

    // Back to top
    const top = document.createElement("button");
    top.className = "to-top"; top.setAttribute("aria-label", "Back to top"); top.innerHTML = I.up;
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
    document.body.appendChild(top);

    window.addEventListener("scroll", () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      top.classList.toggle("show", scrollY > 800);
    }, { passive: true });
  }

  function fillConfig() {
    $$("[data-config]").forEach((el) => { const v = C[el.dataset.config]; if (v !== undefined) el.textContent = v; });
    $$("[data-link]").forEach((el) => {
      const kind = el.dataset.link;
      let href = null;
      if (kind === "phone" && !isPlaceholder(C.phone)) href = "tel:" + C.phone.replace(/[^\d+]/g, "");
      if (kind === "email" && !isPlaceholder(C.email)) href = "mailto:" + C.email;
      if (kind === "whatsapp") href = whatsappURL("Assalam o Alaikum! I'd like to know more about your tours.");
      if (kind === "map" && C.mapLink) href = C.mapLink;
      if (href) { el.href = href; if (kind === "whatsapp" || kind === "map") { el.target = "_blank"; el.rel = "noopener"; } }
      else el.addEventListener("click", (e) => {
        e.preventDefault();
        toast(kind === "map" ? "Add a Google Maps link in js/config.js to switch this on." : `Add your ${kind === "phone" ? "phone number" : kind === "email" ? "email address" : "WhatsApp number"} in js/config.js to switch this on.`);
      });
    });
  }

  /* ---------- Button ripple ---------- */
  function initRipple() {
    document.addEventListener("pointerdown", (e) => {
      const b = e.target.closest(".btn, .chip"); if (!b || reduceMotion) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      if (getComputedStyle(b).position === "static") b.style.position = "relative";
      b.style.overflow = "hidden";
      b.appendChild(span);
      setTimeout(() => span.remove(), 650);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  let revealObserver;
  function observeReveals(root = document) {
    const els = $$(".reveal:not(.in)", root);
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    if (!revealObserver) revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach((e) => revealObserver.observe(e));
  }
  function initStagger() {
    $$("[data-stagger]").forEach((parent) => {
      Array.from(parent.children).forEach((c, i) => { c.classList.add("reveal"); c.style.setProperty("--d", i * 110 + "ms"); });
    });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    const els = $$("[data-count]"); if (!els.length) return;
    const run = (el) => {
      const end = +el.dataset.count, dur = 1400, t0 = performance.now();
      const step = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      reduceMotion ? (el.textContent = end) : requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold: .6 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Parallax backgrounds ---------- */
  function initParallax() {
    const layers = $$("[data-parallax]"); if (!layers.length || reduceMotion) return;
    let ticking = false;
    const update = () => {
      layers.forEach((l) => {
        const r = l.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const off = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(l.dataset.parallax);
        l.style.transform = `translate3d(0, ${off}px, 0)`;
      });
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* ---------- Page hero background ---------- */
  function initPageHero() {
    $$("[data-bg]").forEach((el) => { el.style.backgroundImage = `url('${el.dataset.bg}')`; });
    const hero = $(".page-hero"); if (!hero || !finePointer || reduceMotion) return;
    const inner = $(".wrap", hero), bgEl = $(".bg", hero);
    hero.addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      inner.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      bgEl.style.translate = `${x * -30}px ${y * -30}px`;
    });
    hero.addEventListener("pointerleave", () => { inner.style.transform = ""; bgEl.style.translate = ""; });
  }

  /* ---------- Home slideshow ---------- */
  function initSlideshow() {
    const box = $("#slides"); if (!box || typeof HERO_SLIDES === "undefined") return;
    const dots = $("#dots"), cap = $("#slide-caption");
    box.innerHTML = HERO_SLIDES.map((s, i) => `<div class="slide${i === 0 ? " active" : ""}" style="${bg(s.image)}"></div>`).join("");
    dots.innerHTML = HERO_SLIDES.map((s, i) => `<button type="button" aria-label="Show photo ${i + 1}: ${esc(s.caption)}"${i === 0 ? ' class="active"' : ""}><span></span></button>`).join("");
    let i = 0, timer;
    const show = (n) => {
      i = (n + HERO_SLIDES.length) % HERO_SLIDES.length;
      $$(".slide", box).forEach((s, k) => s.classList.toggle("active", k === i));
      $$("button", dots).forEach((d, k) => { d.classList.remove("active"); if (k === i) { void d.offsetWidth; d.classList.add("active"); } });
      cap.textContent = HERO_SLIDES[i].caption; cap.classList.remove("swap"); void cap.offsetWidth; cap.classList.add("swap");
      clearTimeout(timer); timer = setTimeout(() => show(i + 1), 6000);
    };
    dots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show($$("button", dots).indexOf(b)); });
    cap.textContent = HERO_SLIDES[0].caption;
    timer = setTimeout(() => show(1), 6000);
    // Preload the rest
    HERO_SLIDES.slice(1).forEach((s) => { const im = new Image(); im.src = s.image; });

    // Split headline into animated words
    const h1 = $(".hero h1");
    if (h1 && !reduceMotion) {
      const words = h1.textContent.trim().split(/\s+/);
      h1.setAttribute("aria-label", h1.textContent.trim());
      h1.innerHTML = words.map((w, k) => `<span class="word" aria-hidden="true"><span style="animation-delay:${150 + k * 90}ms">${esc(w)}</span></span>`).join(" ");
    }
  }


  /* ---------- Home hero: tilt with the phone (gyroscope) / mouse ---------- */
  function initHeroTilt() {
    const hero = $(".hero"); if (!hero || reduceMotion) return;
    const slides = $("#slides"), hint = $(".hero-hint");
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let tx = 0, ty = 0, x = 0, y = 0, live = false;
    const apply = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      if (slides) slides.style.translate = `${(-x * 60).toFixed(1)}px ${(-y * 40).toFixed(1)}px`;
      requestAnimationFrame(apply);
    };
    const onOrient = (e) => {
      if (e.gamma == null || e.beta == null) return;
      live = true;
      tx = Math.max(-.5, Math.min(.5, e.gamma / 45));
      ty = Math.max(-.5, Math.min(.5, (e.beta - 50) / 60));
    };
    const start = () => { addEventListener("deviceorientation", onOrient, { passive: true }); };
    if (finePointer) {
      hero.addEventListener("pointermove", (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
    }
    requestAnimationFrame(apply);
    if (!touch || typeof DeviceOrientationEvent === "undefined") return;
    document.body.classList.add("has-tilt");
    if (hint) hint.lastChild.textContent = "Tilt your phone to look around";
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      // iPhone / iPad: motion access needs one tap
      const b = document.createElement("button");
      b.type = "button"; b.className = "tilt-btn"; b.textContent = "Tap to enable tilt";
      $(".hero-foot", hero).prepend(b);
      b.addEventListener("click", () => {
        DeviceOrientationEvent.requestPermission().then((r) => { if (r === "granted") { start(); b.remove(); } else { b.textContent = "Tilt is turned off in Settings"; } }).catch(() => b.remove());
      });
    } else { start(); }
  }

  /* ---------- 3D tilt with light glare ---------- */
  function tilt(el, strength = 12) {
    if (!finePointer || reduceMotion) return;
    if (!el.querySelector(".glare")) { const g = document.createElement("span"); g.className = "glare"; el.appendChild(g); }
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateY(${(x - .5) * strength}deg) rotateX(${(.5 - y) * strength}deg) translateY(-6px) scale(1.02)`;
      el.style.setProperty("--gx", x * 100 + "%"); el.style.setProperty("--gy", y * 100 + "%");
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  }

  /* ---------- Place modal ---------- */
  let modal;
  function openPlace(p) {
    if (!modal) {
      modal = document.createElement("dialog"); modal.className = "modal"; document.body.appendChild(modal);
      modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
    }
    modal.innerHTML = `
      <button class="modal-close" aria-label="Close">${I.close}</button>
      <div style="overflow:hidden"><div class="modal-art" style="${bg(p.image)}" role="img" aria-label="${esc(p.name)}"></div></div>
      <div class="modal-body">
        <div class="area">${esc(p.area)}</div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.detail)}</p>
        <div class="actions">
          <button class="btn btn-primary" data-act="wa">${I.whatsapp}Ask us about this place</button>
          <a class="btn btn-ghost" href="plan.html?place=${encodeURIComponent(p.id)}">Add to my trip plan</a>
        </div>
      </div>`;
    $(".modal-close", modal).addEventListener("click", () => modal.close());
    $('[data-act="wa"]', modal).addEventListener("click", () => sendWhatsApp(`Assalam o Alaikum! I'm interested in visiting ${p.name}. Can you help me plan it?`));
    typeof modal.showModal === "function" ? modal.showModal() : modal.setAttribute("open", "");
  }

  /* ---------- Destinations ---------- */
  function initMoodFilter() {
    const chipsEl = $("#mood-chips"), grid = $("#place-grid"); if (!chipsEl || !grid) return;
    const limit = parseInt(grid.dataset.limit || "0", 10);
    const lineEl = $("#mood-line");
    const moods = limit ? MOODS.filter((m) => m.id !== "all") : MOODS;
    const param = new URLSearchParams(location.search).get("mood");
    let current = moods.some((m) => m.id === param) ? param : moods[0].id;
    chipsEl.innerHTML = moods.map((m) => `<button class="chip" type="button" data-mood="${m.id}" aria-pressed="${m.id === current}">${esc(m.label)}</button>`).join("");
    function draw() {
      let list = current === "all" ? PLACES : PLACES.filter((p) => p.moods.includes(current));
      if (limit) list = list.slice(0, limit);
      grid.innerHTML = list.map((p, i) => `
        <button class="photo-card pop-in" type="button" data-id="${p.id}" style="--d:${i * 90}ms">
          <div class="img" style="${bg(p.image)}"></div>
          <span class="tag">${esc(p.area)}</span>
          <div class="body"><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p><span class="more">Take a look ${I.arrow}</span></div>
        </button>`).join("");
      $$(".photo-card", grid).forEach(tilt);
      if (lineEl) { lineEl.textContent = moods.find((m) => m.id === current).line; lineEl.classList.remove("pop-in"); void lineEl.offsetWidth; lineEl.classList.add("pop-in"); }
    }
    chipsEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-mood]"); if (!b || b.dataset.mood === current) return;
      current = b.dataset.mood;
      $$("[data-mood]", chipsEl).forEach((c) => c.setAttribute("aria-pressed", c.dataset.mood === current));
      draw();
    });
    grid.addEventListener("click", (e) => { const b = e.target.closest("[data-id]"); if (b) openPlace(PLACES.find((p) => p.id === b.dataset.id)); });
    draw();
  }

  /* ---------- Quiz ---------- */
  function initQuiz() {
    const box = $("#quiz"); if (!box) return;
    let step = 0, score = {};
    const results = {
      adventure: { title: "The high-altitude soul", place: "deosai", text: "You want wide skies, cold air and a story to tell. Deosai and the road toward K2 are calling." },
      calm: { title: "The lakeside dreamer", place: "upper-kachura", text: "You travel to slow down. A boat on Upper Kachura and nowhere to be is your idea of perfect." },
      culture: { title: "The story collector", place: "shigar-fort", text: "Old wood, royal halls and the people who built them. Shigar and Khaplu were made for you." },
      family: { title: "The happy-crew captain", place: "shangrila", text: "Easy days, big smiles and no one tired. Shangrila and Manthokha keep everyone happy." }
    };
    const topMood = () => Object.keys(score).sort((a, b) => score[b] - score[a])[0];
    function draw() {
      if (step < QUIZ.length) {
        const q = QUIZ[step];
        box.innerHTML = `
          <div class="quiz-progress" aria-hidden="true"><span style="width:${(step / QUIZ.length) * 100}%"></span></div>
          <div class="quiz-step">
            <p class="kicker">Question ${step + 1} of ${QUIZ.length}</p>
            <div class="quiz-q">${esc(q.q)}</div>
            <div class="quiz-options">${q.a.map((a, i) => `<button type="button" data-i="${i}">${esc(a.t)}</button>`).join("")}</div>
          </div>`;
        requestAnimationFrame(() => requestAnimationFrame(() => { const bar = $(".quiz-progress span", box); if (bar) bar.style.width = ((step + 1) / QUIZ.length) * 100 + "%"; }));
      } else {
        const top = topMood(), r = results[top], p = PLACES.find((x) => x.id === r.place);
        box.innerHTML = `
          <div class="quiz-result quiz-step">
            <div class="photo" style="${bg(p.image)}"></div>
            <p class="kicker">You are…</p>
            <h3>${esc(r.title)}</h3>
            <p class="lead">${esc(r.text)}</p>
            <div class="actions">
              <button class="btn btn-primary" data-act="see">See ${esc(p.name)}</button>
              <a class="btn btn-ghost" href="destinations.html?mood=${top}#explore">More like this</a>
              <button class="btn btn-ghost" data-act="again">Try again</button>
            </div>
          </div>`;
        confetti();
      }
    }
    box.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-i]");
      if (opt) { const m = QUIZ[step].a[+opt.dataset.i].m; score[m] = (score[m] || 0) + 1; step++; draw(); return; }
      const act = e.target.closest("[data-act]"); if (!act) return;
      if (act.dataset.act === "again") { step = 0; score = {}; draw(); }
      if (act.dataset.act === "see") openPlace(PLACES.find((x) => x.id === results[topMood()].place));
    });
    draw();
  }

  /* ---------- Tours: 3D flip cards ---------- */
  function initTours() {
    const grid = $("#tour-grid"); if (!grid) return;
    const limit = parseInt(grid.dataset.limit || "0", 10);
    const list = limit ? TOURS.slice(0, limit) : TOURS;
    const priceText = (t) => /request/i.test(t.price) ? esc(t.price) : "From " + esc(t.price);
    const daysText = (t) => esc(t.days) + (/^\[|^\d/.test(t.days) ? " days" : "");
    grid.innerHTML = list.map((t, i) => `
      <article class="tour3d reveal" style="--d:${i * 110}ms" id="tour-${t.id}">
        <div class="flipper">
          <div class="side front">
            <div class="img" style="${bg(t.image)}"></div>
            <span class="days">${daysText(t)}</span>
            <h3>${esc(t.name)}</h3>
            <div class="price">${priceText(t)}</div>
            <button class="btn btn-ghost flip-btn" type="button" data-flip aria-label="See details for ${esc(t.name)}">See the route</button>
          </div>
          <div class="side back" aria-hidden="true">
            <h3>${esc(t.name)}</h3>
            <p>${esc(t.blurb)}</p>
            <ol class="route" aria-label="Route">${t.stops.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
            <p class="tour-includes">Includes: ${esc(t.includes)}</p>
            <div class="tour-price">${priceText(t)}</div>
            <div class="actions">
              <button class="btn btn-primary" type="button" data-tour="${t.id}">${I.whatsapp}Ask about this tour</button>
              <button class="btn btn-ghost" type="button" data-flip>Flip back</button>
            </div>
          </div>
        </div>
      </article>`).join("");
    grid.addEventListener("click", (e) => {
      const f = e.target.closest("[data-flip]");
      if (f) {
        const card = f.closest(".tour3d"), on = card.classList.toggle("flipped");
        $(".back", card).setAttribute("aria-hidden", !on); $(".front", card).setAttribute("aria-hidden", on);
        setTimeout(() => $(on ? ".back [data-tour]" : ".front [data-flip]", card).focus({ preventScroll: true }), 450);
        return;
      }
      const b = e.target.closest("[data-tour]"); if (!b) return;
      const t = TOURS.find((x) => x.id === b.dataset.tour);
      sendWhatsApp(`Assalam o Alaikum! I'm interested in the "${t.name}" tour. Could you share dates and prices?`);
    });
    observeReveals(grid);
  }

  /* ---------- Pyramid carousel of destinations ---------- */
  function initRing() {
    const stage = $("#ring-stage"); if (!stage) return;
    const ring = $(".ring", stage), nameEl = $("#ring-name");
    const N = PLACES.length;
    // pos = the front card's position, as a continuous "index" (not degrees).
    let cw, spacingX, dropStep, pos = 0, vel = 0, dragging = false, lastX = 0, hover = false, moved = 0, frontIdx = -1;
    ring.innerHTML = PLACES.map((p, i) => `
      <button class="ring-card" type="button" data-id="${p.id}" tabindex="-1" aria-label="${esc(p.name)}">
        <div class="img" style="${bgStack(p)}"></div>
        <div class="body"><div class="area">${esc(p.area)}</div><h3>${esc(p.name)}</h3></div>
      </button>`).join("");
    const cards = $$(".ring-card", ring);
    function layout() {
      // Bigger cards so the front one reads clearly.
      cw = Math.max(230, Math.min(360, stage.clientWidth * 0.34));
      stage.style.setProperty("--cw", cw + "px");
      spacingX = cw * 0.56;   // how far each step sits from the one before it, sideways
      dropStep = cw * 0.24;   // how far each step drops, pyramid-style
    }
    layout(); addEventListener("resize", layout);
    function render() {
      const idx = ((Math.round(pos) % N) + N) % N;
      if (idx !== frontIdx) {
        frontIdx = idx;
        cards.forEach((c, i) => { c.classList.toggle("front", i === idx); c.tabIndex = i === idx ? 0 : -1; });
        nameEl.textContent = PLACES[idx].name; nameEl.classList.remove("swap"); void nameEl.offsetWidth; nameEl.classList.add("swap");
      }
      cards.forEach((c, i) => {
        // shortest signed distance from this card to the front position, in "cards"
        let offset = (i - pos) % N;
        if (offset > N / 2) offset -= N; else if (offset < -N / 2) offset += N;
        const ax = Math.abs(offset);
        const tx = offset * spacingX;
        const ty = Math.min(ax, 3.4) * dropStep;                 // steps down like a pyramid, either side of the peak
        const scale = Math.max(0.46, 1 - ax * 0.15);
        const rot = Math.max(-10, Math.min(10, offset * 2.4));
        const fade = Math.max(0, 1 - ax / 3.4);                  // 1 at front → 0 about 3.4 cards away
        c.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        c.style.zIndex = Math.round(400 - ax * 10);
        c.style.opacity = (0.06 + 0.94 * fade * fade * (3 - 2 * fade)).toFixed(3);
        c.style.filter = `brightness(${0.55 + Math.max(0, 1 - ax * 0.3) * 0.45})`;
        c.style.pointerEvents = fade > 0.02 ? "" : "none";
      });
    }
    let snapTarget = null;
    function loop() {
      if (!dragging) {
        if (snapTarget !== null) { pos += (snapTarget - pos) * 0.14; if (Math.abs(snapTarget - pos) < .002) { pos = snapTarget; snapTarget = null; } }
        else if (Math.abs(vel) > 0.0008) { pos += vel; vel *= 0.92; }
        else if (!hover && !reduceMotion) pos += 0.0035;
      }
      render();
      requestAnimationFrame(loop);
    }
    stage.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; vel = 0; moved = 0; snapTarget = null; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); vel = -dx / spacingX; pos -= dx / spacingX; });
    const end = () => { dragging = false; };
    stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
    stage.addEventListener("pointerenter", () => { hover = true; }); stage.addEventListener("pointerleave", () => { hover = false; });
    stage.addEventListener("click", (e) => {
      if (moved > 8) return;
      const c = e.target.closest(".ring-card"); if (!c) return;
      const i = cards.indexOf(c);
      if (i === frontIdx) openPlace(PLACES[i]);
      else { let offset = (i - pos) % N; if (offset > N / 2) offset -= N; else if (offset < -N / 2) offset += N; snapTarget = pos + offset; }
    });
    const go = (d) => { vel = 0; snapTarget = Math.round(pos) + d; };
    $("#ring-prev").addEventListener("click", () => go(-1));
    $("#ring-next").addEventListener("click", () => go(1));
    stage.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); });
    requestAnimationFrame(loop);
  }

  /* ---------- Seasons: background crossfade + 3D cube ---------- */
  function initSeasons() {
    const stage = $("#season-stage"); if (!stage) return;
    const chips = $("#season-chips"), cube = $("#cube");
    let idx = SEASONS.findIndex((s) => s.id === MONTHS[new Date().getMonth()].s), turn = -idx * 90;
    stage.insertAdjacentHTML("afterbegin", SEASONS.map((s) => `<div class="season-bg" data-s="${s.id}" style="${bg(s.image)}"></div>`).join(""));
    chips.innerHTML = SEASONS.map((s, i) => `<button class="chip" type="button" data-season="${i}" aria-pressed="${i === idx}">${s.name}</button>`).join("");
    cube.innerHTML = SEASONS.map((s) => `
      <div class="cube-face" style="${bg(s.image)}">
        <div class="months">${esc(s.months)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><p class="good">Good for: ${esc(s.good)}</p>
      </div>`).join("");
    function draw() {
      cube.style.transform = `translateZ(calc(var(--cs) / -2)) rotateY(${turn}deg)`;
      $$(".season-bg", stage).forEach((b, i) => b.classList.toggle("active", i === idx));
      $$("[data-season]", chips).forEach((c, i) => c.setAttribute("aria-pressed", i === idx));
      $$(".cube-face", cube).forEach((f, i) => f.setAttribute("aria-hidden", i !== idx));
    }
    function goTo(n) {
      const next = ((n % 4) + 4) % 4;
      let diff = next - idx; if (diff > 2) diff -= 4; if (diff < -2) diff += 4;   // shortest spin
      turn -= diff * 90; idx = next; draw();
    }
    chips.addEventListener("click", (e) => { const b = e.target.closest("[data-season]"); if (b) goTo(+b.dataset.season); });
    // Drag / swipe the cube
    let sx = null;
    cube.parentElement.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    cube.parentElement.addEventListener("pointerup", (e) => { if (sx === null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 40) goTo(idx + (dx < 0 ? 1 : -1)); else goTo(idx + 1); sx = null; });
    draw();
  }

  function initMonths() {
    const row = $("#months-row"), note = $("#month-note"); if (!row) return;
    const names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let current = new Date().getMonth();
    row.innerHTML = MONTHS.map((x, i) => `<button class="month" type="button" data-m="${i}" aria-pressed="${i === current}" style="${bg(SEASONS.find((s) => s.id === x.s).image)}"><span>${x.m}</span></button>`).join("");
    const draw = () => {
      note.innerHTML = `<strong>${names[current]}${current === new Date().getMonth() ? " (this month)" : ""}.</strong> ${esc(MONTHS[current].note)}`;
      note.classList.remove("swap"); void note.offsetWidth; note.classList.add("swap");
    };
    row.addEventListener("click", (e) => {
      const b = e.target.closest("[data-m]"); if (!b) return;
      current = +b.dataset.m;
      $$("[data-m]", row).forEach((c) => c.setAttribute("aria-pressed", +c.dataset.m === current));
      draw();
    });
    draw();
  }

  /* ---------- Facts (flip card) ---------- */
  function initFacts() {
    const box = $("#fact"); if (!box) return;
    let i = 0, flipped = false;
    box.innerHTML = `
      <div class="fact-stage"><div class="fact-card">
        <div class="fact-face fact-front"><p></p><span class="hint">Did you know?</span></div>
        <div class="fact-face fact-back"><p></p><span class="hint">Did you know?</span></div>
      </div></div>
      <div class="fact-controls">
        <button class="round-btn" type="button" data-f="-1" aria-label="Previous fact">${I.left}</button>
        <button class="btn btn-primary" type="button" data-f="1">Tell me another</button>
        <span class="fact-count" aria-live="polite"></span>
      </div>`;
    const card = $(".fact-card", box), front = $(".fact-front p", box), back = $(".fact-back p", box), count = $(".fact-count", box);
    front.textContent = FACTS[0]; count.textContent = `1 of ${FACTS.length}`;
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-f]"); if (!b) return;
      i = (i + parseInt(b.dataset.f, 10) + FACTS.length) % FACTS.length;
      (flipped ? front : back).textContent = FACTS[i];
      flipped = !flipped; card.classList.toggle("flipped", flipped);
      count.textContent = `${i + 1} of ${FACTS.length}`;
    });
  }

  /* ---------- Gallery + lightbox ---------- */
  function initGallery() {
    const box = $("#gallery"); if (!box || typeof GALLERY === "undefined") return;
    box.innerHTML = GALLERY.map((g, i) => `<button type="button" class="reveal zoom" style="--d:${(i % 4) * 90}ms" data-g="${i}" aria-label="Open photo: ${esc(g.alt)}"><img src="${esc(g.image)}" alt="${esc(g.alt)}" loading="lazy"></button>`).join("");
    observeReveals(box);
    $$("button", box).forEach((b) => tilt(b, 8));
    const lb = document.createElement("dialog"); lb.className = "lightbox";
    lb.innerHTML = `<div class="inner"><img alt=""></div>
      <button class="lb-btn lb-close" aria-label="Close">${I.close}</button>
      <button class="lb-btn lb-prev" aria-label="Previous photo">${I.left}</button>
      <button class="lb-btn lb-next" aria-label="Next photo">${I.right}</button>`;
    document.body.appendChild(lb);
    let i = 0; const img = $("img", lb);
    const show = (n) => { i = (n + GALLERY.length) % GALLERY.length; img.src = GALLERY[i].image.replace("w=1200", "w=2000"); img.alt = GALLERY[i].alt; img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; };
    box.addEventListener("click", (e) => { const b = e.target.closest("[data-g]"); if (!b) return; show(+b.dataset.g); lb.showModal(); });
    $(".lb-close", lb).addEventListener("click", () => lb.close());
    $(".lb-prev", lb).addEventListener("click", () => show(i - 1));
    $(".lb-next", lb).addEventListener("click", () => show(i + 1));
    lb.addEventListener("click", (e) => { if (e.target.classList.contains("inner")) lb.close(); });
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    // swipe
    let sx = null;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* ---------- Trip planner ---------- */
  function initPlanner() {
    const form = $("#planner"); if (!form) return;
    const state = { travellers: 2, days: 5 };
    const limits = { travellers: [1, 40], days: [1, 30] };
    const params = new URLSearchParams(location.search);
    const checks = $("#place-checks");
    checks.innerHTML = PLACES.map((p) => `<label class="check"><input type="checkbox" name="places" value="${esc(p.name)}" data-img="${esc(p.image)}"${p.id === params.get("place") ? " checked" : ""}><span>${esc(p.name)}</span></label>`).join("");
    const tourSel = $("#tour-select");
    tourSel.innerHTML = `<option value="">Not sure yet</option>` + TOURS.map((t) => `<option>${esc(t.name)}</option>`).join("");
    const t = TOURS.find((x) => x.id === params.get("tour")); if (t) tourSel.value = t.name;

    $$("[data-step]", form).forEach((b) => b.addEventListener("click", () => {
      const [key, dir] = b.dataset.step.split(":"), [min, max] = limits[key];
      const next = Math.min(max, Math.max(min, state[key] + parseInt(dir, 10)));
      const out = $(`#out-${key}`);
      if (next === state[key]) { toast(`That's the ${dir > 0 ? "most" : "fewest"} ${key} the planner handles. Tell us in the notes if you need more.`); return; }
      state[key] = next; out.textContent = next;
      out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump");
      update();
    }));
    const idea = (d) => d <= 3 ? "Enough for the lakes around Skardu and a desert sunset."
      : d <= 6 ? "Lakes, Deosai and a heritage night in Shigar fit nicely."
      : d <= 10 ? "Add Khaplu, Manthokha and a slower pace everywhere."
      : "Long enough to think about the trek toward K2.";
    const values = () => {
      const f = new FormData(form);
      return { name: (f.get("name") || "").trim(), date: f.get("date") || "", style: f.get("style") || "Comfort", tour: f.get("tour") || "", places: f.getAll("places"), notes: (f.get("notes") || "").trim() };
    };
    const photo = $("#sum-photo");
    function update() {
      const v = values();
      $("#sum-group").textContent = `${state.travellers} ${state.travellers === 1 ? "traveller" : "travellers"}`;
      $("#sum-days").textContent = `${state.days} ${state.days === 1 ? "day" : "days"}`;
      $("#sum-style").textContent = v.style;
      $("#sum-date").textContent = v.date ? new Date(v.date + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "Flexible";
      $("#sum-places").textContent = v.places.length ? `${v.places.length} picked` : "Open to ideas";
      $("#sum-idea").textContent = idea(state.days);
      const last = $$("#place-checks input:checked").pop();
      if (photo) photo.style.backgroundImage = `url('${last ? last.dataset.img : HERO_SLIDES[0].image}')`;
    }
    const message = () => {
      const v = values();
      return [`Assalam o Alaikum! I'd like to plan a trip with ${C.businessName}.`, v.name ? `Name: ${v.name}` : "", `Travellers: ${state.travellers}`, `Days: ${state.days}`, `Style: ${v.style}`, `Start date: ${v.date || "Flexible"}`, v.tour ? `Tour: ${v.tour}` : "", v.places.length ? `Places: ${v.places.join(", ")}` : "", v.notes ? `Notes: ${v.notes}` : ""].filter(Boolean).join("\n");
    };
    const valid = () => {
      const field = $("#f-name").closest(".field"), ok = values().name.length > 1;
      field.classList.remove("invalid"); void field.offsetWidth; field.classList.toggle("invalid", !ok);
      if (!ok) $("#f-name").focus();
      return ok;
    };
    form.addEventListener("input", update); form.addEventListener("change", update);
    $("#send-wa").addEventListener("click", () => { if (valid()) { confetti(); sendWhatsApp(message()); } });
    $("#send-mail").addEventListener("click", () => { if (valid()) sendEmail(`Trip plan from ${values().name}`, message()); });
    form.addEventListener("submit", (e) => e.preventDefault());
    const d = $("#f-date"); if (d) d.min = new Date().toISOString().slice(0, 10);
    update();
  }

  /* ---------- Contact ---------- */
  function initContactCards() {
    const box = $("#contact-cards"); if (!box) return;
    const cards = [["phone", I.phone, "Call us", "phone"], ["whatsapp", I.whatsapp, "WhatsApp", "whatsapp"], ["email", I.mail, "Email", "email"], ["map", I.pin, "Visit our office", "address"], [null, I.clock, "Office hours", "hours"]];
    box.innerHTML = cards.map(([link, icon, label, key], i) => link
      ? `<a class="contact-card reveal" style="--d:${i * 90}ms" href="#" data-link="${link}">${icon}<span class="label">${label}</span><span class="value" data-config="${key}"></span></a>`
      : `<div class="contact-card reveal" style="--d:${i * 90}ms">${icon}<span class="label">${label}</span><span class="value" data-config="${key}"></span></div>`).join("");
  }
  function initContactForm() {
    const form = $("#contact-form"); if (!form) return;
    const check = () => {
      let ok = true;
      [["#c-name", (v) => v.trim().length > 1], ["#c-msg", (v) => v.trim().length > 4]].forEach(([sel, test]) => {
        const el = $(sel), f = el.closest(".field"), good = test(el.value);
        f.classList.remove("invalid"); void f.offsetWidth; f.classList.toggle("invalid", !good);
        if (!good && ok) { el.focus(); ok = false; }
      });
      return ok;
    };
    const msg = () => { const f = new FormData(form); return [`Assalam o Alaikum! My name is ${f.get("name")}.`, f.get("phone") ? `Phone: ${f.get("phone")}` : "", "", f.get("message")].join("\n"); };
    $("#c-wa").addEventListener("click", () => { if (check()) sendWhatsApp(msg()); });
    $("#c-mail").addEventListener("click", () => { if (check()) sendEmail(`Message from ${new FormData(form).get("name")}`, msg()); });
    form.addEventListener("submit", (e) => e.preventDefault());
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderChrome();
    initContactCards();
    fillConfig();
    initPageHero();
    initSlideshow();
    initHeroTilt();
    initStagger();
    initMoodFilter();
    initQuiz();
    initTours();
    initRing();
    initSeasons();
    initMonths();
    initFacts();
    initGallery();
    initPlanner();
    initContactForm();
    initCounters();
    initParallax();
    initRipple();
    observeReveals();
  });
})();
