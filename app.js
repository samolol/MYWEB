const DEMO_SCREENSHOT_1_URL = "assets/screen1.png";
const DEMO_SCREENSHOT_2_URL = "assets/screen2.png";
const DEMO_SCREENSHOT_3_URL = "assets/screen3.png";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeekqebw";

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
  if (carouselImage) carouselImage.src = DEMO_SCREENSHOT_1_URL;
};

const setupTheme = () => {
  const toggle = $('.theme-toggle');
  if (!toggle) return;

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
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
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
  if (!image) return;

  const images = [DEMO_SCREENSHOT_1_URL, DEMO_SCREENSHOT_2_URL, DEMO_SCREENSHOT_3_URL];
  let index = 0;

  setInterval(() => {
    index = (index + 1) % images.length;
    image.style.opacity = 0;
    setTimeout(() => {
      image.src = images[index];
      image.style.opacity = 1;
    }, 250);
  }, 3200);
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
  if (!modal) return;

  const modalTitle = $('#modal-title');
  const modalBody = $('#modal-body');
  const modalList = $('#modal-list');
  const focusable = 'button, [href], input, select, textarea';
  let lastFocused = null;

  const data = {
    'project-1': {
      title: 'Premium SaaS/Studio Landing',
      body: 'Ukázka moderního landing page pro službu nebo studio.',
      list: ['Výrazná hero sekce', 'Jasné CTA prvky', 'Přehledná struktura sekcí'],
    },
    'project-2': {
      title: 'Luxury Restaurant Landing',
      body: 'Ukázka webu pro restauraci nebo kavárnu s důrazem na důvěru a rezervace.',
      list: ['Velké vizuály', 'Rychlý kontakt', 'Sekce nabídky a výhod'],
    },
    'project-3': {
      title: 'Industrial Auto Service',
      body: 'Ukázka webu pro služby a řemesla se zaměřením na poptávku.',
      list: ['Přehled služeb', 'Silné kontaktní výzvy', 'Jednoduchá orientace'],
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
};

const setupTilt = () => {
  if ('ontouchstart' in window) return;

  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -5;
      const rotateY = ((x / rect.width) - 0.5) * 5;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

const showToast = (message) => {
  const toast = $('#toast');
  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;

  setTimeout(() => {
    toast.hidden = true;
  }, 2200);
};

const setupHeroVideo = () => {
  const video = $('#hero-video');
  const fallback = $('#hero-video-fallback');
  if (!video || !fallback) return;

  const showFallback = () => {
    fallback.hidden = false;
    video.style.display = 'none';
  };

  const hideFallback = () => {
    fallback.hidden = true;
    video.style.display = '';
  };

  const onViewportChange = () => {
    if (window.matchMedia('(max-width: 600px)').matches) {
      video.pause();
      showFallback();
      return;
    }
    hideFallback();
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(showFallback);
    }
  };

  video.addEventListener('error', showFallback);
  video.addEventListener('loadeddata', hideFallback);
  window.addEventListener('resize', onViewportChange);
  onViewportChange();
};

const setupPortfolioActions = () => {
  const buttons = $$('[data-portfolio-cta]');
  const prefillInput = $('#prefill-input');
  const messageField = $('textarea[name="zprava"]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.prefill || '';

      if (prefillInput) prefillInput.value = selected;

      if (messageField && !messageField.value.trim()) {
        messageField.value = `Mám zájem o podobný web (${selected}).`;
      }

      document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });
      showToast('Vyplňte pár detailů — ozvu se do 24 hodin.');
    });
  });
};

const setupForm = () => {
  const form = $('#lead-form');
  const success = $('#success');
  const successPersonal = $('#success-personal');
  const resetBtn = $('#reset-form');
  const submitBtn = $('#submit-form');
  const gotcha = $('#gotcha');
  const emailField = $('#email-field');
  const phoneField = $('#phone-field');
  const messageField = $('textarea[name="zprava"]');

  if (!form || !success || !submitBtn) return;

  const resetValidation = () => {
    emailField?.removeAttribute('aria-invalid');
    phoneField?.removeAttribute('aria-invalid');
    messageField?.removeAttribute('aria-invalid');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetValidation();

    const hasEmail = Boolean(emailField?.value.trim());
    const hasPhone = Boolean(phoneField?.value.trim());

    if (!hasEmail && !hasPhone) {
      emailField?.setAttribute('aria-invalid', 'true');
      phoneField?.setAttribute('aria-invalid', 'true');
      showToast('Vyplňte prosím e-mail nebo telefon.');
      return;
    }

    if (!form.checkValidity()) {
      form.querySelectorAll('input, textarea').forEach((field) => {
        if (!field.checkValidity()) field.setAttribute('aria-invalid', 'true');
      });
      showToast('Doplňte prosím povinné údaje.');
      return;
    }

    if (gotcha && gotcha.value) {
      showToast('Díky! Ozvu se vám co nejdřív.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Odesílám…';

    const formData = new FormData(form);
    const payload = {
      source: 'webnamiru.online',
      name: formData.get('jmeno') || '',
      company: formData.get('firma') || '',
      email: formData.get('email') || '',
      phone: formData.get('telefon') || '',
      preferred_type: formData.get('predvyber') || '',
      message: formData.get('zprava') || '',
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Form submit failed');

      form.hidden = true;
      success.hidden = false;
      successPersonal.textContent = `Díky ${payload.name || ''}, ozvu se vám s dalším postupem.`.trim();
      showToast('Poptávka odeslána.');
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Odeslat poptávku';
      showToast('Odeslání se nepovedlo. Zkuste to prosím znovu.');
    }
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Odeslat poptávku';
    resetValidation();
  });
};

const init = () => {
  applyAssetPlaceholders();
  setupHeroVideo();
  setupTheme();
  setupScroll();
  setupMobileNav();
  setupCarousel();
  setupReveal();
  setupModal();
  setupTilt();
  setupPortfolioActions();
  setupForm();
};

document.addEventListener('DOMContentLoaded', init);
