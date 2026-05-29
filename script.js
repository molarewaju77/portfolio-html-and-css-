/**
 * portfolio-script.js
 * ─────────────────────────────────────────────────────────────
 * Vanilla JS for Olarewaju Michael's portfolio site.
 * Modules:
 *   1. Navbar – glassmorphism on scroll + active link tracking
 *   2. Mobile Menu – toggle with a11y management
 *   3. Scroll Reveal – Intersection Observer fade-up animation
 *   4. Back-to-Top – visibility + smooth scroll
 *   5. Active Nav Link – highlights current section in viewport
 *   6. Contact Form – client-side validation + submit handler
 *   7. Footer Year – auto-updates copyright year
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ──────────────────────────────────────────────
   1. NAVBAR – Glassmorphism on scroll
────────────────────────────────────────────── */
(function initNavbar() {
  const header = document.getElementById('nav-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 20;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load in case page is already scrolled
})();


/* ──────────────────────────────────────────────
   2. MOBILE MENU – toggle with accessibility
────────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle   = document.getElementById('nav-toggle');
  const menu     = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent scroll behind menu
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  }

  toggle.addEventListener('click', toggleMenu);

  // Close on mobile link click (smooth scroll then close)
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when clicking outside the menu area
  document.addEventListener('click', e => {
    const isInsideMenu   = menu.contains(e.target);
    const isInsideToggle = toggle.contains(e.target);
    if (!isInsideMenu && !isInsideToggle && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
})();


/* ──────────────────────────────────────────────
   3. SCROLL REVEAL – Intersection Observer
────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up');
  if (!revealEls.length) return;

  // If reduced-motion is preferred, reveal immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,          // viewport
    rootMargin: '0px 0px -60px 0px',  // trigger slightly before entering viewport
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  revealEls.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   4. BACK-TO-TOP BUTTON
────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_AFTER = 400; // px scrolled before showing button

  function toggleVisibility() {
    if (window.scrollY > SHOW_AFTER) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility(); // run once on load
})();


/* ──────────────────────────────────────────────
   5. ACTIVE NAV LINK – highlights section in viewport
────────────────────────────────────────────── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
})();


/* ──────────────────────────────────────────────
   6. CONTACT FORM – client-side validation
────────────────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn  = document.getElementById('form-submit-btn');

  if (!form) return;

  // ---- Validation helpers ----

  function getField(id)  { return document.getElementById(id); }
  function getError(id)  { return document.getElementById(`${id}-error`); }

  function showError(fieldId, msg) {
    const field = getField(fieldId);
    const error = getError(fieldId);
    if (!field || !error) return;
    field.classList.add('input-error');
    error.textContent = msg;
  }

  function clearError(fieldId) {
    const field = getField(fieldId);
    const error = getError(fieldId);
    if (!field || !error) return;
    field.classList.remove('input-error');
    error.textContent = '';
  }

  function validateEmail(value) {
    // Basic RFC-5322 subset regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateForm() {
    let valid = true;

    const name    = getField('name');
    const email   = getField('email');
    const message = getField('message');

    // Name
    if (!name.value.trim()) {
      showError('name', 'Please enter your name.');
      valid = false;
    } else if (name.value.trim().length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      clearError('name');
    }

    // Email
    if (!email.value.trim()) {
      showError('email', 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email.value)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email');
    }

    // Message
    if (!message.value.trim()) {
      showError('message', 'Please write a message.');
      valid = false;
    } else if (message.value.trim().length < 10) {
      showError('message', 'Message must be at least 10 characters.');
      valid = false;
    } else {
      clearError('message');
    }

    return valid;
  }

  // ---- Real-time error clearing on input ----
  ['name', 'email', 'message'].forEach(id => {
    const field = getField(id);
    if (field) {
      field.addEventListener('input', () => clearError(id));
    }
  });

  // ---- Submit handler ----
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateForm()) return;

    // Disable the button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    /**
     * Simulate an async form submission (replace with real fetch/API call).
     * Example using fetch:
     *
     * fetch('/api/contact', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     name:    getField('name').value.trim(),
     *     email:   getField('email').value.trim(),
     *     message: getField('message').value.trim(),
     *   }),
     * })
     * .then(res => res.json())
     * .then(handleSuccess)
     * .catch(handleError);
     */
    setTimeout(() => {
      handleSuccess();
    }, 1200);
  });

  function handleSuccess() {
    form.reset();
    ['name', 'email', 'message'].forEach(id => clearError(id));

    if (successMsg) {
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Send Message
      <svg class="btn-icon" aria-hidden="true" viewBox="0 0 16 16" fill="none">
        <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    // Auto-hide success message after 6 seconds
    setTimeout(() => {
      if (successMsg) {
        successMsg.hidden = true;
      }
    }, 6000);
  }
})();


/* ──────────────────────────────────────────────
   7. FOOTER YEAR – auto copyright year
────────────────────────────────────────────── */
(function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* ──────────────────────────────────────────────
   8. SMOOTH ANCHOR SCROLL – override default jump
   (enhances links that aren't caught by CSS scroll-behavior)
────────────────────────────────────────────── */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('nav-header')?.offsetHeight || 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
})();
