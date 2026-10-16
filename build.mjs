// Genera index.html, privacidad/index.html, 404.html, robots.txt y sitemap.xml a partir de content.js.
// Uso: node build.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

// Logo Ingenia: isotipo (viga "I" isométrica, versión para fondo oscuro) + "Ingen" + "ia" en Electric Blue.
// Misma geometría que brand/generate-brand.mjs. Cada llamada usa ids propios porque el logo aparece dos veces por página.
const ISO_FACES = [
  ["-20.78,-12 31.18,18 51.96,6 0,-24", "top"], ["31.18,42 51.96,30 51.96,6 31.18,18", "side"],
  ["-20.78,12 31.18,42 31.18,18 -20.78,-12", "front"], ["12.99,7.5 33.77,-4.5 33.77,-56.5 12.99,-44.5", "side"],
  ["-2.6,-1.5 12.99,7.5 12.99,-44.5 -2.6,-53.5", "front"], ["31.18,-34 51.96,-46 51.96,-70 31.18,-58", "side"],
  ["-20.78,-88 31.18,-58 51.96,-70 0,-100", "top"], ["-20.78,-64 31.18,-34 31.18,-58 -20.78,-88", "front"],
];
let logoCount = 0;
const logo = () => {
  const id = `iso${++logoCount}`;
  return `
        <svg class="logo__mark" viewBox="-22 -101 75 144" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="${id}-front" gradientUnits="userSpaceOnUse" x1="-21" y1="-88" x2="31" y2="42"><stop offset="0" stop-color="#007AFF"/><stop offset="1" stop-color="#30B0C7"/></linearGradient>
            <linearGradient id="${id}-top" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="52" y2="-58"><stop offset="0" stop-color="#30B0C7"/><stop offset="1" stop-color="#7AD3E3"/></linearGradient>
            <linearGradient id="${id}-side" gradientUnits="userSpaceOnUse" x1="31" y1="-70" x2="52" y2="42"><stop offset="0" stop-color="#1E63B8"/><stop offset="1" stop-color="#123A6B"/></linearGradient>
          </defs>${ISO_FACES.map(([p, face]) => `<polygon points="${p}" fill="url(#${id}-${face})"/>`).join("")}
        </svg>
        <span aria-hidden="true">${esc(C.brand.logoWord)}<span class="logo__ia">${esc(C.brand.logoCore)}</span></span>`;
};

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

const ogImageUrl = C.site.ogImage ? new URL(C.site.ogImage, canonical).href : "";
const ogImage = C.site.ogImage
  ? `
  <meta property="og:image" content="${esc(ogImageUrl)}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(C.site.ogImageAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${esc(ogImageUrl)}" />`
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
                <defs><linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity=".28"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></linearGradient></defs>
                <path id="spark-area" fill="url(#spark-fill)" />
                <path id="spark-line" fill="none" stroke="#38BDF8" stroke-width="1.6" vector-effect="non-scaling-stroke" />
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

const training = C.training.steps.map((t, i) => `
          <li class="train-card reveal" style="transition-delay:${(i * 0.08).toFixed(2)}s">
            <div class="train-card__head"><span class="train-card__num">${esc(t.step)}</span><i class="ph ${esc(t.icon)}" aria-hidden="true"></i></div>
            <h3>${esc(t.name)}</h3>
            <p>${esc(t.detail)}</p>
          </li>`).join("");

const wa = C.form.whatsapp;
const whatsappLink = wa?.number ? `
            <p class="form__whatsapp">${esc(wa.lead)} <a href="https://wa.me/${esc(wa.number)}?text=${esc(encodeURIComponent(wa.message))}" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo" aria-hidden="true"></i>${esc(wa.linkText)}</a></p>` : "";

const areas = C.form.areas.map((a, i) => `
                  <label class="chip"><input type="checkbox" name="area" value="${esc(a)}" id="area-${i}" /><span><i class="ph ph-check" aria-hidden="true"></i>${esc(a)}</span></label>`).join("");

/* ---------- Bloques compartidos entre páginas ---------- */
const headAssets = `
  <meta name="theme-color" content="#000000" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />
  <link rel="stylesheet" href="/styles.css" />`;

