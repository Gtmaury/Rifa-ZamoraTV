/* ============================================
   TV ZAMORA - SORTEO SCRIPT
   Lógica de sorteo, animaciones y efectos
   ============================================ */

// ---- Winners Data ----
const winners = [
  { name: "María González", ci: "V-18.456.789", city: "Caracas", prize: "Viaje a Margarita" },
  { name: "Carlos Mendoza", ci: "V-22.789.012", city: "Valencia", prize: "Viaje a Los Roques" },
  { name: "Ana Rodríguez", ci: "V-19.234.567", city: "Maracaibo", prize: "Viaje a Mérida" },
  { name: "Lucía Fernández", ci: "V-20.331.002", city: "Barquisimeto", prize: "Viaje a Mérida" },
  { name: "Pedro Ramírez", ci: "V-21.567.890", city: "Barinas", prize: "Viaje a Canaima" },
  { name: "Sofía Martínez", ci: "V-17.890.123", city: "Maturín", prize: "Viaje a Margarita" },
  { name: "Diego Herrera", ci: "V-23.123.456", city: "San Cristóbal", prize: "Viaje a Los Roques" },
  { name: "Valentina López", ci: "V-20.456.789", city: "Puerto La Cruz", prize: "Viaje a Mérida" },
  { name: "Andrés Torres", ci: "V-19.789.012", city: "Cumaná", prize: "Viaje a Canaima" },
  { name: "Isabella Díaz", ci: "V-24.012.345", city: "Ciudad Bolívar", prize: "Viaje a Margarita" }
];

let currentIndex = 0;
let isAnimating = false;

// ---- Date Display ----
function setDate() {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  document.getElementById('date-display').textContent = `${day} de ${month}, ${year}`;
}

// ---- Counter Dots ----
function initCounterDots() {
  const container = document.getElementById('counter-indicator');
  container.innerHTML = '';
  winners.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'counter-dot' + (i === 0 ? ' active' : '');
    container.appendChild(dot);
  });
}

function updateCounterDots() {
  const dots = document.querySelectorAll('.counter-dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i < currentIndex) dot.classList.add('done');
    if (i === currentIndex) dot.classList.add('active');
  });
}

// ---- Show Winner ----
function displayWinner(winner, index) {
  const card = document.getElementById('winner-card');
  const nameEl = document.getElementById('winner-name');
  const ciEl = document.getElementById('winner-ci');
  const prizeEl = document.getElementById('prize-text');
  const badgeNum = document.getElementById('sorteo-number');

  // Update sorteo number
  badgeNum.textContent = index + 1;

  // Reset animations by removing/re-adding classes
  ciEl.style.animation = 'none';
  nameEl.style.animation = 'none';
  document.getElementById('prize-badge').style.animation = 'none';

  // Start shuffle effect
  nameEl.classList.add('shuffling');
  nameEl.style.animation = '';
  nameEl.style.opacity = '1';

  // Shuffle through random names
  const shuffleNames = winners.map(w => w.name);
  let shuffleCount = 0;
  const maxShuffles = 20;
  const shuffleInterval = setInterval(() => {
    const randomName = shuffleNames[Math.floor(Math.random() * shuffleNames.length)];
    nameEl.textContent = randomName;
    shuffleCount++;

    if (shuffleCount >= maxShuffles) {
      clearInterval(shuffleInterval);
      nameEl.classList.remove('shuffling');

      // Reveal real winner
      nameEl.textContent = winner.name;
      nameEl.setAttribute('data-name', winner.name);
      ciEl.textContent = `CI: ${winner.ci} | ${winner.city}`;
      prizeEl.textContent = winner.prize;

      // Trigger reveal animations
      nameEl.style.animation = 'nameReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
      ciEl.style.animation = 'fadeSlideUp 0.5s ease forwards';
      document.getElementById('prize-badge').style.animation = 'prizePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

      // Launch confetti
      launchConfetti();

      // Allow next click
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
  }, 60);
}

// ---- Next Sorteo ----
function nextSorteo() {
  if (isAnimating) return;

  // If we've shown the last winner, do nothing or reset
  if (currentIndex >= winners.length) {
    return;
  }

  isAnimating = true;
  const card = document.getElementById('winner-card');

  if (currentIndex > 0) {
    // Animate out current card
    card.classList.remove('animate-in');
    card.classList.add('animate-out');

    setTimeout(() => {
      card.classList.remove('animate-out');
      card.classList.add('animate-in');
      displayWinner(winners[currentIndex], currentIndex);
      updateCounterDots();
      currentIndex++;
      checkCompletion();
    }, 400);
  } else {
    // First winner is already displayed, advance to next
    currentIndex++;
    if (currentIndex < winners.length) {
      card.classList.remove('animate-in');
      card.classList.add('animate-out');

      setTimeout(() => {
        card.classList.remove('animate-out');
        card.classList.add('animate-in');
        displayWinner(winners[currentIndex], currentIndex);
        updateCounterDots();
        currentIndex++;
        checkCompletion();
      }, 400);
    } else {
      isAnimating = false;
      checkCompletion();
    }
  }
}

function checkCompletion() {
  if (currentIndex >= winners.length) {
    const btn = document.getElementById('next-btn');
    btn.textContent = '¡Sorteo Completo!';
    btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
    btn.style.boxShadow = '0 8px 30px rgba(0, 200, 83, 0.4)';
    btn.style.cursor = 'default';
  }
}

// ---- Confetti System ----
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiAnimating = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
  confettiParticles = [];
  const colors = ['#0055ff', '#00a5a8', '#c8102e', '#ffd700', '#ff1744', '#2979ff', '#00d4d8', '#ffffff'];
  
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1) * 18 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      gravity: 0.25,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    });
  }

  if (!confettiAnimating) {
    confettiAnimating = true;
    animateConfetti();
  }
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.vx *= 0.98;
    p.opacity -= 0.008;

    if (p.opacity <= 0) {
      confettiParticles.splice(i, 1);
      return;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = p.opacity;
    confettiCtx.fillStyle = p.color;

    if (p.shape === 'rect') {
      confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    }

    confettiCtx.restore();
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimating = false;
  }
}

