const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const form = document.querySelector("[data-contact-form]");
const statusMessage = document.querySelector("[data-form-status]");
const mobileBreakpoint = window.matchMedia("(max-width: 1120px)");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setStatus = (message, type) => {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = `form-status ${type}`;
};

const getValidationMessage = (field) => {
  if (field.validity.valueMissing) return "Este campo es obligatorio.";
  if (field.validity.typeMismatch) return "Ingresa un email válido.";
  return "Revisa el valor ingresado.";
};

const validateField = (field) => {
  const row = field.closest(".form-row");
  const isValid = field.checkValidity();
  const errorMessage = row?.querySelector(".field-error");

  row?.classList.toggle("is-invalid", !isValid);
  field.setAttribute("aria-invalid", String(!isValid));
  if (errorMessage) errorMessage.textContent = isValid ? "" : getValidationMessage(field);

  return isValid;
};

const setMenuState = (isOpen, { returnFocus = false } = {}) => {
  if (!menuToggle || !mobileNav) return;

  mobileNav.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  document.body.classList.toggle("menu-open", isOpen);

  if (returnFocus) menuToggle.focus();
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

menuToggle?.addEventListener("click", () => {
  setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenuState(false, { returnFocus: true });
  }
});

mobileBreakpoint.addEventListener("change", (event) => {
  if (!event.matches) setMenuState(false);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    setMenuState(false);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  });
});

form?.addEventListener("input", (event) => {
  const field = event.target;
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    validateField(field);
    if (statusMessage?.classList.contains("error")) setStatus("", "");
  }
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll(".form-row input, .form-row textarea")];
  const invalidFields = fields.filter((field) => !validateField(field));

  if (invalidFields.length > 0) {
    setStatus("Revisa los campos marcados antes de enviar.", "error");
    invalidFields[0].focus();
    return;
  }

  form.reset();
  fields.forEach((field) => {
    field.setAttribute("aria-invalid", "false");
    field.closest(".form-row")?.classList.remove("is-invalid");
  });
  setStatus("Demostración completada. No se enviaron ni almacenaron datos.", "success");
});

/* ── Mapa de animaciones de entrada ──────────────────────────────────────── */

const ANIMATE_MAP = [
  { sel: ".hero .eyebrow",               anim: "fadeRight" },
  { sel: ".hero-slogan",                 anim: "fadeRight" },
  { sel: "#hero-title",                  anim: "fadeRight" },
  { sel: ".hero-copy",                   anim: "fadeRight" },
  { sel: ".hero-actions",                anim: "fadeUp" },
  { sel: ".hero-stats div",              anim: "scaleIn",  stagger: true },

  { sel: ".problem-band .split > div",   anim: "fadeRight" },
  { sel: ".risk-panel",                  anim: "fadeLeft" },

  { sel: ".value-copy",                  anim: "fadeRight" },
  { sel: ".value-list article",          anim: "scaleIn",  stagger: true },

  { sel: ".muted .section-heading",      anim: "fadeUp" },
  { sel: ".flow-panel > div",            anim: "fadeUp",   stagger: true },
  { sel: ".steps article",               anim: "fadeUp",   stagger: true },

  { sel: ".data-grid article",           anim: "scaleIn",  stagger: true },

  { sel: ".deliverables .section-heading", anim: "fadeUp" },
  { sel: ".deliverable-grid article",    anim: "fadeUp",   stagger: true },

  { sel: ".offer-copy",                  anim: "fadeRight" },
  { sel: ".offer-price",                 anim: "fadeLeft" },

  { sel: ".compliance-layout > div:first-child", anim: "fadeRight" },
  { sel: ".compliance-list article",     anim: "fadeLeft", stagger: true },

  { sel: ".benefits-layout > div:first-child",  anim: "fadeRight" },
  { sel: ".benefit-list article",        anim: "fadeLeft", stagger: true },

  { sel: ".faq-layout > div:first-child", anim: "fadeRight" },
  { sel: ".faq-list details",            anim: "fadeUp",   stagger: true },

  { sel: ".contact-layout > div:first-child", anim: "fadeRight" },
  { sel: ".contact-brand",               anim: "fadeUp" },
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

function setupSecurityDataStream() {
  const stream = document.querySelector("[data-security-stream]");
  if (!stream) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lanes = [...stream.querySelectorAll("[data-security-lane]")];
  const prefixes = [
    "ACCESS_OK",
    "CONSENT_VALID",
    "ENCRYPTED",
    "HASH",
    "ID",
    "ROLE_CLINICAL",
    "TRACE",
    "RETENTION_SET",
  ];

  const randomHex = (length) =>
    Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join("");

  const createValue = () => {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    if (prefix === "ACCESS_OK" || prefix === "CONSENT_VALID" || prefix === "ENCRYPTED") return prefix;
    if (prefix === "ROLE_CLINICAL" || prefix === "RETENTION_SET") return `${prefix}:${randomHex(2)}`;
    return `${prefix}-${randomHex(4)}`;
  };

  const fillLane = (lane, count) => {
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const token = document.createElement("span");
      token.className = "security-token";
      token.textContent = createValue();
      token.style.setProperty("--token-opacity", (0.35 + Math.random() * 0.45).toFixed(2));
      fragment.appendChild(token);
    }

    lane.replaceChildren(fragment);
  };

  const refreshLanes = () => {
    lanes.forEach((lane, index) => fillLane(lane, reducedMotion ? 8 : 18 + index * 3));
  };

  refreshLanes();
  if (reducedMotion) return;

  let refreshTimer = window.setInterval(refreshLanes, 12000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(refreshTimer);
      refreshTimer = null;
      stream.classList.add("is-paused");
      return;
    }

    stream.classList.remove("is-paused");
    if (!refreshTimer) refreshTimer = window.setInterval(refreshLanes, 12000);
  });
}

function setupFaqAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const faqItems = [...document.querySelectorAll(".faq-list details")];
  const duration = 700;
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

  const animateItem = (details, shouldOpen) => {
    if (details.dataset.animating === "true") return Promise.resolve();

    const answer = details.querySelector(".faq-answer");
    if (!answer) return Promise.resolve();

    details.dataset.animating = "true";
    if (shouldOpen) details.open = true;

    const fullHeight = answer.scrollHeight;
    const animation = answer.animate(
      [
        {
          height: `${shouldOpen ? 0 : fullHeight}px`,
          opacity: shouldOpen ? 0 : 1,
          transform: shouldOpen ? "translateY(-12px)" : "translateY(0)",
        },
        {
          height: `${shouldOpen ? fullHeight : 0}px`,
          opacity: shouldOpen ? 1 : 0,
          transform: shouldOpen ? "translateY(0)" : "translateY(-12px)",
        },
      ],
      { duration, easing }
    );

    details.classList.toggle("is-opening", shouldOpen);
    details.classList.toggle("is-closing", !shouldOpen);

    return animation.finished
      .catch(() => {})
      .then(() => {
        if (!shouldOpen) details.open = false;
        details.classList.remove("is-opening", "is-closing");
        delete details.dataset.animating;
      });
  };

  faqItems.forEach((details) => {
    const summary = details.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (details.dataset.animating === "true") return;

      const shouldOpen = !details.open;

      if (shouldOpen) {
        faqItems
          .filter((item) => item !== details && item.open)
          .forEach((item) => animateItem(item, false));
      }

      animateItem(details, shouldOpen);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();
  setupScrollAnimations();
  setupCounters();
  setupParallax();
  setupSecurityDataStream();
  setupFaqAnimations();
});
