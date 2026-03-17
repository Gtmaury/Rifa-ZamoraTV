/* ============================================
   TV ZAMORA - SORTEO SCRIPT
   Lógica de sorteo, animaciones y efectos
   ============================================ */

// Winners data
const winners = [
  // The 13 tablet winners first
  { name: 'Lucía Fernández', ci: 'V-20.331.002', city: 'Guasipati', prize: 'Tablet TCL' },
  { name: 'Ana Martínez', ci: 'V-22.112.334', city: 'Tumeremo', prize: 'Tablet TCL' },
  { name: 'Pedro Sánchez', ci: 'V-15.678.901', city: 'Santa Elena', prize: 'Tablet TCL' },
  { name: 'Laura Gómez', ci: 'V-25.432.198', city: 'Ciudad Bolivar', prize: 'Tablet TCL' },
  { name: 'Kevin Díaz', ci: 'V-21.876.543', city: 'Soledad', prize: 'Tablet TCL' },
  { name: 'Sofía Romero', ci: 'V-26.554.332', city: 'Core 8', prize: 'Tablet TCL' },
  { name: 'Diego Torres', ci: 'V-19.223.445', city: 'Caicara del Orinoco', prize: 'Tablet TCL' },
  { name: 'Valentina Silva', ci: 'V-24.667.889', city: 'Santa Barbara de Barinas', prize: 'Tablet TCL' },
  { name: 'Andrés López', ci: 'V-17.555.666', city: 'Puerto Ordaz', prize: 'Tablet TCL' },
  { name: 'Isabella Castro', ci: 'V-28.999.000', city: 'San Felix', prize: 'Tablet TCL' },
  { name: 'Mateo Herrera', ci: 'V-20.444.555', city: 'Upata', prize: 'Tablet TCL' },
  { name: 'Camila Ruiz', ci: 'V-23.887.665', city: 'Santa Elena', prize: 'Tablet TCL' },
  { name: 'Javier Morales', ci: 'V-16.333.222', city: 'Ciudad Bolivar', prize: 'Tablet TCL' },
  // Finally, the 3 trip winners
  { name: 'María González', ci: 'V-18.456.789', city: 'Puerto Ordaz', prize: 'Viaje a Margarita' },
  { name: 'Carlos Mendoza', ci: 'V-22.789.012', city: 'San Felix', prize: 'Viaje a Margarita' },
  { name: 'Luis Pérez', ci: 'V-14.567.890', city: 'Upata', prize: 'Viaje a Margarita' }
];

let currentIndex = 0;
let isAnimating = false;
let revealedWinners = [];

// ---- LocalStorage Persistence ----
const STORAGE_KEY = 'tvzamora_sorteo_progress';

function saveProgress() {
  const data = {
    currentIndex: currentIndex,
    revealed: revealedWinners,
    started: true
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) { /* ignore */ }
  return null;
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

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
  const dateStr = `${day} de ${month}, ${year}`;
  const dateEl = document.getElementById('date-display');
  const coverDateEl = document.getElementById('cover-date');
  if (dateEl) dateEl.textContent = dateStr;
  if (coverDateEl) coverDateEl.textContent = dateStr;
}

// ---- Cover / Portada ----
function startRaffle() {
  const cover = document.getElementById('cover-screen');
  const main = document.getElementById('main-container');

  // Animate cover out
  cover.classList.add('cover-exit');

  setTimeout(() => {
    cover.classList.add('hidden');
    main.classList.remove('hidden');
    main.classList.add('fade-in');

    // Show spinner for first winner
    showSpinner();
    setTimeout(() => {
      revealWinner(winners[0], 0);
    }, 1800);
  }, 600);
}

function resumeRaffle(savedData) {
  const cover = document.getElementById('cover-screen');
  const main = document.getElementById('main-container');

  cover.classList.add('hidden');
  main.classList.remove('hidden');

  currentIndex = savedData.currentIndex;
  revealedWinners = savedData.revealed || [];

  if (currentIndex >= winners.length) {
    // All winners were already shown — show the last one and the list
    const lastIdx = winners.length - 1;
    revealWinnerInstant(winners[lastIdx], lastIdx);
    checkCompletion();
  } else {
    // Show the current winner instantly (no animation)
    revealWinnerInstant(winners[currentIndex], currentIndex);

    if (currentIndex >= winners.length - 1) {
      checkCompletion();
    }
  }
}

