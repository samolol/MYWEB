const DEMO_SCREENSHOT_1_URL = "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=80";
const DEMO_SCREENSHOT_2_URL = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";
const DEMO_SCREENSHOT_3_URL = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";
const DEMO_VIDEO_URL = "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4";
const DEMO_VIDEO_POSTER_URL = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80";

const FIVERR_BASIC_URL = "";
const FIVERR_STANDARD_URL = "";
const FIVERR_PREMIUM_URL = "";

const state = {
  currentStep: 1,
  totalSteps: 6,
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const applyAssetPlaceholders = () => {
  const screenshots = {
    1: DEMO_SCREENSHOT_1_URL,
    2: DEMO_SCREENSHOT_2_URL,
    3: DEMO_SCREENSHOT_3_URL,
  };
  $$('[data-screenshot]').forEach((img) => {
    const key = img.getAttribute('data-screenshot');
    img.src = screenshots[key];
  });
  const carouselImage = $('#carousel-image');
  carouselImage.src = DEMO_SCREENSHOT_1_URL;
  const video = $('#demo-video');
  const source = $('#demo-video-source');
  video.poster = DEMO_VIDEO_POSTER_URL;
  source.src = DEMO_VIDEO_URL;
  video.load();
};

const setupTheme = () => {
  const toggle = $('.theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  toggle.setAttribute('aria-pressed', theme === 'dark');

  toggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = current;
    localStorage.setItem('theme', current);
    toggle.setAttribute('aria-pressed', current === 'dark');
  });
};

