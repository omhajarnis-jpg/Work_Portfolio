/* ═══════════════════════════════════════════
   OM HAJARNIS — PORTFOLIO SCRIPT
   Custom cursor, canvas animations, 
   scroll reveal, nav, tilt effects
═══════════════════════════════════════════ */

// ── CUSTOM CURSOR ────────────────────────────
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// cursor hover expand
document.querySelectorAll('a, button, .cat-card, .work-card, .service-card, .sport-item, .platform-link, .contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '60px';
    cursor.style.height = '60px';
    cursor.style.borderColor = 'rgba(240,165,0,0.6)';
    cursor.style.background  = 'rgba(240,165,0,0.06)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '36px';
    cursor.style.height = '36px';
    cursor.style.borderColor = 'var(--accent)';
    cursor.style.background  = 'transparent';
  });
});


// ── NAVBAR SCROLL + MOBILE ────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('nav-open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('nav-open'));
});


// ── HERO CANVAS — PARTICLE GRID ───────────────
const heroCanvas = document.getElementById('heroCanvas');
const hCtx = heroCanvas.getContext('2d');

function resizeHeroCanvas() {
  heroCanvas.width  = window.innerWidth;
  heroCanvas.height = window.innerHeight;
}
resizeHeroCanvas();
window.addEventListener('resize', resizeHeroCanvas);

const COLS = Math.floor(window.innerWidth / 60);
const ROWS = 12;
let heroParticles = [];

function createHeroParticles() {
  heroParticles = [];
  for (let c = 0; c <= COLS; c++) {
    for (let r = 0; r <= ROWS; r++) {
      heroParticles.push({
        x: (c / COLS) * heroCanvas.width,
        y: (r / ROWS) * heroCanvas.height,
        ox: (c / COLS) * heroCanvas.width,
        oy: (r / ROWS) * heroCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.4 + 0.05,
      });
    }
  }
}
createHeroParticles();

let heroMX = -9999, heroMY = -9999;
document.addEventListener('mousemove', e => { heroMX = e.clientX; heroMY = e.clientY; });

function drawHeroCanvas() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

  // subtle gradient overlay
  const grad = hCtx.createRadialGradient(
    heroCanvas.width * 0.25, heroCanvas.height * 0.5, 0,
    heroCanvas.width * 0.25, heroCanvas.height * 0.5, heroCanvas.width * 0.7
  );
  grad.addColorStop(0,   'rgba(240,120,0,0.07)');
  grad.addColorStop(0.5, 'rgba(20,10,0,0.04)');
  grad.addColorStop(1,   'rgba(0,0,0,0)');
  hCtx.fillStyle = grad;
  hCtx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);

  // particles
  const mouseRadius = 140;
  heroParticles.forEach(p => {
    const dx = heroMX - p.x;
    const dy = heroMY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouseRadius) {
      const force = (mouseRadius - dist) / mouseRadius;
      p.vx -= (dx / dist) * force * 0.8;
      p.vy -= (dy / dist) * force * 0.8;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.vx += (p.ox - p.x) * 0.012;
    p.vy += (p.oy - p.y) * 0.012;
    p.vx *= 0.94;
    p.vy *= 0.94;

    hCtx.beginPath();
    hCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    hCtx.fillStyle = `rgba(240,165,0,${p.alpha})`;
    hCtx.fill();
  });

  // grid lines
  hCtx.strokeStyle = 'rgba(240,165,0,0.04)';
  hCtx.lineWidth = 0.5;
  for (let c = 0; c <= COLS; c++) {
    const x = (c / COLS) * heroCanvas.width;
    hCtx.beginPath();
    hCtx.moveTo(x, 0);
    hCtx.lineTo(x, heroCanvas.height);
    hCtx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    const y = (r / ROWS) * heroCanvas.height;
    hCtx.beginPath();
    hCtx.moveTo(0, y);
    hCtx.lineTo(heroCanvas.width, y);
    hCtx.stroke();
  }

  requestAnimationFrame(drawHeroCanvas);
}
drawHeroCanvas();


// ── CONTACT CANVAS — ORB ─────────────────────
const contactCanvas = document.getElementById('contactCanvas');
const cCtx = contactCanvas.getContext('2d');

function resizeContactCanvas() {
  contactCanvas.width  = contactCanvas.parentElement.offsetWidth;
  contactCanvas.height = contactCanvas.parentElement.offsetHeight;
}
resizeContactCanvas();
window.addEventListener('resize', resizeContactCanvas);

let contactTime = 0;
function drawContactCanvas() {
  contactTime += 0.005;
  cCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);

  const cx = contactCanvas.width / 2;
  const cy = contactCanvas.height / 2;

  for (let i = 0; i < 3; i++) {
    const r = 280 + i * 80;
    const ox = Math.sin(contactTime + i * 1.2) * 60;
    const oy = Math.cos(contactTime * 0.8 + i * 0.9) * 40;

    const grad = cCtx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, r);
    grad.addColorStop(0,   `rgba(240,120,0,${0.06 - i * 0.015})`);
    grad.addColorStop(0.5, `rgba(240,80,0,${0.03 - i * 0.008})`);
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    cCtx.fillStyle = grad;
    cCtx.beginPath();
    cCtx.ellipse(cx + ox, cy + oy, r, r * 0.7, contactTime * 0.2, 0, Math.PI * 2);
    cCtx.fill();
  }
  requestAnimationFrame(drawContactCanvas);
}
drawContactCanvas();


// ── SCROLL REVEAL ────────────────────────────
const srEls = document.querySelectorAll(
  '.about-grid, .cat-card, .work-card, .service-card, .sport-item, .platform-link, .contact-item, .section-label, .section-heading, .about-stats, .sports-note, .contact-sub'
);

srEls.forEach((el, i) => {
  el.setAttribute('data-sr', '');
  // stagger cards
  const parent = el.parentElement;
  if (parent && (parent.classList.contains('cards-grid') || parent.classList.contains('works-grid') || parent.classList.contains('services-grid') || parent.classList.contains('sports-grid') || parent.classList.contains('platforms-row') || parent.classList.contains('contact-links'))) {
    const siblings = Array.from(parent.children);
    const idx = siblings.indexOf(el);
    el.setAttribute('data-sr-delay', String(idx * 100));
  }
});

const srObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      srObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-sr]').forEach(el => srObserver.observe(el));


// ── CARD TILT ────────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── SPORT BADGE PARALLAX ─────────────────────
const badges = document.querySelectorAll('.sport-badge');
window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  badges.forEach((badge, i) => {
    const depth = 0.02 + i * 0.008;
    const dx = (e.clientX - cx) * depth;
    const dy = (e.clientY - cy) * depth;
    badge.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});


// ── SMOOTH ANCHOR SCROLL ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── CANVAS RESIZE ON WINDOW RESIZE ───────────
window.addEventListener('resize', () => {
  createHeroParticles();
});
