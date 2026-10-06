// Genera index.html, robots.txt y sitemap.xml a partir de content.js.
// Uso: node build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "content.js"), "utf8"), sandbox);
const C = sandbox.window.SITE_CONTENT;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const bracket = (s) => `[ ${esc(s)} ]`;
const siteUrl = C.site.url.replace(/\/$/, "");
const canonical = `${siteUrl}/`;
const year = new Date().getFullYear();
const today = new Date().toISOString().slice(0, 10);

const logo = `
        <span class="logo__mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="logo__name">${esc(C.brand.name)}</span>`;

/* ---------- Datos estructurados (schema.org) ---------- */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: C.brand.name,
  url: canonical,
  description: C.site.description,
  slogan: C.hero.headline,
  knowsAbout: [
    ...C.teamSkills.map((t) => t.area),
    "Software a medida", "Tableros OEE", "Automatización industrial", "Inteligencia artificial aplicada",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Soluciones",
    itemListElement: C.solutions.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.benefit },
    })),
  },
  ...(C.site.ogImage ? { image: new URL(C.site.ogImage, canonical).href } : {}),
};

const ogImage = C.site.ogImage
  ? `
  <meta property="og:image" content="${esc(new URL(C.site.ogImage, canonical).href)}" />
  <meta name="twitter:card" content="summary_large_image" />`
  : `
  <meta name="twitter:card" content="summary" />`;

/* ---------- Secciones ---------- */
const dashboard = `
          <div class="dash" role="img" aria-label="Ejemplo de tablero de control OEE de una línea de envasado">
            <span class="metric-pill metric-pill--a" aria-hidden="true"><b>-20%</b> paradas</span>
            <span class="metric-pill metric-pill--b" aria-hidden="true"><b>-60%</b> tiempo de reportes</span>
            <div class="dash__head" aria-hidden="true">
              <div class="dash__title">Línea 2 · Envasado<small>Turno mañana</small></div>
              <span class="dash__live">EN VIVO</span>
            </div>
            <div class="dash__body" aria-hidden="true">
              <div class="gauge">
                <svg viewBox="0 0 120 120" width="120" height="120">
                  <circle class="gauge__track" cx="60" cy="60" r="50" fill="none" stroke-width="9" />
                  <circle class="gauge__value" id="g-oee" cx="60" cy="60" r="50" fill="none" stroke-width="9" stroke-dasharray="314.16" stroke-dashoffset="314.16" />
                </svg>
                <div class="gauge__label"><strong id="t-oee">0%</strong><span>OEE</span></div>
              </div>
              <div class="kpis">${["Disponibilidad", "Rendimiento", "Calidad"].map((k, i) => `
                <div class="kpi"><span>${k}</span><b id="t-k${i}">0%</b><div class="kpi__bar"><i id="b-k${i}" style="width:0"></i></div></div>`).join("")}
              </div>
            </div>
            <div class="dash__chart" aria-hidden="true">
              <div class="dash__chart-head"><span>Unidades / hora</span><span id="t-uph">0 u/h</span></div>
              <svg viewBox="0 0 300 70" preserveAspectRatio="none">
                <defs><linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#06B6D4" stop-opacity=".28"/><stop offset="1" stop-color="#06B6D4" stop-opacity="0"/></linearGradient></defs>
                <path id="spark-area" fill="url(#spark-fill)" />
                <path id="spark-line" fill="none" stroke="#06B6D4" stroke-width="1.6" vector-effect="non-scaling-stroke" />
              </svg>
            </div>
            <div class="dash__alert" aria-hidden="true"><i class="ph-fill ph-warning"></i><span id="t-alert">Microparada en llenadora L2 · 4 min</span></div>
            <p class="dash__note" aria-hidden="true">Vista de ejemplo de un tablero OEE</p>
          </div>`;

const sectors = C.sectors.map((s) => `
          <li class="sector-chip"><i class="ph ${esc(s.icon)}" aria-hidden="true"></i>${esc(s.name)}</li>`).join("");

