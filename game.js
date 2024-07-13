const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const state = {
  debugMode: false,

  oldTimestamp: 0,
  models: {
    asteroid: [[-20, -20], [-10, -25], [10, -24], [22, -10],
               [ 18,   0], [ 22,  13], [18,  20], [ 3,  24],
               [-19,  18], [-24,   0]],
    player: []
  },
  asteroids: []
};

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

try {
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
} catch (ex) {
  resizeObserver.observe(canvas);
}

window.addEventListener('keydown', input);
window.addEventListener('load', setup);

function resize(entries) {
  for (const entry of entries) {
    if (entry.target === canvas) {
      if (entry.devicePixelContentBoxSize) {
        canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
        canvas.height = entry.devicePixelContentBoxSize[0].blockSize;
      } else {
        canvas.width = entry.contentBoxSize[0].inlineSize * window.devicePixelRatio;
        canvas.height = entry.contentBoxSize[0].blockSize * window.devicePixelRatio;
      }
    }
  }
}

function input(ev) {
  if (ev.code == 'Escape') {
    state.debugMode = !state.debugMode;
  }
}

function setup(ev) {
  for (const _ of Array(10)) {
    state.asteroids.push([
      canvas.width * Math.random(),
      canvas.height * Math.random(),
      20,
      20
    ]);
  }

  window.requestAnimationFrame(run);
}

function run(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "18px monospace";
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';

  if (state.debugMode) {
    let fps = Math.round(1000 / (timestamp - state.oldTimestamp))
    ctx.fillText(`fps: ${fps}`, 20, 20);
    ctx.fillText(`canvas-width:  ${canvas.width}`, 20, 40);
    ctx.fillText(`canvas-height: ${canvas.height}`, 20, 60);
  }

  for (const asteroid of state.asteroids) {
    ctx.beginPath();
    ctx.moveTo(
      state.models.asteroid[0][0] + asteroid[0],
      state.models.asteroid[0][1] + asteroid[1],
    );
    for (let i = 1; i < state.models.asteroid.length; i++) {
      ctx.lineTo(
        state.models.asteroid[i][0] + asteroid[0],
        state.models.asteroid[i][1] + asteroid[1],
      );
    }
    ctx.closePath()
    ctx.stroke();
  }

  state.oldTimestamp = timestamp;
  window.requestAnimationFrame(run);
}
