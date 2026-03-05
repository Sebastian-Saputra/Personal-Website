/* ===========================
   script.js — Dwi Sebastian Saputra
   Space-themed Personal Branding
   =========================== */

// ─── CURSOR ───────────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX - 4 + 'px';
  cursor.style.top  = mouseY - 4 + 'px';
});

// Trail with lag
let trailX = 0, trailY = 0;
function animateTrail() {
  trailX += (mouseX - trailX) * 0.1;
  trailY += (mouseY - trailY) * 0.1;
  cursorTrail.style.left = trailX - 15 + 'px';
  cursorTrail.style.top  = trailY - 15 + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Scale cursor on hover
document.querySelectorAll('a, button, .tag, .tech-card, .signal-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2.5)';
    cursorTrail.style.transform = 'scale(1.5)';
    cursorTrail.style.borderColor = 'rgba(52, 211, 153, 0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursorTrail.style.transform = 'scale(1)';
    cursorTrail.style.borderColor = 'rgba(96, 165, 250, 0.5)';
  });
});

// ─── STAR CANVAS ──────────────────────────────────────────────────────────────
const canvas = document.getElementById('starCanvas');
const ctx    = canvas.getContext('2d');
let stars    = [];
let shootingStars = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });
resizeCanvas();

function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 4000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.5 + 0.2,
      alpha:   Math.random(),
      speed:   Math.random() * 0.005 + 0.001,
      flicker: Math.random() * Math.PI * 2,
      color:   pickStarColor(),
    });
  }
}

function pickStarColor() {
  const colors = [
    'rgba(255,255,255,',
    'rgba(147,197,253,', // blue-ish
    'rgba(167,243,208,', // green-ish
    'rgba(253,230,138,', // yellow-ish
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function spawnShootingStar() {
  shootingStars.push({
    x:      Math.random() * canvas.width,
    y:      Math.random() * canvas.height * 0.5,
    len:    Math.random() * 120 + 60,
    speed:  Math.random() * 8 + 5,
    alpha:  1,
    angle:  Math.PI / 4 + (Math.random() - 0.5) * 0.3,
  });
}
setInterval(spawnShootingStar, 4000 + Math.random() * 4000);

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Twinkling stars
  stars.forEach(s => {
    s.flicker += s.speed;
    const a = (Math.sin(s.flicker) * 0.4 + 0.6) * s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.color + a + ')';
    ctx.fill();
  });

  // Shooting stars
  shootingStars = shootingStars.filter(ss => ss.alpha > 0);
  shootingStars.forEach(ss => {
    const tailX = ss.x - Math.cos(ss.angle) * ss.len;
    const tailY = ss.y - Math.sin(ss.angle) * ss.len;
    const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
    grad.addColorStop(0, `rgba(255,255,255,0)`);
    grad.addColorStop(1, `rgba(96,165,250,${ss.alpha})`);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(ss.x, ss.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.alpha -= 0.018;
  });

  requestAnimationFrame(drawStars);
}
initStars();
drawStars();

// ─── NAVBAR SCROLL ────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── TYPEWRITER EFFECT ────────────────────────────────────────────────────────
const phrases = [
  'Network Explorer',
  'Code Enthusiast',
  'Astronomy Dreamer',
  'TJKT Student',
  'Digital Navigator',
  'Future Engineer',
];
let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typeEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, isDeleting ? 55 : 100);
}
setTimeout(typeWriter, 1200);

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .timeline-item, .about-card, .contact-form, .contact-info').forEach(el => {
  revealObserver.observe(el);
});

// ─── SKILL BARS ───────────────────────────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const parent = bar.closest('.skill-entry');
        const val    = parent.dataset.skill || 0;
        bar.style.width = val + '%';
      });
      entry.target.classList.add('revealed');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsRadar = document.querySelector('.skills-radar-row');
if (skillsRadar) skillObserver.observe(skillsRadar);

// ─── PARALLAX NEBULA ON MOUSE ──────────────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll('.nebula').forEach((n, i) => {
    const factor = (i + 1) * 0.4;
    n.style.transform = `translate(${x * factor}px, ${y * factor}px) scale(1.05)`;
  });
});

// ─── ACTIVE NAV HIGHLIGHT ─────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    if (href === current) {
      a.style.color = 'var(--accent)';
    } else {
      a.style.color = '';
    }
  });
});

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function sendMessage() {
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg   = document.getElementById('f-msg').value.trim();
  const toast = document.getElementById('toast');
  const btn   = document.getElementById('submitBtn');

  if (!name || !email || !msg) {
    toast.textContent = '⚠️ Harap isi semua field terlebih dahulu.';
    toast.style.color = '#f472b6';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    return;
  }

  btn.textContent = '📡 TRANSMITTING...';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('f-name').value  = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-msg').value   = '';
    toast.textContent = '✅ SIGNAL TRANSMITTED SUCCESSFULLY';
    toast.style.color = 'var(--accent2)';
    toast.classList.add('show');
    btn.innerHTML = '<span class="transmit-icon">📡</span><span>TRANSMIT MESSAGE</span>';
    btn.disabled = false;
    setTimeout(() => toast.classList.remove('show'), 4000);
  }, 1500);
}

// ─── EASTER EGG: Konami Code ──────────────────────────────────────────────────
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', (e) => {
  if (e.key === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      konamiIdx = 0;
      document.body.style.animation = 'none';
      // Spawn a burst of shooting stars
      for (let i = 0; i < 20; i++) {
        setTimeout(() => spawnShootingStar(), i * 100);
      }
    }
  } else {
    konamiIdx = 0;
  }
});

// ─── CARD TILT EFFECT ─────────────────────────────────────────────────────────
document.querySelectorAll('.about-card, .skill-card, .tech-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── SMOOTH SCROLL for nav links ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