const problems = C.problems.map((p, i) => `
          <article class="pain reveal${i === 0 ? " pain--feature" : ""}" style="transition-delay:${(i * 0.08).toFixed(2)}s">
            <div class="pain__top"><span class="pain__code">${esc(p.code)}</span><i class="ph ${esc(p.icon)} pain__icon" aria-hidden="true"></i></div>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.desc)}</p>${i === 0 ? `
            <div class="pain__timeline" aria-hidden="true">
              <div class="pain__timeline-row"><span>08:42</span><b>Parada en línea 2</b><span>sin registro</span></div>
              <div class="pain__timeline-row"><span>13:10</span><b>Scrap fuera de rango</b><span>sin registro</span></div>
              <div class="pain__timeline-row"><span>18:30</span><b>Reporte a gerencia</b><span class="late">10 h tarde</span></div>
            </div>` : ""}
          </article>`).join("");

const tones = { "demo-crm": "crm", "demo-ops": "ops", "demo-ai": "ai" };
const solutions = C.solutions.map((s) => `
          <article class="solution" id="${esc(s.id)}">
            <div class="solution__copy reveal">
              <span class="badge-mono solution__tag"><i class="ph ${esc(s.icon)}" aria-hidden="true"></i>${bracket(s.tag)}</span>
              <h3>${esc(s.title)}</h3>
              <p class="solution__benefit">${esc(s.benefit)}</p>
              <ul class="solution__points">${s.points.map((pt) => `
                <li><i class="ph-fill ph-check-circle" aria-hidden="true"></i>${esc(pt)}</li>`).join("")}
              </ul>
            </div>
            <button type="button" class="video-card reveal" data-tone="${tones[s.id] || "crm"}" data-video-src="${esc(s.videoSrc)}" data-video-title="${esc(s.title)}" aria-label="Ver demo: ${esc(s.title)}">
              <span class="video-card__poster" aria-hidden="true"></span>
              <i class="ph ${esc(s.icon)} video-card__icon" aria-hidden="true"></i>
              <span class="video-card__play" aria-hidden="true"><i class="ph-fill ph-play"></i></span>
              <span class="video-card__meta" aria-hidden="true"><span>Demo · ${esc(s.title.split(" ").slice(0, 3).join(" "))}</span><span>${esc(s.duration)}</span></span>
            </button>
          </article>`).join("");

const impactTabs = C.impact.map((r, i) => `
            <button type="button" class="impact-tab" role="tab" id="itab-${i}" aria-controls="ipanel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
              <i class="ph ${esc(r.icon)}" aria-hidden="true"></i>
              <span><b>${esc(r.area)}</b><small>${esc(r.metric)} ${esc(r.metricLabel)}</small></span>
            </button>`).join("");

const impactPanels = C.impact.map((r, i) => `
          <div class="impact__panel" id="ipanel-${i}" role="tabpanel" aria-labelledby="itab-${i}" tabindex="0"${i === 0 ? "" : " hidden"}>
            <div class="impact__col impact__col--pain"><h3 class="impact__h">[ DESAFÍO HABITUAL ]</h3><p>${esc(r.challenge)}</p></div>
            <div class="impact__col impact__col--fix"><h3 class="impact__h">[ SOLUCIÓN DE INGENIERÍA ]</h3><p>${esc(r.solution)}</p></div>
            <div class="impact__result"><span class="impact__metric" data-count="${esc(r.metric)}">${esc(r.metric)}</span><span class="impact__metric-label">${esc(r.metricLabel)}</span></div>
          </div>`).join("");

const team = C.teamSkills.map((t, i) => `
          <article class="eng-card reveal" data-discipline="${esc(t.discipline)}" style="transition-delay:${(i * 0.08).toFixed(2)}s">
            <div class="eng-card__icon"><i class="ph ${esc(t.icon)}" aria-hidden="true"></i></div>
            <div>
              <h3>${esc(t.area)}</h3>
              <p>${esc(t.focus)}</p>
            </div>
            <span class="eng-card__role">${bracket(t.role.toUpperCase())}</span>
          </article>`).join("");

const method = C.methodology.map((m, i) => `
          <li class="step reveal" style="transition-delay:${(0.15 + i * 0.25).toFixed(2)}s">
            <div class="step__node"><i class="ph ${esc(m.icon)}" aria-hidden="true"></i></div>
            <span class="step__num">${esc(m.step)}</span>
            <h3>${esc(m.name)}</h3>
            <p>${esc(m.detail)}</p>
            <span class="step__tag">${bracket(m.tag)}</span>
          </li>`).join("");

