const header = document.querySelector("[data-header]");
const form = document.querySelector("[data-contact-form]");
const statusMessage = document.querySelector("[data-form-status]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setStatus = (message, type) => {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = `form-status ${type}`;
};

const validateField = (field) => {
  const row = field.closest(".form-row");
  const isValid = field.checkValidity();
  row?.classList.toggle("is-invalid", !isValid);
  return isValid;
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

form?.addEventListener("input", (event) => {
  const field = event.target;
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    validateField(field);
    setStatus("", "");
  }
});

form?.addEventListener("submit", (event) => {
  const fields = [...form.querySelectorAll("input, textarea")];
  const visibleFields = fields.filter((field) => !field.classList.contains("form-honey"));
  const isValid = visibleFields.every(validateField);

  if (!isValid) {
    event.preventDefault();
    setStatus("Revisa los campos marcados antes de enviar.", "error");
    return;
  }

  setStatus("Enviando solicitud...", "success");
});

/* ── Mapa de animaciones de entrada ──────────────────────────────────────── */

const ANIMATE_MAP = [
  { sel: ".hero .eyebrow",               anim: "fadeRight" },
  { sel: "#hero-title",                  anim: "fadeRight" },
  { sel: ".hero-copy",                   anim: "fadeRight" },
  { sel: ".hero-actions",                anim: "fadeUp" },
  { sel: ".hero-stats div",              anim: "scaleIn",  stagger: true },

  { sel: ".problem-band .split > div",   anim: "fadeRight" },
  { sel: ".risk-panel",                  anim: "fadeLeft" },

  { sel: ".value-copy",                  anim: "fadeRight" },
  { sel: ".value-visual",                anim: "scaleIn" },
  { sel: ".value-list article",          anim: "scaleIn",  stagger: true },

  { sel: ".muted .section-heading",      anim: "fadeUp" },
  { sel: ".flow-panel > div",            anim: "fadeUp",   stagger: true },
  { sel: ".steps article",               anim: "fadeUp",   stagger: true },

  { sel: ".data-grid article",           anim: "scaleIn",  stagger: true },

  { sel: ".deliverables .section-heading", anim: "fadeUp" },
  { sel: ".deliverable-grid article",    anim: "fadeUp",   stagger: true },

  { sel: ".compliance-layout > div:first-child", anim: "fadeRight" },
  { sel: ".compliance-list article",     anim: "fadeLeft", stagger: true },

  { sel: ".ecosystem-section .section-heading", anim: "fadeUp" },
  { sel: ".ecosystem-grid article",      anim: "fadeUp",   stagger: true },

  { sel: ".benefits-layout > div:first-child",  anim: "fadeRight" },
  { sel: ".benefit-list article",        anim: "fadeLeft", stagger: true },

  { sel: ".faq-layout > div:first-child", anim: "fadeRight" },
  { sel: ".faq-list details",            anim: "fadeUp",   stagger: true },

  { sel: ".contact-layout > div:first-child", anim: "fadeRight" },
  { sel: ".contact-form",               anim: "fadeLeft" },
];

/* ── Animaciones de entrada con IntersectionObserver ─────────────────────── */

function setupScrollAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ANIMATE_MAP.forEach(({ sel, anim, stagger }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute("data-animate", anim);
      if (stagger) el.style.setProperty("--i", i);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
}

/* ── Contador animado en hero-stats ──────────────────────────────────────── */

function setupCounters() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const statsContainer = document.querySelector(".hero-stats");
  if (!statsContainer) return;

  const animateCounter = (el) => {
    const target = parseInt(el.textContent, 10);
    if (isNaN(target)) return;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statsContainer.querySelectorAll("dt").forEach(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(statsContainer);
}

/* ── Parallax sutil en hero ──────────────────────────────────────────────── */

function setupParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const heroMedia = document.querySelector(".hero-media");
  const hero = document.querySelector(".hero");
  if (!heroMedia || !hero) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < hero.offsetHeight) {
          heroMedia.style.transform = `scale(1.04) translateY(${scrollY * 0.18}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Inicialización ──────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();
  setupScrollAnimations();
  setupCounters();
  setupParallax();
});
