/* CSIS 3280 · Lecture 6 — shared interactions */
(function () {
  "use strict";

  const root = document.documentElement;
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));

  /* Theme --------------------------------------------------------------- */
  const themeButton = $("[data-theme-toggle]");
  function refreshThemeButton() {
    if (!themeButton) return;
    const dark = root.getAttribute("data-theme") === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeButton.setAttribute("title", dark ? "Light theme" : "Dark theme");
  }
  if (themeButton) {
    refreshThemeButton();
    themeButton.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("lecture06-theme", next); } catch (e) {}
      refreshThemeButton();
    });
  }

  /* Mobile contents drawer --------------------------------------------- */
  const toc = $("#toc");
  const tocButton = $("[data-toc-toggle]");
  const tocBackdrop = $(".toc-backdrop");
  function setToc(open) {
    if (!toc || !tocButton) return;
    toc.classList.toggle("is-open", open);
    if (tocBackdrop) tocBackdrop.classList.toggle("is-open", open);
    tocButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open && window.matchMedia("(max-width: 980px)").matches);
  }
  if (tocButton) {
    tocButton.addEventListener("click", () => setToc(!toc.classList.contains("is-open")));
  }
  if (tocBackdrop) tocBackdrop.addEventListener("click", () => setToc(false));
  $$("#toc a").forEach((a) => a.addEventListener("click", () => setToc(false)));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      if (toc) toc.classList.remove("is-open");
      if (tocBackdrop) tocBackdrop.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  });

  /* Code blocks: header + copy ----------------------------------------- */
  $$("pre").forEach((pre) => {
    if (pre.closest(".hero-card") || pre.closest(".file-tree")) return;
    const code = pre.querySelector("code");
    const lang = pre.dataset.lang || (code && code.dataset.lang) || "code";
    const title = pre.dataset.title || "";
    const wrapper = document.createElement("div");
    wrapper.className = "code-block" + (pre.classList.contains("output") ? " output" : "");
    const head = document.createElement("div");
    head.className = "code-head";

    const label = document.createElement("div");
    label.className = "code-lang";
    label.textContent = lang;
    if (title) {
      const t = document.createElement("span");
      t.className = "code-title";
      t.textContent = title;
      label.appendChild(t);
    }

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-btn";
    copy.textContent = "Copy";
    copy.setAttribute("aria-label", "Copy code to clipboard");
    copy.addEventListener("click", async () => {
      const text = pre.innerText.replace(/\n$/, "");
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); } catch (e2) {}
        document.body.removeChild(area);
      }
      copy.textContent = "Copied";
      copy.classList.add("is-copied");
      window.setTimeout(() => {
        copy.textContent = "Copy";
        copy.classList.remove("is-copied");
      }, 1600);
    });

    head.append(label, copy);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.append(head, pre);
  });

  /* Progress bar + back to top ----------------------------------------- */
  const bar = $(".reading-progress");
  const backTop = $(".back-top");
  let ticking = false;
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    if (bar) bar.style.width = pct + "%";
    if (backTop) backTop.classList.toggle("is-visible", window.scrollY > 700);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* Active table of contents ------------------------------------------- */
  const tocLinks = $$("#toc a[href^='#']");
  const linkById = new Map(tocLinks.map((a) => [decodeURIComponent(a.getAttribute("href").slice(1)), a]));
  const targets = $$("main [id]").filter((el) => linkById.has(el.id));
  if (targets.length) {
    let activeId = null;
    let tocTick = false;
    function updateActiveToc() {
      tocTick = false;
      const marker = 140;
      let current = targets[0];
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top <= marker) current = el;
      });
      if (current.id === activeId) return;
      activeId = current.id;
      tocLinks.forEach((a) => a.classList.remove("is-active"));
      const link = linkById.get(current.id);
      if (link) {
        link.classList.add("is-active");
        if (toc) {
          const linkRect = link.getBoundingClientRect();
          const tocRect = toc.getBoundingClientRect();
          const pad = 24;
          if (linkRect.top < tocRect.top + pad || linkRect.bottom > tocRect.bottom - pad) {
            toc.scrollTop += linkRect.top - tocRect.top - tocRect.height * 0.3;
          }
        }
      }
    }
    window.addEventListener("scroll", () => {
      if (!tocTick) {
        tocTick = true;
        window.requestAnimationFrame(updateActiveToc);
      }
    }, { passive: true });
    window.addEventListener("resize", updateActiveToc);
    updateActiveToc();
  }

  /* Original-slide lightbox -------------------------------------------- */
  const lightbox = $("#lightbox");
  if (lightbox) {
    const image = $("#lightbox-img");
    const title = $("#lightbox-title");
    const openLink = $("#lightbox-open");
    const closeBtn = $(".lightbox-close", lightbox);
    let lastFocus = null;

    const chinese = (root.lang || "").toLowerCase().startsWith("zh");
    function openLightbox(src, slideLabel) {
      lastFocus = document.activeElement;
      image.src = src;
      image.alt = (chinese ? "讲义原始幻灯片 " : "Original lecture slide ") + slideLabel;
      title.textContent = (chinese ? "原始幻灯片 " : "Original slide ") + slideLabel;
      openLink.href = src;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      if (closeBtn) window.setTimeout(() => closeBtn.focus(), 200);
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      if (lastFocus) lastFocus.focus();
    }

    $$("[data-lightbox]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openLightbox(btn.dataset.lightbox, btn.dataset.slide || "");
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (lightbox.classList.contains("is-open")) closeLightbox();
        setToc(false);
      }
    });
  }

  /* Current year -------------------------------------------------------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