const areas = C.form.areas.map((a, i) => `
                  <label class="chip"><input type="checkbox" name="area" value="${esc(a)}" id="area-${i}" /><span><i class="ph ph-check" aria-hidden="true"></i>${esc(a)}</span></label>`).join("");

/* ---------- Documento ---------- */
const html = `<!doctype html>
<!-- ARCHIVO GENERADO por build.mjs a partir de content.js. No editar a mano: editá content.js y corré "node build.mjs". -->
<html lang="${esc(C.site.lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(C.site.title)}</title>
  <meta name="description" content="${esc(C.site.description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0A0E17" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${esc(C.brand.name)}" />
  <meta property="og:locale" content="${esc(C.site.locale)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(C.site.title)}" />
  <meta property="og:description" content="${esc(C.site.description)}" />${ogImage}
  <meta name="twitter:title" content="${esc(C.site.title)}" />
  <meta name="twitter:description" content="${esc(C.site.description)}" />

  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
  <script>document.documentElement.classList.add("js")</script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>

  <!-- 1. HEADER FLOTANTE -->
  <header class="nav" id="nav">
    <div class="nav__inner container">
      <a href="#top" class="logo" aria-label="${esc(C.brand.name)}, inicio">${logo}
      </a>
      <span class="badge-mono nav__badge">${bracket(C.brand.statusBadge)}</span>
      <nav class="nav__links" aria-label="Secciones">${C.brand.nav.map((l) => `
        <a href="${esc(l.href)}">${esc(l.label)}</a>`).join("")}
      </nav>
      <a href="#diagnostico" class="btn btn--primary btn--sm">${esc(C.brand.navCta)}</a>
    </div>
  </header>

  <main id="main">
    <!-- 2. HERO 60/40 -->
    <section class="hero" id="top">
      <div class="hero__grid-bg" aria-hidden="true"></div>
      <div class="container hero__inner">
        <div class="hero__copy">
          <span class="badge-mono badge-mono--cyan reveal">${bracket(C.hero.badge)}</span>
          <h1 class="hero__title reveal">${esc(C.hero.headline)}</h1>
          <p class="hero__sub reveal">${esc(C.hero.subheadline)}</p>
          <div class="hero__ctas reveal">
            <a href="#diagnostico" class="btn btn--primary btn--lg"><span>${esc(C.hero.ctaPrimary)}</span><i class="ph ph-arrow-right" aria-hidden="true"></i></a>
            <a href="#soluciones" class="btn btn--ghost btn--lg">${esc(C.hero.ctaSecondary)}</a>
          </div>
        </div>
        <div class="hero__visual reveal">${dashboard}
        </div>
      </div>
    </section>

    <!-- 3. BANNER SECTORIAL -->
    <section class="sectors" aria-labelledby="sectors-title">
      <div class="container sectors__inner">
        <h2 class="sectors__title" id="sectors-title">${esc(C.sectorsTitle)}</h2>
        <ul class="sectors__list">${sectors}
        </ul>
      </div>
    </section>

    <!-- 4. AGITACIÓN DEL PROBLEMA -->
    <section class="section problems" id="problemas">
      <div class="container">
        <h2 class="section__title reveal">${esc(C.problemsTitle)}</h2>
        <div class="problems__grid">${problems}
        </div>
      </div>
    </section>

    <!-- 5. SOLUCIONES ZIG-ZAG -->
    <section class="section solutions" id="soluciones">
      <div class="container">
        <h2 class="section__title reveal">${esc(C.solutionsTitle)}</h2>
        <div class="solutions__list">${solutions}
        </div>
      </div>
    </section>

    <!-- 6. MATRIZ DE IMPACTO -->
    <section class="section impact" id="impacto">
      <div class="container">
        <span class="badge-mono badge-mono--emerald reveal">[ OEE METRICS ]</span>
        <h2 class="section__title reveal">${esc(C.impactTitle)}</h2>
        <div class="impact__wrap reveal">
          <div class="impact__tabs" role="tablist" aria-label="Áreas de operación">${impactTabs}
          </div>${impactPanels}
        </div>
        <p class="impact__note">${esc(C.impactNote)}</p>
      </div>
    </section>

    <!-- 7. LOS 3 INGENIEROS -->
    <section class="section team" id="equipo">
      <div class="container">
        <h2 class="section__title reveal">${esc(C.teamTitle)}</h2>
        <p class="section__lead reveal">${esc(C.teamIntro)}</p>
        <div class="team__grid">${team}
        </div>
      </div>
    </section>

    <!-- 8. METODOLOGÍA -->
    <section class="section method" id="metodologia">
      <div class="container">
        <h2 class="section__title reveal">${esc(C.methodologyTitle)}</h2>
        <ol class="method__track" id="method">${method}
        </ol>
      </div>
    </section>

    <!-- 9. AGENDAMIENTO -->
    <section class="section booking" id="diagnostico">
      <div class="container booking__inner">
        <div class="booking__copy reveal">
          <span class="badge-mono badge-mono--cyan">[ DIAGNÓSTICO SIN CARGO ]</span>
          <h2 class="section__title">${esc(C.closingCta.title)}</h2>
          <p class="section__lead">${esc(C.closingCta.description)}</p>
          <p class="booking__guarantee"><i class="ph-fill ph-seal-check" aria-hidden="true"></i><span>${esc(C.closingCta.guarantee)}</span></p>
        </div>
        <div class="booking__card reveal">
          <form class="form" id="booking-form" novalidate data-endpoint="${esc(C.form.endpoint)}" data-fallback-email="${esc(C.form.fallbackEmail)}">
            <div class="field">
              <label for="f-name">Nombre y apellido</label>
              <input id="f-name" name="nombre" type="text" autocomplete="name" required />
              <p class="field__error" id="f-name-err"></p>
            </div>
            <div class="form__row">
              <div class="field">
                <label for="f-company">Empresa</label>
                <input id="f-company" name="empresa" type="text" autocomplete="organization" required />
                <p class="field__error" id="f-company-err"></p>
              </div>
              <div class="field">
                <label for="f-phone">WhatsApp <span class="field__opt">(opcional)</span></label>
                <input id="f-phone" name="telefono" type="tel" autocomplete="tel" />
                <p class="field__error" id="f-phone-err"></p>
              </div>
            </div>
            <div class="field">
              <label for="f-email">Email laboral</label>
              <input id="f-email" name="email" type="email" autocomplete="email" required />
              <p class="field__error" id="f-email-err"></p>
            </div>
            <fieldset class="field">
              <legend>${esc(C.form.areasLabel)}</legend>
              <div class="chips">${areas}
              </div>
              <p class="field__error" id="f-area-err"></p>
            </fieldset>
            <button type="submit" class="btn btn--primary btn--lg btn--block" id="form-submit">
              <span>${esc(C.closingCta.buttonText)}</span><i class="ph ph-calendar-check" aria-hidden="true"></i>
            </button>
            <p class="form__status" id="form-status" role="status"></p>
          </form>
          <div class="form-success" id="form-success" hidden>
            <i class="ph-fill ph-check-circle" aria-hidden="true"></i>
            <h3>${esc(C.form.successTitle)}</h3>
            <p>${esc(C.form.successText)}</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <a href="#top" class="logo" aria-label="${esc(C.brand.name)}, inicio">${logo}
      </a>
      <p class="footer__tagline">${esc(C.footer.tagline)}</p>
      <p class="footer__legal">&copy; ${year} ${esc(C.brand.name)}. ${esc(C.footer.rights)}</p>
    </div>
  </footer>

  <!-- VideoModalWrapper -->
  <dialog class="video-modal" id="video-modal" aria-label="Video demostrativo" data-cta="${esc(C.brand.navCta)}">
    <div class="video-modal__frame">
      <button type="button" class="video-modal__close" id="video-close" aria-label="Cerrar video"><i class="ph ph-x" aria-hidden="true"></i></button>
      <div class="video-modal__media" id="video-media"></div>
    </div>
  </dialog>

  <script src="app.js" defer></script>
</body>
</html>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonical}</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`;

writeFileSync(join(root, "index.html"), html);
writeFileSync(join(root, "robots.txt"), robots);
writeFileSync(join(root, "sitemap.xml"), sitemap);
console.log(`OK: index.html, robots.txt y sitemap.xml generados para ${canonical}`);
