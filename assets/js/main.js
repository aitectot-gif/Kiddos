// Kiddos Paradise — site behaviour. Each feature no-ops when its elements are absent.
(() => {
  // Set this to a form service URL (Formspree, Google Apps Script web app, etc.) once it is
  // configured and tested. While empty, the form opens a pre-filled email draft instead.
  const FORM_ENDPOINT = '';
  const SCHOOL_EMAIL = 'kiddosparadise19@gmail.com';

  const MESSAGES = {
    sent: 'Thank you for enquiring with Kiddos Paradise. Your details have been submitted. The school team will contact you using the information provided.',
    mailto: 'Opening an email draft to Kiddos Paradise. Your enquiry is sent only when you send that email.',
    error: 'Sorry, your enquiry could not be sent. Please call 99727 76012 or 91879 63957.',
    sending: 'Sending your enquiry…',
  };

  const FIELDS = ['parentName', 'phone', 'childAge', 'program', 'startDate', 'message'];

  function readFields(form) {
    const data = new FormData(form);
    return Object.fromEntries(FIELDS.map(name => [name, String(data.get(name) || '').trim()]));
  }

  function buildMailto(fields) {
    const subject = `Website enquiry — ${fields.program || 'Admissions'}`;
    const body = [
      'Hello Kiddos Paradise,',
      '',
      'I would like to enquire about a program.',
      '',
      `Parent/Guardian: ${fields.parentName}`,
      `Phone: ${fields.phone}`,
      `Child's age: ${fields.childAge}`,
      `Program: ${fields.program}`,
      `Preferred start date: ${fields.startDate || 'Not specified'}`,
      `Message: ${fields.message || 'Not provided'}`,
      '',
      'Please contact me with more details.',
    ].join('\r\n');
    return `mailto:${SCHOOL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function setStatus(form, state, text) {
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.dataset.state = state;
    status.textContent = text;
  }

  async function submitEnquiry(form, {
    endpoint = FORM_ENDPOINT,
    fetchImpl = window.fetch.bind(window),
    navigate = url => { window.location.href = url; },
  } = {}) {
    // Honeypot: real visitors never see or fill this field.
    if (String(form.elements.company?.value || '').trim()) return 'blocked';

    const fields = readFields(form);
    if (!endpoint) {
      setStatus(form, 'mailto', MESSAGES.mailto);
      navigate(buildMailto(fields));
      return 'mailto';
    }

    const button = form.querySelector('[type=submit]');
    if (button) button.disabled = true;
    setStatus(form, 'sending', MESSAGES.sending);
    try {
      const body = new FormData();
      Object.entries(fields).forEach(([key, value]) => body.append(key, value));
      body.append('consent', 'yes');
      const response = await fetchImpl(endpoint, { method: 'POST', body, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus(form, 'sent', MESSAGES.sent);
      form.reset();
      return 'sent';
    } catch (err) {
      setStatus(form, 'error', MESSAGES.error);
      return 'error';
    } finally {
      if (button) button.disabled = false;
    }
  }

  window.KP = { FORM_ENDPOINT, MESSAGES, buildMailto, submitEnquiry };

  // Mobile navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const setMenu = open => {
    nav?.classList.toggle('open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) { setMenu(false); menuToggle?.focus(); }
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Gallery filters
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    document.querySelectorAll('.gallery-page-grid .gallery-item').forEach(item => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  }));

  // Lightbox — only for gallery items that contain a real photo
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  document.querySelectorAll('button.gallery-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img || !lightbox) return;
    item.addEventListener('click', () => {
      lightboxImage.src = item.dataset.full || img.src;
      lightboxImage.alt = img.alt;
      lightbox.showModal();
    });
  });
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

  // Enquiry forms
  document.querySelectorAll('form.enquiry-form[data-enquiry]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      submitEnquiry(form);
    });
  });
})();
