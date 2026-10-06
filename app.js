// Comportamiento de la página. El contenido ya viene en index.html (generado por build.mjs).
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: borde más marcado al dejar el hero ---------- */
  const nav = $("#nav");
  new IntersectionObserver(([e]) => nav.classList.toggle("is-scrolled", !e.isIntersecting))
    .observe($(".hero__title"));

  /* ---------- Hero: simulación de tablero OEE ---------- */
  const kpiBase = [0.91, 0.86, 0.975];
  const kpi = kpiBase.slice();
  const series = Array.from({ length: 28 }, (_, i) => 1180 + Math.sin(i / 3) * 60 + (Math.random() - 0.5) * 70);
  const alerts = [
    "Microparada en llenadora L2 · 4 min",
    "Cambio de formato fuera de estándar · +7 min",
    "Scrap por encima del umbral en etiquetadora",
  ];
  let alertIdx = 0;

  function drawSpark() {
    const min = Math.min(...series) - 40, max = Math.max(...series) + 40;
    const pts = series.map((v, i) => [(i / (series.length - 1)) * 300, 70 - ((v - min) / (max - min)) * 64 - 3]);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    $("#spark-line").setAttribute("d", line);
    $("#spark-area").setAttribute("d", `${line} L300,70 L0,70 Z`);
    $("#t-uph").textContent = `${Math.round(series[series.length - 1]).toLocaleString("es-AR")} u/h`;
  }
  function drawKpis() {
    const oee = kpi[0] * kpi[1] * kpi[2];
    $("#g-oee").style.strokeDashoffset = (314.16 * (1 - oee)).toFixed(2);
    $("#t-oee").textContent = `${(oee * 100).toFixed(1)}%`;
    kpi.forEach((v, i) => {
      $(`#t-k${i}`).textContent = `${(v * 100).toFixed(1)}%`;
      $(`#b-k${i}`).style.width = `${(v * 100).toFixed(1)}%`;
    });
  }
  function tick() {
    kpi.forEach((v, i) => {
      kpi[i] = Math.min(0.995, Math.max(kpiBase[i] - 0.03, v + (Math.random() - 0.5) * 0.012));
    });
    series.shift();
    series.push(series[series.length - 1] + (Math.random() - 0.48) * 60);
    drawKpis();
    drawSpark();
  }
  function nextAlert() {
    alertIdx = (alertIdx + 1) % alerts.length;
    $("#t-alert").textContent = alerts[alertIdx];
  }
  // Primer render diferido para que el anillo y las barras animen desde 0
  requestAnimationFrame(() => setTimeout(() => { drawKpis(); drawSpark(); }, 250));
  if (!reduceMotion) {
    let timers = [];
    const start = () => { timers = [setInterval(tick, 2200), setInterval(nextAlert, 6600)]; };
    const stop = () => timers.forEach(clearInterval);
    start();
    // Pausar cuando la pestaña no está visible
    document.addEventListener("visibilitychange", () => { stop(); if (!document.hidden) start(); });
  }

  /* ---------- VideoModalWrapper ---------- */
  const modal = $("#video-modal");
  const media = $("#video-media");
  function openVideo(btn) {
    const src = (btn.dataset.videoSrc || "").trim();
    const title = btn.dataset.videoTitle || "";
    if (!src) {
      media.innerHTML = `
        <div class="video-empty">
          <i class="ph ph-film-slate" aria-hidden="true"></i>
          <h3>${esc(title)}</h3>
          <p>Estamos terminando de grabar esta demo. Pedí el diagnóstico y te la mostramos en vivo con datos de tu operación.</p>
          <a href="#diagnostico" class="btn btn--primary btn--sm" data-close>${esc(modal.dataset.cta)}</a>
        </div>`;
    } else if (/youtube|youtu\.be|vimeo/.test(src)) {
      media.innerHTML = `<iframe src="${esc(src)}${src.includes("?") ? "&" : "?"}autoplay=1" title="${esc(title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      media.innerHTML = `<video src="${esc(src)}" controls autoplay playsinline></video>`;
    }
    modal.showModal();
  }
  const closeVideo = () => modal.close();
  modal.addEventListener("close", () => { media.innerHTML = ""; });
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) closeVideo();
  });
  $("#video-close").addEventListener("click", closeVideo);
  $$(".video-card").forEach((b) => b.addEventListener("click", () => openVideo(b)));

  /* ---------- Matriz de impacto (pestañas) ---------- */
  const tabs = $$(".impact-tab");
  const panels = $$(".impact__panel");

  function selectImpact(i, focus) {
    tabs.forEach((t, j) => {
      t.setAttribute("aria-selected", String(j === i));
      t.tabIndex = j === i ? 0 : -1;
    });
    panels.forEach((p, j) => { p.hidden = j !== i; });
    countUp($(".impact__metric", panels[i]));
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => t.addEventListener("click", () => selectImpact(i)));
  $(".impact__tabs").addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const cur = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    selectImpact((cur + dir + tabs.length) % tabs.length, true);
  });

  function countUp(el) {
    const m = /^(-?)(\d+)(%?)$/.exec(el.dataset.count || "");
    if (!m || reduceMotion) return;
    const [, sign, num, pct] = m;
    const target = Number(num);
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 700);
      el.textContent = `${sign}${Math.round(target * (1 - Math.pow(1 - p, 3)))}${pct}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Formulario ---------- */
  const form = $("#booking-form");
  const submitBtn = $("#form-submit");
  const status = $("#form-status");
  const endpoint = form.dataset.endpoint;
  const fallbackEmail = form.dataset.fallbackEmail;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, errId, msg) {
    $(errId).textContent = msg || "";
    input.closest(".field").classList.toggle("has-error", !!msg);
    if (input.type !== "checkbox") input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) input.setAttribute("aria-describedby", errId.slice(1));
  }

  function validate() {
    const name = $("#f-name"), company = $("#f-company"), email = $("#f-email"), phone = $("#f-phone");
    const areas = $$("input[name=area]:checked", form);
    let firstBad = null;
    const check = (ok, input, errId, msg) => {
      setError(input, errId, ok ? "" : msg);
      if (!ok && !firstBad) firstBad = input;
    };
    check(name.value.trim().length >= 2, name, "#f-name-err", "Ingresá tu nombre.");
    check(company.value.trim().length >= 2, company, "#f-company-err", "Ingresá el nombre de tu empresa.");
    check(emailRe.test(email.value.trim()), email, "#f-email-err", "Ingresá un email válido, por ejemplo nombre@empresa.com.");
    check(!phone.value.trim() || /^[\d\s+()-]{6,}$/.test(phone.value.trim()), phone, "#f-phone-err", "Revisá el número: solo dígitos, espacios y +.");
    check(areas.length > 0, $("#area-0"), "#f-area-err", "Elegí al menos un área.");
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Revalidar en vivo los campos que ya mostraron error
  form.addEventListener("input", (e) => {
    const f = e.target.closest(".field");
    if (f && f.classList.contains("has-error")) validate();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");
    if (!validate()) return;

    const data = {
      nombre: $("#f-name").value.trim(),
      empresa: $("#f-company").value.trim(),
      email: $("#f-email").value.trim(),
      telefono: $("#f-phone").value.trim(),
      areas: $$("input[name=area]:checked", form).map((i) => i.value),
    };

    const label = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>Enviando solicitud</span>`;

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const body = [
          `Nombre: ${data.nombre}`, `Empresa: ${data.empresa}`, `Email: ${data.email}`,
          `WhatsApp: ${data.telefono || "-"}`, `Áreas: ${data.areas.join(", ")}`,
        ].join("\n");
        window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent("Solicitud de diagnóstico técnico: " + data.empresa)}&body=${encodeURIComponent(body)}`;
      }
      form.hidden = true;
      const ok = $("#form-success");
      ok.hidden = false;
      ok.setAttribute("tabindex", "-1");
      ok.focus();
    } catch (err) {
      status.textContent = `No pudimos enviar la solicitud. Probá de nuevo o escribinos a ${fallbackEmail}.`;
      status.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = label;
    }
  });

  /* ---------- Revelado por scroll ---------- */
  const method = $("#method");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    method.classList.add("is-in");
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
    io.observe(method);
  }
})();
