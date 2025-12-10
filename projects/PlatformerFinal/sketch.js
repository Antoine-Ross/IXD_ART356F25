let player1;
let player1Touch;

let idleSheet;
let runSheet;
let jumpSheet;

// full size
let keyImg;
// 10 x 10
let keySmall;

let heartImg;
let heartSmall;

let arrowImg;
let arrowSmall;

let heartPickupSnd;
let collectPickupSnd;
let jumpBoostSnd;
let lifeLostSnd;

let collectablesCount = 0;
let collectablesNeeded = 5;

let level = [
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "   ",
  "f                                                                                                                              f",
  "f bb          bbbb          bbbb           bb          bbbb          bbbb           bb          bbbb          bbbb             f",
  "f                                                                                                                              f",
  "f           bb       bb       bb       bb             bb       bb       bb       bb             bb       bb       bb    h   bb f",
  "f      b                                         b                                         b                            c      f",
  "f   p    p        p        p        p         p    p        p        p        p         p    p        p        p        p      f",
  "f                                                      c                                                                       f",
  "f  b          bbbb          bbbb           bb          bbbb          bbbb           bb          bbbb          bbbb             f",
  "f                                                                               j                                              f",
  "f       pp             b            pp            pp             b            pp            pp             b            pp     f",
  "f            c                                                                                                              j  f",
  "f    p       b     j  p        b        p     p        b        p        b        p     p        b        p        b        p  f",
  "f                                                                                                                              f",
  "f       b        p                 p              b        p        p        p              b        p        p        p       f",
  "f           h                                                                     c             h                              f",
  "f           bb       bb       bb       bb             bb      jbb       bb       bb             bb       bb       bb       bb  f",
  "f j    b                                         b                                         b                                   f",
  "f   p    p        p        p        p        jp    p        p        p        p         p    p        p        p        p      f",
  "f                                                                                    j                                         f",
  "f bb          bbbb          bbbb           bb          bbbb          bbbb           bb          bbbb          bbbb             f",
  "f                                      h                                                                                       f",
  "f           bb       bb          bb    bb             bb       bb       bb       bb             bb       bb       bb       bb  f",
  "f      b                                         b          j                              b                            j      f",
  "f   p    p        p       jp        p         p    p        p        p        p         p    p        p        p        p      f",
  "f                                           c                                                                                  f",
  "f bb          bbbb          bbbb           bb          bbbb          bbbb           bb          bbbb          bbbb             f",
  "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
];

let gameState = "start";

function preload() {
  idleSheet = loadImage("idle_10x14.png");
  runSheet = loadImage("run_10x14_sheet.png");
  jumpSheet = loadImage("jump_10x14_sheet.png");
  keyImg = loadImage("key.png");
  heartImg = loadImage("heart.png");
  arrowImg = loadImage("arrow-up.png");

  heartPickupSnd = loadSound("cartoon-jump-6462.mp3");
  collectPickupSnd = loadSound(
    "soft-treble-fast-collect-fade-out-ending-sound-effect-416828.mp3"
  );
  jumpBoostSnd = loadSound("arrow-twang_01-306041.mp3");
  lifeLostSnd = loadSound("punch-431475.mp3");
}

function setup() {
  new Canvas(600, 300, "pixelated");
  // gravity strength
  world.gravity.y = 10;

  // createGraphics = fix for layering
  keySmall = createGraphics(10, 10);
  keySmall.image(keyImg, 0, 0, 10, 10);

  heartSmall = createGraphics(10, 10);
  heartSmall.image(heartImg, 0, 0, 10, 10);

  growthSmall = createGraphics(10, 10);
  growthSmall.image(arrowImg, 0, 0, 10, 10);

  // solid blocks
  blocks = new Group();
  blocks.tile = "b";
  //  don't move when touched
  blocks.collider = "static";
  blocks.w = 15;
  blocks.h = 8;

  // moving platforms
  platforms = new Group();
  platforms.tile = "p";
  platforms.collider = "kinematic";
  platforms.h = 8;
  platforms.w = 19;

  //  floor blocks
  floor = new Group();
  floor.tile = "f";
  floor.collider = "static";
  floor.h = 12;
  floor.w = 5;
  floor.rotation = 40;

  // key collectables
  collectables = new Group();
  collectables.tile = "c";
  // player can pass through
  collectables.collider = "none";
  collectables.w = 10;
  collectables.h = 10;
  collectables.img = keySmall;

  // hearts pickups
  lifePickups = new Group();
  lifePickups.tile = "h";
  lifePickups.collider = "none";
  lifePickups.w = 10;
  lifePickups.h = 10;
  lifePickups.img = heartSmall;

  // jump pickups
  jumpPickups = new Group();
  jumpPickups.tile = "j";
  jumpPickups.collider = "none";
  jumpPickups.w = 10;
  jumpPickups.h = 10;
  jumpPickups.img = growthSmall;

  createGameObjects();
  //control draw order
  allSprites.autoDraw = false;
}

