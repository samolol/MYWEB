const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const yearEl = document.getElementById("year");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");
const contactForm = document.querySelector(".contact-form");
const accordionTriggers = document.querySelectorAll(".accordion-trigger");

const closeNav = () => {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    closeNav();
  });
});

document.addEventListener("click", (event) => {
  if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
    closeNav();
  }
});

accordionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    accordionTriggers.forEach((item) => {
      item.setAttribute("aria-expanded", "false");
      item.nextElementSibling.hidden = true;
    });
    trigger.setAttribute("aria-expanded", String(!isExpanded));
    panel.hidden = isExpanded;
  });
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    formStatus.textContent = "Odesílám…";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        formStatus.textContent = "Hotovo ✅ Ozvu se co nejdřív.";
        contactForm.reset();
      } else {
        formStatus.textContent = "Něco se nepovedlo. Zkus to prosím znovu nebo napiš e-mail.";
      }
    } catch (error) {
      formStatus.textContent = "Něco se nepovedlo. Zkus to prosím znovu nebo napiš e-mail.";
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
}