// En la home los enlaces son anclas (#seccion); en las páginas secundarias vuelven a la home (/#seccion)
const navBar = (home) => {
  const to = (hash) => (home ? hash : `/${hash}`);
  return `
  <header class="nav" id="nav">
    <div class="nav__inner container">
      <a href="${home ? "#top" : "/"}" class="logo" aria-label="${esc(C.brand.name)}, inicio">${logo()}
      </a>
      <span class="badge-mono nav__badge">${bracket(C.brand.statusBadge)}</span>
      <nav class="nav__links" aria-label="Secciones">${C.brand.nav.map((l) => `
        <a href="${esc(to(l.href))}">${esc(l.label)}</a>`).join("")}
      </nav>
      <a href="${to("#diagnostico")}" class="btn btn--primary btn--sm">${esc(C.brand.navCta)}</a>
    </div>
  </header>`;
};

const footerBar = (home) => `
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <a href="${home ? "#top" : "/"}" class="logo logo--lg" aria-label="${esc(C.brand.name)}, inicio">${logo()}
        </a>
        <p class="logo__tagline">${esc(C.brand.tagline)}</p>
      </div>
      <p class="footer__tagline">${esc(C.footer.tagline)}</p>
      <p class="footer__legal">&copy; ${year} ${esc(C.brand.name)}. ${esc(C.footer.rights)} <a href="${esc(C.privacy.path)}">${esc(C.footer.privacyLink)}</a></p>
    </div>
  </footer>`;

/* ---------- Hero ---------- */
const heroClassic = `
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
    </section>`;

/* ---------- VersionRefinada: header cápsula y hero con tablero de cristal (página de prueba /refinada/) ---------- */
const R = C.heroRefined;
const oeeRefined = R.kpis.reduce((acc, k) => acc * k.value, 1);
const pct = (v) => `${(v * 100).toFixed(1)}%`;

const navRefined = `
  <header class="nav rnav" id="nav">
    <div class="rnav__pill">
      <a href="#top" class="logo" aria-label="${esc(C.brand.name)}, inicio">${logo()}
      </a>
      <span class="badge-mono rnav__badge">${bracket(C.brand.statusBadge)}</span>
      <nav class="rnav__links" aria-label="Secciones">${C.brand.nav.map((l) => `
        <a href="${esc(l.href)}">${esc(l.label)}</a>`).join("")}
      </nav>
      <a href="#diagnostico" class="rbtn rbtn--outline">${esc(C.brand.navCta)}</a>
    </div>
  </header>`;

const dashboardRefined = `
          <article class="rdash" aria-label="Ejemplo de tablero de control OEE de una línea de envasado" data-kpi="${R.kpis.map((k) => k.value).join(",")}">
            <div class="rdash__dots" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="rdash__head" aria-hidden="true">
              <span class="rdash__label">${bracket(R.panelLabel)}</span>
              <span class="rdash__line"><span class="rdash__live"></span>${esc(R.line)} <small>(${esc(R.shift)})</small></span>
            </div>
            <div class="rdash__body" aria-hidden="true">
              <div class="rring">
                <svg viewBox="0 0 120 120" width="148" height="148">
                  <circle class="rring__track" cx="60" cy="60" r="50" fill="none" stroke-width="8" />
                  <circle class="rring__value" id="g-oee" cx="60" cy="60" r="50" fill="none" stroke-width="8" stroke-dasharray="314.16" stroke-dashoffset="314.16" />
                </svg>
                <div class="rring__label"><strong id="t-oee">${pct(oeeRefined)}</strong><span>OEE</span></div>
              </div>
              <ul class="rkpis">${R.kpis.map((k, i) => `
                <li class="rkpi">
                  <span class="rkpi__ring">
                    <svg viewBox="0 0 40 40" width="40" height="40">
                      <circle class="rkpi__track" cx="20" cy="20" r="17" fill="none" stroke-width="3" />
                      <circle class="rkpi__value" id="r-k${i}" cx="20" cy="20" r="17" fill="none" stroke-width="3" stroke-dasharray="106.81" stroke-dashoffset="106.81" />
                    </svg>
                    <i class="ph ${esc(k.icon)}"></i>
                  </span>
                  <span class="rkpi__label">${esc(k.label)}</span>
                  <b id="t-k${i}">${pct(k.value)}</b>
                </li>`).join("")}
              </ul>
            </div>
            <ul class="rlog" aria-hidden="true">${R.log.map((l) => `
              <li class="${l.alert ? "rlog__alert" : ""}">${l.alert ? `<i class="ph-fill ph-warning"></i>` : `<i class="ph ph-chart-line-up"></i>`}<time>${esc(l.time)}</time><span>·</span><span>${esc(l.text)}</span></li>`).join("")}
            </ul>
            <div class="rimpact" aria-hidden="true">${R.impact.map((m) => `
              <div class="rimpact__card"><b>${esc(m.metric)}</b><span>${esc(m.label)}</span></div>`).join("")}
            </div>
            <p class="rdash__caption"><span>[ OEE METRICS ]</span> ${esc(R.caption)}</p>
          </article>`;

