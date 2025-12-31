const gift = document.getElementById("gift");
const message = document.getElementById("message");
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let opened = false;
let particles = [];

/* ---- SOUND (generated, non-copyright) ---- */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playChime() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(900, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}

/* ---- CLICK ---- */
gift.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  if (audioCtx.state === "suspended") audioCtx.resume();
  playChime();

  gift.classList.add("open");

  setTimeout(() => {
    gift.style.display = "none";
    message.classList.add("show");
    startFireworks();
  }, 1400);
});

/* ---- FIREWORKS ---- */
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.8) * 8;
    this.alpha = 1;
    this.color = color;
  }
  update() {
    this.vy += 0.05;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function explode() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.4;
  const color = `hsl(${Math.random() * 360},100%,60%)`;

  for (let i = 0; i < 70; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
}

function startFireworks() {
  animate();
  setInterval(explode, 700);
}
