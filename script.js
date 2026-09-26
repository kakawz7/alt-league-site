(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const year = document.querySelector('[data-current-year]');

  if (year) year.textContent = new Date().getFullYear();
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = [...document.querySelectorAll('.reveal')];
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  const COOKIE_KEY = 'ctpevg-cookie-consent-v1';
  const banner = document.querySelector('[data-cookie-banner]');
  const dialog = document.querySelector('[data-cookie-dialog]');
  const analyticsToggle = document.querySelector('[data-analytics-toggle]');

  const getConsent = () => {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; }
  };
  const setConsent = (analytics) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: !!analytics, updatedAt: new Date().toISOString() }));
    if (banner) banner.hidden = true;
  };
  const currentConsent = getConsent();
  if (!currentConsent && banner) banner.hidden = false;

  document.querySelector('[data-cookie-essential]')?.addEventListener('click', () => setConsent(false));
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => setConsent(true));
  document.querySelectorAll('[data-cookie-settings]').forEach(btn => btn.addEventListener('click', () => {
    const consent = getConsent();
    if (analyticsToggle) analyticsToggle.checked = !!consent?.analytics;
    dialog?.showModal();
  }));
  document.querySelector('[data-cookie-save]')?.addEventListener('click', (event) => {
    event.preventDefault();
    setConsent(!!analyticsToggle?.checked);
    dialog?.close();
  });
})();