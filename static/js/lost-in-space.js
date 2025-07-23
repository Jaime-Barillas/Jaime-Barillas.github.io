"use strict";

const homepage_container = document.getElementById('homepage');
const homepage_title = document.getElementById('homepage-title');
const homepage_start_msg = document.getElementById('homepage-start-msg');
const homepage_projects_link = document.getElementById('homepage-projects');
const homepage_notes_link = document.getElementById('homepage-excursus');
const canvas = document.getElementById('lost-in-space');
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

  /* Game entity composition:
   * + pos: { x, y }
   * + angle: float */
  asteroids: [],
  player: {
    pos: { x: 0, y: 0 },
    angle: 0
  }
};

/***********************/
/* Homepage animations */
/***********************/
// homepage_container also needs `anim-play` see keydown fn below.
homepage_start_msg.classList.add('a-homepage-start-msg');

/****************/
/* Canvas setup */
/****************/
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

try {
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
} catch (ex) {
  resizeObserver.observe(canvas);
}

function resize(entries) {
  let width = 0;
  let height = 0;

  for (const entry of entries) {
    if (entry.target === canvas) {
      if (entry.devicePixelContentBoxSize) {
        width = entry.devicePixelContentBoxSize[0].inlineSize;
        height = entry.devicePixelContentBoxSize[0].blockSize;
      } else {
        width = entry.contentBoxSize[0].inlineSize * window.devicePixelRatio;
        height = entry.contentBoxSize[0].blockSize * window.devicePixelRatio;
      }
    }
  }

  console.log(`Resizing canvas: (${width}, ${height})`);
  canvas.width = width;
  canvas.height = height;
}

function keydown(ev) {
  if (ev.code == 'Escape' && state.running) {
    state.running = false;
    homepage_title.classList.remove('t-homepage-zoom');
    homepage_start_msg.classList.remove('t-homepage-zoom');
    homepage_projects_link.classList.remove('t-homepage-zoom');
    homepage_notes_link.classList.remove('t-homepage-zoom');
    canvas.classList.remove('t-lost-in-space-zoom');
  }

  if (ev.code == 'KeyZ') {
    state.debugMode = !state.debugMode;
  }

  switch (ev.code) {
    case 'Space':
      if (!state.running) {
        // homepage_container.classList.add('t-play');
        homepage_title.classList.add('t-homepage-zoom');
        homepage_start_msg.classList.add('t-homepage-zoom');
        homepage_projects_link.classList.add('t-homepage-zoom');
        homepage_notes_link.classList.add('t-homepage-zoom');
        canvas.classList.add('t-lost-in-space-zoom');
        state.running = true;
        setup();
        window.requestAnimationFrame(run);
      }
      break;
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

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

/********/
/* Game */
/********/

function setup() {
  state.debugmode = false;
  state.input.left = false;
  state.input.right = false;
  state.input.up = false;
  state.input.down = false;
  state.asteroids = [];

  for (const _ of Array(10)) {
    state.asteroids.push({
      pos: {
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random()
      }
    });
  }

  state.player.pos.x = (canvas.width / 2);
  state.player.pos.y = (canvas.height / 2);
  state.player.angle = 0;
}

function update(timestamp) {
  /*****************/
  /* Handle Inputs */
  /*****************/

  if (state.input.left)  state.player.pos.x -= 1;
  if (state.input.right) state.player.pos.x += 1;
  if (state.input.up)    state.player.pos.y -= 1;
  if (state.input.down)  state.player.pos.y += 1;
}

function draw_model_many(model, entities) {
  ctx.beginPath();
  for (const entity of entities) {
    ctx.moveTo(
      Math.floor(model[0][0] + entity.pos.x),
      Math.floor(model[0][1] + entity.pos.y),
    );
    for (let i = 1; i < model.length; i++) {
      ctx.lineTo(
        Math.floor(model[i][0] + entity.pos.x),
        Math.floor(model[i][1] + entity.pos.y),
      );
    }
    ctx.closePath();
  }
  ctx.stroke();
}

function draw_model(model, entity) {
  ctx.beginPath();
  ctx.moveTo(
    Math.floor(model[0][0] + entity.pos.x),
    Math.floor(model[0][1] + entity.pos.y),
  );
  for (let i = 1; i < model.length; i++) {
    ctx.lineTo(
      Math.floor(model[i][0] + entity.pos.x),
      Math.floor(model[i][1] + entity.pos.y),
    );
  }
  ctx.closePath();
  ctx.stroke();
}

function draw(timestamp) {
  /***************/
  /* Draw Screen */
  /***************/
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

  draw_model_many(state.models.asteroid, state.asteroids);
  draw_model(state.models.player.apple, state.player);
}

function run(timestamp) {
  update(timestamp);
  draw(timestamp);

  state.oldTimestamp = timestamp;
  if (state.running) window.requestAnimationFrame(run);
}
