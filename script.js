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

  setStatus("Enviando solicitud a franco.munoz@alumnos.ucentral.cl...", "success");
});

if (window.lucide) {
  window.lucide.createIcons();
}
