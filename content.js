/*
 * CAPA 4: DICCIONARIO DE CONTENIDO
 * Edita textos, sectores, métricas y videos acá sin tocar el código.
 * Después de editar, regenerá la página con:  node build.mjs
 * (escribe index.html, robots.txt y sitemap.xml con el contenido ya incluido para SEO).
 *
 * Para cargar un video real, completa "videoSrc" con un .mp4 o una URL embed de YouTube/Vimeo.
 * Para recibir el formulario, completa "form.endpoint" (Formspree, Netlify, webhook propio, etc.).
 */
window.SITE_CONTENT = {
  site: {
    url: "https://ingenia.solutions",
    lang: "es-AR",
    locale: "es_AR",
    title: "Ingenia Solutions | Ingeniería de procesos y software a medida para la industria",
    description: "Software a medida, tableros OEE en tiempo real y automatización para PYMEs industriales. Diagnóstico técnico sin cargo con ingenieros mecánicos, electromecánicos e industriales.",
    // Imagen para compartir en redes (1200x630). Ej: "/og-image.png". Vacío = no se publica la etiqueta.
    ogImage: ""
  },

  brand: {
    name: "Ingenia Solutions",
    // Logotipo: nivel 1 "ingen" + "< ia >", nivel 2 descriptor. Tagline oficial debajo del logo grande.
    logoWord: "ingen",
    logoCore: "ia",
    logoDescriptor: "· SOLUTIONS ·",
    tagline: "TECNOLOGÍA E INTELIGENCIA ARTIFICIAL PARA PYMES",
    statusBadge: "INGENIERÍA APLICADA EN PLANTA",
    navCta: "Solicitar Diagnóstico",
    nav: [
      { label: "Soluciones", href: "#soluciones" },
      { label: "Impacto", href: "#impacto" },
      { label: "Equipo", href: "#equipo" },
      { label: "Metodología", href: "#metodologia" }
    ]
  },

  hero: {
    badge: "INGENIERÍA DE PROCESOS & SOLUCIONES DIGITALES",
    headline: "Convertimos los datos y procesos de tu empresa en mayor productividad y menores costos.",
    subheadline: "Desarrollamos software a medida, tableros de control en tiempo real y automatizaciones inteligentes. Un equipo de ingenieros mecánicos, electromecánicos e industriales que habla el lenguaje real de tu operación.",
    ctaPrimary: "Solicitar Diagnóstico Sin Cargo",
    ctaSecondary: "Explorar Soluciones"
  },

  sectorsTitle: "Especialistas en operaciones de",
  sectors: [
    { name: "Parque Industrial", icon: "ph-factory" },
    { name: "Industria Alimenticia", icon: "ph-cooking-pot" },
    { name: "Metalmecánica & Manufactura", icon: "ph-gear-six" },
    { name: "Sector Pesquero y Frío", icon: "ph-snowflake" },
    { name: "Logística", icon: "ph-truck" }
  ],

  problemsTitle: "Lo que cuesta operar a ciegas",
  problems: [
    {
      code: "01",
      icon: "ph-eye-slash",
      title: "Cero visibilidad en tiempo real",
      desc: "Las paradas de máquina, cuellos de botella y pérdidas se analizan al cierre del día. Cuando el reporte llega a gerencia, el costo ya se asumió."
    },
    {
      code: "02",
      icon: "ph-keyboard",
      title: "Horas perdidas en transcripción manual",
      desc: "Supervisores y analistas pierden hasta el 30% de su jornada copiando datos en planillas de Excel, cargando remitos y armando informes a mano."
    },
    {
      code: "03",
      icon: "ph-puzzle-piece",
      title: "Sistemas genéricos que nadie usa",
      desc: "Sistemas ERP enlatados y lentos que resultan ajenos al operario de planta, provocando abandono y retorno al papel."
    }
  ],

  solutionsTitle: "Soluciones que ya funcionan en operación",
  solutions: [
    {
      id: "demo-crm",
      icon: "ph-handshake",
      tag: "VENTAS / CRM",
      title: "Automatización de Ventas y CRM Operativo",
      benefit: "Registro inmediato de requerimientos, cotizaciones automatizadas y seguimiento comercial sin retrasos humanos.",
      points: ["Cotizador conectado a costos y stock", "Seguimiento de oportunidades por etapa", "Alertas de pedidos sin respuesta"],
      videoSlot: "VIDEO_DEMO_01_CRM",
      videoSrc: "",
      duration: "02:40"
    },
    {
      id: "demo-ops",
      icon: "ph-arrows-clockwise",
      tag: "OPERACIONES",
      title: "Integración de Sistemas y Operaciones",
      benefit: "Sincronización en tiempo real de inventarios, despachos y facturación para erradicar la duplicación de datos.",
      points: ["Stock y despachos en un único registro", "Facturación disparada desde el remito", "Reportes de stock sin planillas"],
      videoSlot: "VIDEO_DEMO_02_OPERACIONES",
      videoSrc: "",
      duration: "03:15"
    },
    {
      id: "demo-ai",
      icon: "ph-robot",
      tag: "ASISTENTES IA",
      title: "Atención al Cliente y Asistentes IA 24/7",
      benefit: "Agentes virtuales entrenados con manuales y reglas de tu negocio que filtran consultas y derivan casos calificados.",
      points: ["Respuestas basadas en tus manuales", "Derivación de casos calificados", "Disponible por WhatsApp y web"],
      videoSlot: "VIDEO_DEMO_03_IA",
      videoSrc: "",
      duration: "02:05"
    }
  ],

  impactTitle: "Matriz de impacto por área",
  impactNote: "Resultados esperados de referencia. El impacto real se estima en el diagnóstico según tu operación.",
  impact: [
    {
      area: "Producción y Mantenimiento",
      icon: "ph-wrench",
      challenge: "Paradas no programadas que se detectan tarde y se registran a mano al final del turno.",
      solution: "Adquisición de señales de máquina, alertas tempranas y tablero OEE en tiempo real por línea.",
      metric: "-20%",
      metricLabel: "paradas no programadas",
      tone: "cyan"
    },
    {
      area: "Calidad y Reportes",
      icon: "ph-chart-line-up",
      challenge: "Informes de producción y scrap armados en Excel, con datos de ayer y sin trazabilidad.",
      solution: "Captura automática de datos de planta y reportes generados al instante para cada nivel de decisión.",
      metric: "-60%",
      metricLabel: "tiempo de armado de reportes",
      tone: "blue"
    },
    {
      area: "Administración y Facturación",
      icon: "ph-receipt",
      challenge: "Remitos, stock y facturas cargados dos y tres veces en sistemas que no se hablan.",
      solution: "Integración entre sistemas y automatización de flujos administrativos de punta a punta.",
      metric: "-70%",
      metricLabel: "carga administrativa",
      tone: "emerald"
    }
  ],

  teamTitle: "Tres ingenierías. Un mismo tablero.",
  teamIntro: "Una agencia de software ve pantallas. Nosotros vemos la máquina, la señal y el costo detrás de cada dato.",
  teamSkills: [
    {
      area: "Ingeniería Mecánica",
      discipline: "mec",
      icon: "ph-gear",
      role: "Product UI/UX",
      focus: "Dinámica de procesos físicos, maquinaria, herramentales y reducción de scrap en línea."
    },
    {
      area: "Ingeniería Electromecánica",
      discipline: "elec",
      icon: "ph-lightning",
      role: "Tech Lead",
      focus: "Automatización, adquisición de señales de sensores y enlace directo de planta con la base de datos."
    },
    {
      area: "Ingeniería Industrial",
      discipline: "ind",
      icon: "ph-flow-arrow",
      role: "Operations / QA",
      focus: "Balanceo de líneas, optimización de tiempos, control de costos operativos y maximización del OEE."
    }
  ],

  methodologyTitle: "Cómo trabajamos",
  methodology: [
    { step: "01", icon: "ph-clipboard-text", tag: "SIN CARGO", name: "Diagnóstico Inicial", detail: "Relevamiento técnico en planta sin costo ni compromiso para detectar cuellos de botella." },
    { step: "02", icon: "ph-flask", tag: "PILOTO: 3-5 SEMANAS", name: "Piloto Funcional (3 a 5 semanas)", detail: "Desarrollo de un MVP acotado para validar resultados operativos y retorno de inversión antes de escalar." },
    { step: "03", icon: "ph-rocket-launch", tag: "ADOPCIÓN", name: "Puesta en Marcha y Capacitación", detail: "Implementación en planta, acompañamiento directo y formación al personal para garantizar adopción." }
  ],

  closingCta: {
    title: "Analicemos las oportunidades de mejora en tu operación",
    description: "Coordina una sesión de diagnóstico técnico con nuestro equipo de ingenieros. Evaluamos tus procesos actuales y te entregamos una propuesta de mejora.",
    buttonText: "Reservar Diagnóstico Técnico Gratuito",
    guarantee: "Respuesta en menos de 24 horas hábiles directamente por un ingeniero fundador."
  },

  form: {
    // Endpoint que recibe un POST JSON. Vacío = abre el cliente de correo con los datos.
    endpoint: "https://formspree.io/f/xbgddlop",
    // Correo de destino para el modo sin endpoint (mailto) y para el mensaje de error.
    fallbackEmail: "somos.ingenialabs@gmail.com",
    areasLabel: "¿Qué área querés optimizar?",
    areas: [
      "Producción y OEE",
      "Mantenimiento",
      "Ventas y CRM",
      "Administración y Facturación",
      "Stock y Logística",
      "Atención al cliente con IA"
    ],
    successTitle: "Solicitud recibida",
    successText: "Un ingeniero fundador te va a contactar en menos de 24 horas hábiles para coordinar el diagnóstico."
  },

  footer: {
    tagline: "Ingeniería de procesos y software a medida para la industria.",
    rights: "Todos los derechos reservados."
  }
};