// ---- Spinner ----
function showSpinner() {
  const spinnerEl = document.getElementById('spinner-container');
  const winnerInfoEl = document.getElementById('winner-info');
  spinnerEl.style.display = 'flex';
  winnerInfoEl.style.display = 'none';
}

// ---- Reveal Winner (after spinner, with animations) ----
function revealWinner(winner, index) {
  const spinnerEl = document.getElementById('spinner-container');
  const winnerInfoEl = document.getElementById('winner-info');
  const nameEl = document.getElementById('winner-name');
  const ciEl = document.getElementById('winner-ci');
  const prizeEl = document.getElementById('prize-text');
  const badgeNum = document.getElementById('sorteo-number');

  badgeNum.textContent = index + 1;

  // Set page background based on prize type
  document.body.classList.remove('bg-viaje', 'bg-tablet');
  if (winner.prize.toLowerCase().includes('viaje')) {
    document.body.classList.add('bg-viaje');
  } else {
    document.body.classList.add('bg-tablet');
  }

  // Hide spinner, show winner info
  spinnerEl.style.display = 'none';
  winnerInfoEl.style.display = 'block';

  // Set winner data
  nameEl.textContent = winner.name;
  nameEl.setAttribute('data-name', winner.name);
  ciEl.textContent = `CI: ${winner.ci} | ${winner.city}`;
  prizeEl.textContent = winner.prize;

  // Reset and trigger animations
  ciEl.style.animation = 'none';
  nameEl.style.animation = 'none';
  document.getElementById('prize-badge').style.animation = 'none';
  void ciEl.offsetWidth;

  ciEl.style.animation = 'fadeSlideUp 0.5s ease forwards';
  nameEl.style.animation = 'nameReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
  document.getElementById('prize-badge').style.animation = 'prizePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards';

  // Launch confetti
  launchConfetti();

  // Track revealed winner
  if (!revealedWinners.includes(index)) {
    revealedWinners.push(index);
  }
  saveProgress();

  // Allow next click
  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

// ---- Reveal Winner Instantly (for resume, no animations) ----
function revealWinnerInstant(winner, index) {
  const spinnerEl = document.getElementById('spinner-container');
  const winnerInfoEl = document.getElementById('winner-info');
  const nameEl = document.getElementById('winner-name');
  const ciEl = document.getElementById('winner-ci');
  const prizeEl = document.getElementById('prize-text');
  const badgeNum = document.getElementById('sorteo-number');

  badgeNum.textContent = index + 1;

  // Set page background based on prize type
  document.body.classList.remove('bg-viaje', 'bg-tablet');
  if (winner.prize.toLowerCase().includes('viaje')) {
    document.body.classList.add('bg-viaje');
  } else {
    document.body.classList.add('bg-tablet');
  }

  spinnerEl.style.display = 'none';
  winnerInfoEl.style.display = 'block';

  nameEl.textContent = winner.name;
  nameEl.setAttribute('data-name', winner.name);
  ciEl.textContent = `CI: ${winner.ci} | ${winner.city}`;
  prizeEl.textContent = winner.prize;

  // Show immediately without animations
  ciEl.style.animation = 'none';
  ciEl.style.opacity = '1';
  nameEl.style.animation = 'none';
  nameEl.style.opacity = '1';
  document.getElementById('prize-badge').style.animation = 'none';
  document.getElementById('prize-badge').style.opacity = '1';
}

// ---- Next Sorteo ----
function nextSorteo() {
  if (isAnimating) return;

  // If all winners have been shown, show the list
  if (currentIndex >= winners.length - 1 && revealedWinners.length >= winners.length) {
    showWinnersList();
    return;
  }

  isAnimating = true;
  currentIndex++;

  if (currentIndex >= winners.length) {
    isAnimating = false;
    showWinnersList();
    return;
  }

  const card = document.getElementById('winner-card');

  // Animate out current card
  card.classList.remove('animate-in');
  card.classList.add('animate-out');

  setTimeout(() => {
    card.classList.remove('animate-out');
    card.classList.add('animate-in');

    // Show spinner
    showSpinner();

    // After spinner animation, reveal winner
    setTimeout(() => {
      revealWinner(winners[currentIndex], currentIndex);

      if (currentIndex >= winners.length - 1) {
        checkCompletion();
      }
    }, 1800);
  }, 400);
}

function checkCompletion() {
  const btn = document.getElementById('next-btn');
  btn.textContent = 'Ver Todos los Ganadores';
  btn.style.background = 'linear-gradient(135deg, #ffd700, #ffab00)';
  btn.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.4)';
  btn.style.color = '#0a1a3f';
}

