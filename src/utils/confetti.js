export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6'];
  const particles = [];

  for (let i = 0; i < 130; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 10;
    particles.push({
      x: rect.width / 2,
      y: rect.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: 4 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotSpd: (Math.random() - 0.5) * 14,
      life: 1,
      decay: 0.007 + Math.random() * 0.012
    });
  }

  let frame;
  function draw() {
    ctx.clearRect(0, 0, rect.width, rect.height);
    let alive = false;
    particles.forEach(p => {
      if (p.life > 0) {
        alive = true;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.22; p.vx *= 0.98;
        p.life -= p.decay; p.rot += p.rotSpd;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    if (alive) frame = requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => cancelAnimationFrame(frame), 4500);
}