const heroRefined = `
    <section class="rhero" id="top">
      <div class="rhero__glow rhero__glow--blue" aria-hidden="true"></div>
      <div class="rhero__glow rhero__glow--cyan" aria-hidden="true"></div>
      <div class="container rhero__inner">
        <div class="rhero__copy">
          <span class="rpill reveal">${bracket(C.hero.badge)}</span>
          <h1 class="hero__title rhero__title reveal">${esc(C.hero.headline)}</h1>
          <p class="rhero__sub reveal">${esc(C.hero.subheadline)}</p>
          <div class="rhero__ctas reveal">
            <a href="#diagnostico" class="rbtn rbtn--primary"><span>${esc(C.hero.ctaPrimary)}</span><i class="ph ph-arrow-right" aria-hidden="true"></i></a>
            <a href="#soluciones" class="rbtn rbtn--ghost">${esc(C.hero.ctaSecondary)}</a>
          </div>
        </div>
        <div class="rhero__visual reveal">${dashboardRefined}
        </div>
      </div>
    </section>`;

/* ---------- Documento ---------- */
const homePage = ({ nav, hero, robots = "index, follow", extraHead = "", bodyClass = "" }) => `<!doctype html>
<!-- ARCHIVO GENERADO por build.mjs a partir de content.js. No editar a mano: editá content.js y corré "node build.mjs". -->
<html lang="${esc(C.site.lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(C.site.title)}</title>
  <meta name="description" content="${esc(C.site.description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta name="robots" content="${robots}" />${headAssets}${extraHead}

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
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
  <a class="skip-link" href="#main">Saltar al contenido</a>

  <!-- 1. HEADER FLOTANTE -->${nav}

  <main id="main">
    <!-- 2. HERO -->${hero}

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

    <!-- 8b. CAPACITACIÓN CON IA -->
    <section class="section training" id="capacitacion">
      <div class="container">
        <span class="badge-mono badge-mono--cyan reveal">${bracket(C.training.badge)}</span>
        <h2 class="section__title training__title reveal">${esc(C.training.title)}</h2>
        <p class="section__lead reveal">${esc(C.training.lead)}</p>
        <ol class="training__grid">${training}
        </ol>
        <div class="training__cta reveal">
          <a href="#diagnostico" class="btn btn--primary btn--lg"><span>${esc(C.training.cta)}</span><i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        </div>
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
            <p class="form__status" id="form-status" role="status"></p>${whatsappLink}
            <p class="form__privacy">${esc(C.form.privacyNote)} <a href="${esc(C.privacy.path)}">${esc(C.form.privacyLinkText)}</a></p>
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
${footerBar(true)}

  <!-- VideoModalWrapper -->
  <dialog class="video-modal" id="video-modal" aria-label="Video demostrativo" data-cta="${esc(C.brand.navCta)}">
    <div class="video-modal__frame">
      <button type="button" class="video-modal__close" id="video-close" aria-label="Cerrar video"><i class="ph ph-x" aria-hidden="true"></i></button>
      <div class="video-modal__media" id="video-media"></div>
    </div>
  </dialog>

  <script src="/app.js" defer></script>
</body>
</html>
`;

