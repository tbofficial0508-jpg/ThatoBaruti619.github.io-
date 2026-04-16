/* =====================================================
   THATO BARUTI — Landing Page Scripts
   ===================================================== */

'use strict';

/* ── NAVBAR: transparent → frosted glass on scroll ─── */
const navbar = document.getElementById('navbar');

const handleNavbarScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* ── ACTIVE NAV LINK on scroll ──────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const highlightNav = () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', highlightNav, { passive: true });


/* ── REVEAL ANIMATIONS via IntersectionObserver ─────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ── SMOOTH SCROLL for anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