// ---- Winners List ----
// ---- Winners List ----
function showWinnersList() {
  const listContainer = document.getElementById('winners-list-container');
  const listEl = document.getElementById('winners-list');
  const btn = document.getElementById('next-btn');
  const winnerCardWrapper = document.querySelector('.winner-card-wrapper');
  const sorteoBadge = document.getElementById('sorteo-badge');

  btn.style.display = 'none';

  // Hide the individual winner card and badge so they don't repeat on the final screen
  if (winnerCardWrapper) winnerCardWrapper.style.display = 'none';
  if (sorteoBadge) sorteoBadge.style.display = 'none';

  // HIDE SVG DECORATIONS during the final winners list
  document.body.classList.remove('bg-viaje', 'bg-tablet');
  // keep header logo big
  document.querySelector('.header').classList.add('header-final-list');

  listContainer.classList.remove('hidden');
  listEl.innerHTML = '';

  // Activate Flexbox side-by-side layout on main container
  document.querySelector('.main-container').classList.add('final-layout-active');

  // Reorder for the final list: Trips first (indices 13, 14, 15), then Tablets (0 to 12)
  const orderedForList = [
    winners[13], winners[14], winners[15],
    ...winners.slice(0, 13)
  ];

  /* 
    DOM rendering loop.
    No timeouts needed because CSS Flexbox evaluates layout sizes 
    accurately in a single pass without overlapping grids.
  */
  orderedForList.forEach((w, i) => {
    const item = document.createElement('div');
    item.className = 'winners-list-item';
    item.style.animationDelay = `${i * 0.05}s`;
    
    item.innerHTML = `
      <div class="wl-number">${i + 1}</div>
      <div class="wl-info">
        <div class="wl-name">${w.name}</div>
        <div class="wl-details">${w.ci} | ${w.city}</div>
      </div>
      <div class="wl-prize">
        <span class="wl-prize-icon">🏆</span>
        ${w.prize}
      </div>
    `;
    listEl.appendChild(item);
  });

  // Save that sorteo is complete
  saveProgress();

  // Final confetti
  setTimeout(() => launchConfetti(), 300);
  setInterval(triggerConfettiBurst, 3000);
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
  const colors = ['#0055ff', '#00a5a8', '#c8102e', '#ffd700', '#ff1744', '#2979ff', '#00d4d8', '#ffffff'];

  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 1) * 20 - 5,
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
      color: Math.random() > 0.7 ? '#0055ff' : (Math.random() > 0.5 ? '#0a1a3f' : '#00a5a8')
    });
  }
}

function animateParticles() {
  particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += 0.02;

    if (p.x < 0) p.x = particlesCanvas.width;
    if (p.x > particlesCanvas.width) p.x = 0;
    if (p.y < 0) p.y = particlesCanvas.height;
    if (p.y > particlesCanvas.height) p.y = 0;

    const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;

    particlesCtx.globalAlpha = pulseOpacity;
    particlesCtx.fillStyle = p.color;
    particlesCtx.beginPath();
    particlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    particlesCtx.fill();

    particlesCtx.globalAlpha = pulseOpacity * 0.3;
    particlesCtx.beginPath();
    particlesCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    particlesCtx.fill();

    particlesCtx.globalAlpha = 1;
  });

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
  animateParticles();

  // Check for saved progress
  const saved = loadProgress();
  if (saved && saved.started) {
    resumeRaffle(saved);
  }
  // Otherwise the cover screen is shown by default
}

window.addEventListener('resize', () => {
  resizeParticles();
  resizeConfetti();
});

window.addEventListener('DOMContentLoaded', init);