const setupScroll = () => {
  const links = $$('.nav-links a');
  const sections = links.map((link) => $(link.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    const offset = window.scrollY + 120;
    sections.forEach((section, index) => {
      if (section.offsetTop <= offset && section.offsetTop + section.offsetHeight > offset) {
        links.forEach((link) => link.classList.remove('active'));
        links[index].classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll);
  onScroll();

  $$('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-scroll');
      const el = document.getElementById(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

const setupMobileNav = () => {
  const toggle = $('.nav-toggle');
  const menu = $('.nav-links');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('open');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });
};

const setupCarousel = () => {
  const image = $('#carousel-image');
  const images = [DEMO_SCREENSHOT_1_URL, DEMO_SCREENSHOT_2_URL, DEMO_SCREENSHOT_3_URL];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % images.length;
    image.style.opacity = 0;
    setTimeout(() => {
      image.src = images[index];
      image.style.opacity = 1;
    }, 300);
  }, 3500);
};

const setupReveal = () => {
  const elements = $$('[data-reveal], .card, .section-head, .hero-copy, .hero-showcase');
  elements.forEach((el) => el.classList.add('reveal'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el) => observer.observe(el));
};

const setupModal = () => {
  const modal = $('#project-modal');
  const modalTitle = $('#modal-title');
  const modalBody = $('#modal-body');
  const modalList = $('#modal-list');
  const focusable = 'button, [href], input, select, textarea';
  let lastFocused = null;

  const data = {
    'project-1': {
      title: 'Premium SaaS/Studio Landing',
      body: 'Cíl: zvednout počet poptávek z demo kampaní. Struktura staví na jasných benefitech a CTA.',
      list: ['Hero s přepínačem ukázek', 'Sekce s rychlým procesem', 'Formulář s více kroky'],
    },
    'project-2': {
      title: 'Luxury Restaurant Landing',
      body: 'Cíl: rezervace a stylový dojem. Vizuální prostor pro fotografie a rychlou navigaci k menu.',
      list: ['Parallax hero', 'Sekce menu + galerie', 'Rezervační CTA'],
    },
    'project-3': {
      title: 'Industrial Auto Service',
      body: 'Cíl: rychlá poptávka. Silná hierarchie, ikony služeb, jasné výzvy.',
      list: ['Servisní checklist', 'CTA bloky', 'Google map slot'],
    },
  };

  const openModal = (key) => {
    const entry = data[key];
    if (!entry) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = entry.title;
    modalBody.textContent = entry.body;
    modalList.innerHTML = '';
    entry.list.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      modalList.appendChild(li);
    });
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    const focusTargets = modal.querySelectorAll(focusable);
    focusTargets[0]?.focus();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    lastFocused?.focus();
  };

  $$('[data-modal]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.modal));
  });

  modal.addEventListener('click', (event) => {
    if (event.target.dataset.close !== undefined) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) closeModal();
    if (event.key === 'Tab' && modal.classList.contains('active')) {
      const focusTargets = modal.querySelectorAll(focusable);
      const first = focusTargets[0];
      const last = focusTargets[focusTargets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  $('[data-close]').addEventListener('click', closeModal);
};

const setupTilt = () => {
  if ('ontouchstart' in window) return;
  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

const setupForm = () => {
  const form = $('#lead-form');
  const steps = $$('.form-step');
  const progressBar = $('#progress-bar');
  const stepIndicator = $('#step-indicator');
  const prevBtn = $('#prev-step');
  const nextBtn = $('#next-step');
  const submitBtn = $('#submit-form');
  const success = $('#success');
  const summary = $('#summary');
  const copyBtn = $('#copy-summary');
  const successPersonal = $('#success-personal');
  const startButton = $('[data-start-form]');

  const updateStep = () => {
    steps.forEach((step) => step.classList.remove('active'));
    steps[state.currentStep - 1].classList.add('active');
    progressBar.style.width = `${(state.currentStep / state.totalSteps) * 100}%`;
    stepIndicator.textContent = `Krok ${state.currentStep} z ${state.totalSteps}`;
    prevBtn.style.display = state.currentStep === 1 ? 'none' : 'inline-flex';
    nextBtn.style.display = state.currentStep === state.totalSteps ? 'none' : 'inline-flex';
    submitBtn.style.display = state.currentStep === state.totalSteps ? 'inline-flex' : 'none';
  };

  const validateStep = () => {
    const activeStep = steps[state.currentStep - 1];
    const fields = Array.from(activeStep.querySelectorAll('input, select, textarea'));
    let valid = true;

    fields.forEach((field) => {
      if (field.type === 'radio') {
        const name = field.name;
        const group = Array.from(activeStep.querySelectorAll(`input[name="${name}"]`));
        const checked = group.some((item) => item.checked);
        group.forEach((item) => {
          item.setAttribute('aria-invalid', !checked);
        });
        if (!checked) valid = false;
        return;
      }

      if (field.type === 'checkbox') return;

      if (!field.checkValidity()) {
        field.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        field.removeAttribute('aria-invalid');
      }
    });

    return valid;
  };

  const collectSummary = () => {
    const formData = new FormData(form);
    const features = formData.getAll('funkce').join(', ') || 'Nezvoleno';
    const plan = formData.get('plan') || 'Neuvedeno';
    return [
      `Typ webu: ${formData.get('typ')}`,
      `Funkce: ${features}`,
      `Styl: ${formData.get('styl')}`,
      `Rozpočet: ${formData.get('rozpocet')}`,
      `Termín: ${formData.get('termin')}`,
      `Balíček: ${plan}`,
      `Jméno: ${formData.get('jmeno')}`,
      `Email: ${formData.get('email')}`,
      `Telefon: ${formData.get('telefon') || 'Neuvedeno'}`,
      `Zpráva: ${formData.get('zprava')}`,
    ];
  };

  const getPersonalMessage = () => {
    const formData = new FormData(form);
    const type = formData.get('typ') || 'neurčený typ';
    const budget = formData.get('rozpocet') || 'neurčený rozpočet';
    const deadline = formData.get('termin') || 'termín dle domluvy';
    return `Poptávka pro web typu ${type} s rozpočtem ${budget} je připravená. Termín: ${deadline}.`;
  };

  nextBtn.addEventListener('click', () => {
    if (!validateStep()) return;
    if (state.currentStep < state.totalSteps) {
      state.currentStep += 1;
      updateStep();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (state.currentStep > 1) {
      state.currentStep -= 1;
      updateStep();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Odesílám…';
    setTimeout(() => {
      form.hidden = true;
      success.hidden = false;
      successPersonal.textContent = getPersonalMessage();
      summary.innerHTML = collectSummary().map((line) => `<div>${line}</div>`).join('');
    }, 800);
  });

  copyBtn.addEventListener('click', async () => {
    const text = collectSummary().join('\n');
    await navigator.clipboard.writeText(text);
    showToast('Shrnutí zkopírováno do schránky');
  });

  if (startButton) {
    startButton.addEventListener('click', () => {
      state.currentStep = 1;
      updateStep();
      showToast('Začněme 👋');
    });
  }

  updateStep();
};

const showToast = (message) => {
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 2000);
};

const setupPricingActions = () => {
  const urlMap = {
    basic: FIVERR_BASIC_URL,
    standard: FIVERR_STANDARD_URL,
    premium: FIVERR_PREMIUM_URL,
  };

  $$('[data-fiverr]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.fiverr;
      const url = urlMap[key];
      if (!url) {
        showToast('Doplň odkaz na Fiverr balíček.');
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  $$('[data-plan]').forEach((button) => {
    button.addEventListener('click', () => {
      const plan = button.dataset.plan;
      const planInput = $('#plan-input');
      planInput.value = plan;
      document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' });
      showToast('Napište, co potřebujete — připravím nabídku.');
    });
  });
};

const setupFaqAccordion = () => {
  const items = $$('.faq-item');
  items.forEach((item) => {
    const button = $('.faq-question', item);
    const panel = $('.faq-panel', item);

    const closeItem = () => {
      button.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      panel.style.maxHeight = '0px';
      panel.classList.remove('open');
    };

    const openItem = () => {
      button.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      panel.classList.add('open');
    };

    closeItem();

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      items.forEach((other) => {
        if (other !== item) {
          const otherButton = $('.faq-question', other);
          const otherPanel = $('.faq-panel', other);
          otherButton.setAttribute('aria-expanded', 'false');
          otherPanel.setAttribute('aria-hidden', 'true');
          otherPanel.style.maxHeight = '0px';
          otherPanel.classList.remove('open');
        }
      });
      if (isOpen) {
        closeItem();
      } else {
        openItem();
      }
    });
  });
};

const init = () => {
  applyAssetPlaceholders();
  setupTheme();
  setupScroll();
  setupMobileNav();
  setupCarousel();
  setupReveal();
  setupModal();
  setupTilt();
  setupForm();
  setupPricingActions();
  setupFaqAccordion();
};

document.addEventListener('DOMContentLoaded', init);
