const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const state = {
  debugMode: false,
  running: false,

  oldTimestamp: 0,
  models: {
    asteroid: [[-20, -20], [-10, -25], [10, -24], [22, -10],
               [ 18,   0], [ 22,  13], [18,  20], [ 3,  24],
               [-19,  18], [-24,   0]],
    player: {
      apple: [// Stick
              [ -3, -24], [ -1, -30], [ -1, -39], [  2, -39], [  2, -30], [  0, -24],
              // Body up to right-most point.
              [ 15, -24], [ 24, -15], [ 27,  -1],
              // Body up to middle-most bottom point.
              [ 22,  16], [ 15,  26], [  6,  30], [  0,  28],
              // Body up to left-most point.
              [ -6,  30], [ -15,  26], [-22,  16], [-27,   3],
              // Rest of left body.
              [-25, -15], [-18, -24]]
    }
  },
  input: {
    left:  false,
    right: false,
    up:    false,
    down:  false,
  },
  asteroids: [],
  player: { x: 0, y: 0, angle: 0 }
};

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

try {
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
} catch (ex) {
  resizeObserver.observe(canvas);
}

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

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

  // It may be the case that the window 'load' event is triggered before the
  // browser resizes the canvas to cover the entire window (at least on Vivaldi.)
  // We want the game to start after the 'final' resize event to make sure the
  // inital positions of the asteroids and player are accurately calculated.
  // NOTE: This does rely on the canvas changing size the moment the web page
  // is loaded.
  if (state.running == false) {
    state.running = true;
    setup_and_run();
  }
}

function keydown(ev) {
  if (ev.code == 'Escape') {
    state.debugMode = !state.debugMode;
  }

  switch (ev.code) {
    case 'ArrowLeft':
    case 'KeyA':
      state.input.left = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      state.input.right = true;
      break;
    case 'ArrowUp':
    case 'KeyW':
      state.input.up = true;
      break;
    case 'ArrowDown':
    case 'KeyS':
      state.input.down = true;
      break;
  }
}

function keyup(ev) {
  switch (ev.code) {
    case 'ArrowLeft':
    case 'KeyA':
      state.input.left = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      state.input.right = false;
      break;
    case 'ArrowUp':
    case 'KeyW':
      state.input.up = false;
      break;
    case 'ArrowDown':
    case 'KeyS':
      state.input.down = false;
      break;
  }
}

function setup_and_run() {
  for (const _ of Array(10)) {
    state.asteroids.push([
      canvas.width * Math.random(),
      canvas.height * Math.random(),
      20,
      20
    ]);
  }

  state.player.x = (canvas.width / 2);
  state.player.y = (canvas.height / 2);
  state.player.angle = 0;

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


  ///////////////////////////
  // Draw Screen
  ///////////////////////////
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
    ctx.closePath();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(
    state.models.player.apple[0][0] + state.player.x,
    state.models.player.apple[0][1] + state.player.y,
  );
  for (let i = 1; i < state.models.player.apple.length; i++) {
    ctx.lineTo(
      state.models.player.apple[i][0] + state.player.x,
      state.models.player.apple[i][1] + state.player.y,
    );
  }
  ctx.closePath();
  ctx.stroke();


  ///////////////////////////
  // Handle Inputs
  ///////////////////////////
  if (state.input.left)  state.player.x -= 1;
  if (state.input.right) state.player.x += 1;
  if (state.input.up)    state.player.y -= 1;
  if (state.input.down)  state.player.y += 1;


  state.oldTimestamp = timestamp;
  window.requestAnimationFrame(run);
}
