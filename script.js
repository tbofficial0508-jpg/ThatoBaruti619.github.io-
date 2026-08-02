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


/* ── CFD PARTICLE EFFECT on About photo ─────────────── */
(function () {
  const container = document.querySelector('.about-photo');
  const canvas    = document.querySelector('.cfd-canvas');
  if (!container || !canvas) return;

  const ctx  = canvas.getContext('2d');
  const N    = 180;   // number of streamline particles
  const SPD  = 0.9;   // base flow speed

  let W, H, particles, animId, running = false, t = 0, lastTs = 0;

  /* ── Resize canvas to match container ── */
  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  /* ── Velocity field: turbulent mixing layer ── */
  function velocity(x, y) {
    const nx = x / W;
    const ny = y / H;
    // Primary horizontal convection + sinusoidal shear waves
    const vx =  SPD * (1.0 + 0.55 * Math.cos(ny * Math.PI * 3.0 + t * 0.50)
                           + 0.25 * Math.sin(ny * Math.PI * 7.0 + t * 0.85));
    const vy =  SPD * (0.38 * Math.sin(nx * Math.PI * 2.5 + t * 0.40)
                           + 0.18 * Math.cos(ny * Math.PI * 5.0 + t * 0.65));
    return [vx, vy];
  }

  /* ── Spawn one particle ── */
  function spawn(fromEdge) {
    return {
      x:      fromEdge ? -2 : Math.random() * W,
      y:      Math.random() * H,
      px:     0,
      py:     0,
      age:    fromEdge ? 0 : Math.random() * 180,
      maxAge: 140 + Math.random() * 100,
      w:      0.5 + Math.random() * 1.1,   // line width
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: N }, () => spawn(false));
  }

  /* ── Single animation frame ── */
  function frame(ts) {
    const dt = Math.min((ts - lastTs) / 16, 3);
    lastTs = ts;
    t += 0.005 * dt;

    /* Fade trail — semi-transparent fill preserves streaks */
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(0, 0, W, H);

    for (const p of particles) {
      p.px = p.x;
      p.py = p.y;

      const [vx, vy] = velocity(p.x, p.y);
      p.x  += vx * dt;
      p.y  += vy * dt;
      p.age += dt;

      /* Respawn when off-screen or expired */
      if (p.age > p.maxAge || p.x > W + 4 || p.y < -4 || p.y > H + 4) {
        Object.assign(p, spawn(true));
        continue;
      }

      /* Alpha envelope: fade in, sustain, fade out */
      const prog  = p.age / p.maxAge;
      const alpha = prog < 0.12
        ? prog / 0.12
        : prog > 0.78
          ? (1 - prog) / 0.22
          : 1;

      /* Colour shifts from teal → cyan for depth */
      const g = Math.round(122 + 58 * prog);   // 122 → 180
      const b = Math.round(104 + 68 * prog);   // 104 → 172

      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x,  p.y);
      ctx.strokeStyle = `rgba(3,${g},${b},${alpha * 0.72})`;
      ctx.lineWidth   = p.w;
      ctx.shadowColor = `rgba(3,${g},${b},${alpha * 0.55})`;
      ctx.shadowBlur  = 4;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    animId = requestAnimationFrame(frame);
  }

  /* ── Start / stop with IntersectionObserver ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !running) {
        running  = true;
        lastTs   = performance.now();
        animId   = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        cancelAnimationFrame(animId);
        running = false;
      }
    });
  }, { threshold: 0.1 });

  init();
  window.addEventListener('resize', () => { resize(); });
  io.observe(container);
}());