// ---- Particles Background ----
const particlesCanvas = document.getElementById('particles-canvas');
const particlesCtx = particlesCanvas.getContext('2d');
let particles = [];

function resizeParticles() {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
}

function initParticles() {
  particles = [];
  const count = 60;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.7 ? '#00a5a8' : (Math.random() > 0.5 ? '#2979ff' : '#ffffff')
    });
  }
}

function animateParticles() {
  particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += 0.02;

    // Wrap around
    if (p.x < 0) p.x = particlesCanvas.width;
    if (p.x > particlesCanvas.width) p.x = 0;
    if (p.y < 0) p.y = particlesCanvas.height;
    if (p.y > particlesCanvas.height) p.y = 0;

    const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;

    // Glow
    particlesCtx.beginPath();
    const gradient = particlesCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
    gradient.addColorStop(0, p.color.replace(')', `, ${pulseOpacity})`).replace('rgb', 'rgba').replace('#', ''));
    gradient.addColorStop(1, 'transparent');

    // Simple glow with color
    particlesCtx.globalAlpha = pulseOpacity;
    particlesCtx.fillStyle = p.color;
    particlesCtx.beginPath();
    particlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    particlesCtx.fill();

    // Outer glow
    particlesCtx.globalAlpha = pulseOpacity * 0.3;
    particlesCtx.beginPath();
    particlesCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    particlesCtx.fill();

    particlesCtx.globalAlpha = 1;
  });

  // Draw connection lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        particlesCtx.beginPath();
        particlesCtx.strokeStyle = `rgba(41, 121, 255, ${0.08 * (1 - dist / 120)})`;
        particlesCtx.lineWidth = 0.5;
        particlesCtx.moveTo(particles[i].x, particles[i].y);
        particlesCtx.lineTo(particles[j].x, particles[j].y);
        particlesCtx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

// ---- Initialize ----
function init() {
  setDate();
  resizeParticles();
  resizeConfetti();
  initParticles();
  initCounterDots();
  animateParticles();

  // Display first winner
  displayWinner(winners[0], 0);
}

window.addEventListener('resize', () => {
  resizeParticles();
  resizeConfetti();
});

// Start
window.addEventListener('DOMContentLoaded', init);
