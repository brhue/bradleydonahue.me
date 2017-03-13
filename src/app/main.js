const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
const MAX_PARTICLES = 100;

const mouse = {
  x: 0,
  y: 0,
};

function random(min, max) {
  return (Math.random() * (max - min) + min);
}

function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

class Particle {
  constructor() {
    this.x = random(0, c.width);
    this.y = random(0, c.height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.size = random(1, 5);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) {
      this.x = c.width;
    }
    if (this.x > c.width) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = c.height;
    }
    if (this.y > c.height) {
      this.y = 0;
    }
  }
}

function update(particles) {
  particles.forEach((particle) => {
    particle.update();
  });
}

function render(particles) {
  particles.forEach((particle) => {
    particles.forEach((particle2) => {
      const d = distance(particle, particle2)
      if (d < 100) {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
        const d2 = distance(mouse, particle);
        if (d2 < 200) {
          ctx.globalAlpha = (1000 / d2) / 100 ;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.stroke();
        }
      }
    });
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI*2, true);
    ctx.fill();
  });
}

function loop(particles) {
  requestAnimationFrame(loop.bind(null, particles));
  ctx.clearRect(0, 0, c.width, c.height);
  update(particles);
  render(particles);
}

function init() {
  c.width = c.parentElement.clientWidth;
  c.height = c.parentElement.clientHeight;

  const particles = [];

  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(new Particle());
  }

  mouse.x = c.width / 2;
  mouse.y = c.height / 2;
  loop(particles);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('touchstart', (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});

window.addEventListener('resize', (e) => {
  c.width = c.parentElement.clientWidth;
  c.height = c.parentElement.clientHeight;
});

// hack to make everything start after the inital render
setTimeout(init);