function createGameObjects() {
  player1 = new Sprite(40, 480);
  player1.w = 10;
  player1.h = 14;
  player1.rotationLock = true;
  // No friction = movement only from input
  player1.friction = 0;
  player1.lives = 4;

  player1.addAni("idle", idleSheet, { frameSize: [10, 14], frames: 1 });
  player1.addAni("run", runSheet, { frameSize: [10, 14], frames: 10 });
  player1.addAni("jump", jumpSheet, { frameSize: [10, 14], frames: 6 });

  //touch makes sure player is on block before being able to jump
  player1Touch = new Sprite();
  player1Touch.x = player1.x;
  player1Touch.y = player1.y + player1.h / 2;
  player1Touch.w = 12;
  player1Touch.h = 6;
  player1Touch.collider = "none";
  player1Touch.visible = false;

  // GlueJoint attaches to the player
  new GlueJoint(player1, player1Touch);

  new Tiles(level, 0, 0, 16, 16, collectables, lifePickups, jumpPickups);

  //  platform movement range
  for (let p of platforms) {
    p.up = p.y - 20;
    p.down = p.y + 20;
    p.vel.y = 0.8;
  }
}

function resetGame() {
  player1.x = 20;
  player1.y = 480;
  player1.vel.x = 0;
  player1.vel.y = 0;
  player1.lives = 4;
  collectablesCount = 0;

  camera.x = 100;
  camera.y = 100;
  gameState = "start";
}

function draw() {
  // purple background
  background(69, 32, 104);

  // platform movement
  for (let p of platforms) {
    //  reverse velocity when low
    if (p.y > p.down) p.vel.y *= -1;
    // reverse velocity when high
    if (p.y < p.up) p.vel.y *= -1;

    // stops bouncing on moving platforms
    if (gameState === "play" && player1Touch.overlapping(p) && p.vel.y < 0) {
      player1.y += p.vel.y;
    }
  }

  if (gameState === "play") runGameplay();
  else camera.x = camera.y = 100;

  camera.on();
  allSprites.draw();
  camera.off();

  if (gameState === "start") drawStartScreen();
  else if (gameState === "play") drawHUD();
  else if (gameState === "gameover") drawGameOverScreen();
  else if (gameState === "win") drawWinScreen();
}

function runGameplay() {
  let onGround =
    player1Touch.overlapping(blocks) || player1Touch.overlapping(platforms);

  // Jump only if on ground up pressed
  if (onGround && kb.presses("up")) {
    player1.vel.y = -4;
  }

  if (kb.pressing("left")) {
    player1.vel.x = -1.5;
    // flip to face left
    player1.mirror.x = true;
  } else if (kb.pressing("right")) {
    player1.vel.x = 1.5;
    // flip to face right
    player1.mirror.x = false;
  } else {
    player1.vel.x = 0;
  }

  if (!onGround) player1.ani = "jump";
  else if (kb.pressing("left") || kb.pressing("right")) player1.ani = "run";
  else player1.ani = "idle";

  if (player1.overlaps(floor) || player1.y > 2000 || player1.x < -25) {
    if (lifeLostSnd && lifeLostSnd.isLoaded()) lifeLostSnd.play();

    player1.lives--;

    if (player1.lives <= 0) {
      gameState = "gameover";
    } else {
      player1.x = 45;
      player1.y = 480;
      player1.vel.x = 0;
      player1.vel.y = 0;
    }
  }

  for (let c of collectables) {
    if (player1.overlaps(c)) {
      c.remove();
      collectablesCount++;

      if (collectPickupSnd && collectPickupSnd.isLoaded())
        collectPickupSnd.play();

      if (collectablesCount >= collectablesNeeded) {
        gameState = "win";
      }
    }
  }

  for (let h of lifePickups) {
    if (player1.overlaps(h)) {
      h.remove();
      player1.lives++;

      if (heartPickupSnd && heartPickupSnd.isLoaded()) heartPickupSnd.play();
    }
  }

  for (let j of jumpPickups) {
    if (player1.overlaps(j)) {
      j.remove();
      player1.vel.y = -8.5;

      if (jumpBoostSnd && jumpBoostSnd.isLoaded()) jumpBoostSnd.play();
    }
  }

  // camera follows stays in level
  camera.x = constrain(player1.x, 150, 4800);
  camera.y = constrain(player1.y, 150, 1800);
}

function drawStartScreen() {
  fill(0, 150);
  rect(0, 0, width, height);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);
  text("Neon Leap", width / 2, height / 2 - 20);

  textSize(12);
  fill(255);
  text("Use Either WASD or The Arrow Keys To Move", width / 2, height / 2 + 10);

  textSize(12);
  fill(255);
  text(
    "You Must collect all 5 Keys Scattered Across The Level To Win",
    width / 2,
    height / 2 + 40
  );

  textSize(12);
  fill(255);
  text("Press SPACE to Begin", width / 2, height / 2 + 70);
  if (kb.presses("space")) gameState = "play";
}

function drawHUD() {
  textSize(14);
  fill("red");

  for (let i = 0; i < player1.lives; i++) {
    text("❤️", 10 + i * 14, 20);
  }

  fill("green");
  textSize(14);
  text("Keys Found: " + collectablesCount + "/" + collectablesNeeded, 60, 40);
}

function drawGameOverScreen() {
  fill(0, 180);
  rect(0, 0, width, height);
  textAlign(CENTER, CENTER);

  textSize(24);
  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 2 - 20);

  textSize(12);
  fill(255);
  text("Press R to Restart", width / 2, height / 2 + 10);

  if (kb.presses("r")) resetGame();
}

function drawWinScreen() {
  fill(0, 180);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);

  textSize(24);
  fill(0, 255, 0);
  text("YOU WIN!", width / 2, height / 2 - 20);

  textSize(12);
  fill(255);
  text("Press R to Restart", width / 2, height / 2 + 10);

  if (kb.presses("r")) resetGame();
}
