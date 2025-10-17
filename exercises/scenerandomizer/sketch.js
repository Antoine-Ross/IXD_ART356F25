let space;

let surface1;
let surface2;
let surface3;
let moons1;
let moons2;
let moons3;
let ring1;
let ring2;
let ring3;

let current_surface;
let current_moons;
let current_ring;

function preload() {
  space = loadImage("SPB.jpg");

  surface1 = loadImage("Surface1.png");
  surface2 = loadImage("Surface2.png");
  surface3 = loadImage("surface3.png");
  moons1 = loadImage("Moons1.png");
  moons2 = loadImage("Moons2.png");
  moons3 = loadImage("Moons3.png");
  ring1 = loadImage("Ring1.png");
  ring2 = loadImage("Ring2.png");
  ring3 = loadImage("Ring3.png");

  mainFont = loadFont("FontdinerSwanky-Regular.ttf");
  altFont = loadFont("ZenAntiqueSoft-Regular.ttf");
}

function setup() {
  createCanvas(1550, 650);
}

function draw() {
  // background(space);
  image(space, 0, 0, 650, 650);
  // image(moons2, 15, 15, 150, 150);

  fill("white");
  textSize(70);
  textFont(mainFont);
  text("Planet Randomizer", 730, 70);
  textSize(30);
  textFont(altFont);
  text("Instructions: ", 1000, 180);
  text("Use the Left Arrow, Up Arrow and the Right Arrow ", 730, 230);
  text("keys to randomize the planets surface, rings and moons.", 730, 270);

  // surfaces
  if (current_surface == 1) {
    image(surface1, 150, 150, 350, 350);
  } else if (current_surface == 2) {
    image(surface2, 150, 150, 350, 350);
  } else if (current_surface == 3) {
    image(surface3, 150, 150, 350, 350);
  }

  //rings
  if (current_ring == 1) {
    image(ring1, 43, 290, 570, 50);
  } else if (current_ring == 2) {
    image(ring2, 43, 290, 570, 50);
  } else if (current_ring == 3) {
    image(ring3, 43, 290, 570, 50);
  }

  //moons
  if (current_moons == 1) {
    image(moons1, 15, 15, 150, 150);
  } else if (current_moons == 2) {
    image(moons2, 15, 15, 150, 150);
  } else if (current_moons == 3) {
    image(moons3, 15, 15, 150, 150);
  }

  //controls
  if (keyIsDown(37)) {
    shuffleSurface();
  }
  if (keyIsDown(38)) {
    shuffleRings();
  }
  if (keyIsDown(39)) {
    shuffleMoons();
  }

  //shuffle functions
  function shuffleSurface() {
    current_surface = int(random(1, 4));
  }
  function shuffleRings() {
    current_ring = int(random(1, 4));
  }
  function shuffleMoons() {
    current_moons = int(random(1, 4));
  }
}