const html = homePage({ nav: navBar(true), hero: heroClassic });
// Página de prueba para comparar diseños: no se indexa y no está en la lista de archivos que publica netlify.toml
const htmlRefined = homePage({
  nav: navRefined,
  hero: heroRefined,
  robots: "noindex",
  extraHead: `\n  <link rel="stylesheet" href="/refinada.css" />`,
  bodyClass: "v-refinada",
});

/* ---------- Páginas secundarias ---------- */
const simplePage = ({ title, description, canonicalPath, index, main }) => `<!doctype html>
<!-- ARCHIVO GENERADO por build.mjs a partir de content.js. No editar a mano. -->
<html lang="${esc(C.site.lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} | ${esc(C.brand.name)}</title>
  <meta name="description" content="${esc(description)}" />${canonicalPath ? `
  <link rel="canonical" href="${esc(siteUrl + canonicalPath)}" />` : ""}
  <meta name="robots" content="${index ? "index, follow" : "noindex"}" />${headAssets}
</head>
<body class="page">
  <a class="skip-link" href="#main">Saltar al contenido</a>${navBar(false)}

  <main id="main">${main}
  </main>
${footerBar(false)}
</body>
</html>
`;

const P = C.privacy;
const updatedLabel = new Date(`${P.updated}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
const responsible = [
  P.legalName && `Razón social: ${P.legalName}.`,
  P.taxId && `CUIT: ${P.taxId}.`,
].filter(Boolean).join(" ");
const privacyHtml = simplePage({
  title: P.title,
  description: `${P.title} de ${C.brand.name}: qué datos recolectamos en el formulario de diagnóstico y cómo ejercer tus derechos.`,
  canonicalPath: P.path,
  index: true,
  main: `
    <article class="legal container">
      <h1 class="legal__title">${esc(P.title)}</h1>
      <p class="legal__updated">Última actualización: ${esc(updatedLabel)}</p>
      <p class="legal__lead">${esc(P.intro)}</p>
      <h2>Responsable de los datos</h2>
      <p>${esc(C.brand.name)}.${responsible ? ` ${esc(responsible)}` : ""} Contacto: <a href="mailto:${esc(C.form.fallbackEmail)}">${esc(C.form.fallbackEmail)}</a>.</p>${P.sections.map((sec) => `
      <h2>${esc(sec.heading)}</h2>${sec.paragraphs.map((t) => `
      <p>${esc(t)}</p>`).join("")}`).join("")}
      <p class="legal__back"><a href="/" class="btn btn--ghost btn--sm"><i class="ph ph-arrow-left" aria-hidden="true"></i>${esc(C.notFound.button)}</a></p>
    </article>`,
});

const N = C.notFound;
const notFoundHtml = simplePage({
  title: N.title,
  description: N.text,
  index: false,
  main: `
    <section class="not-found container">
      <span class="badge-mono badge-mono--cyan">[ ERROR 404 ]</span>
      <h1 class="not-found__title">${esc(N.title)}</h1>
      <p class="not-found__text">${esc(N.text)}</p>
      <div class="not-found__ctas">
        <a href="/" class="btn btn--primary btn--lg"><span>${esc(N.button)}</span><i class="ph ph-arrow-right" aria-hidden="true"></i></a>
        <a href="/#diagnostico" class="btn btn--ghost btn--lg">${esc(C.brand.navCta)}</a>
      </div>
    </section>`,
});

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
  <url>
    <loc>${siteUrl}${C.privacy.path}</loc>
    <lastmod>${C.privacy.updated}</lastmod>
  </url>
</urlset>
`;

writeFileSync(join(root, "index.html"), html);
mkdirSync(join(root, "privacidad"), { recursive: true });
writeFileSync(join(root, "privacidad", "index.html"), privacyHtml);
writeFileSync(join(root, "404.html"), notFoundHtml);
mkdirSync(join(root, "refinada"), { recursive: true });
writeFileSync(join(root, "refinada", "index.html"), htmlRefined);
writeFileSync(join(root, "robots.txt"), robots);
writeFileSync(join(root, "sitemap.xml"), sitemap);
console.log(`OK: index.html, privacidad/, 404.html, robots.txt y sitemap.xml generados para ${canonical}`);
