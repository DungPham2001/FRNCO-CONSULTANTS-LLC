(function () {
  'use strict';

  var CONTACT_EMAIL = 'harrydawg17@gmail.com';

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('primary-nav');
  var backdrop = document.querySelector('.nav-backdrop');
  var mobileQuery = window.matchMedia('(max-width: 900px)');

  /* ---------- Mobile (hamburger) navigation ---------- */
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    if (backdrop) backdrop.hidden = !open;
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing any link inside the menu
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    // Reset when returning to desktop width
    var onChange = function (e) { if (!e.matches) setMenu(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onChange);
    else mobileQuery.addListener(onChange);
  }

  /* ---------- Active link highlighting ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function updateActive() {
    var offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 76) + 80;
    var current = sections[0] ? sections[0].id : '';
    var atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (atBottom && sections.length) {
      current = sections[sections.length - 1].id;
    } else {
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top - offset <= 0) current = s.id;
      });
    }
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateActive(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form (opens the visitor's email app, no backend needed) ---------- */
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');

  function setError(field, message) {
    var wrap = field.closest('.field');
    var slot = wrap && wrap.querySelector('.error');
    if (wrap) wrap.classList.toggle('invalid', !!message);
    if (slot) slot.textContent = message || '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate(form) {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; } else setError(name, '');

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    if (!emailOk) { setError(email, 'Please enter a valid email address.'); ok = false; } else setError(email, '');

    if (message.value.trim().length < 5) { setError(message, 'Please write a short message.'); ok = false; } else setError(message, '');

    return ok;
  }

  if (form && note) {
    ['name', 'email', 'message'].forEach(function (n) {
      form.elements[n].addEventListener('input', function (e) {
        if (e.target.closest('.field').classList.contains('invalid')) validate(form);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.className = 'form-note';
      note.textContent = '';

      if (!validate(form)) {
        var firstInvalid = form.querySelector('.invalid input, .invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = form.elements;
      var subject = 'Inquiry: ' + data.topic.value + ' - ' + data.name.value.trim();
      var body =
        'Name: ' + data.name.value.trim() + '\n' +
        'Email: ' + data.email.value.trim() + '\n' +
        'Interested in: ' + data.topic.value + '\n\n' +
        data.message.value.trim();

      var href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      note.className = 'form-note ok';
      note.innerHTML = 'Thank you! Your email app is opening with your message. ' +
        'If nothing happens, <a href="' + href + '">click here</a> or write to ' + CONTACT_EMAIL + '.';

      window.location.href = href;
      form.reset();
    });
  }
})();
