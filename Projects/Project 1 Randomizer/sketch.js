// fortunes array
let fortunes = [
  "You will have a great day!",
  "An exciting opportunity is coming your way.",
  "Be patient — good things take time.",
  "A pleasant surprise is waiting for you.",
  "Your hard work will soon pay off.",
  "Happiness is just around the corner.",
  "Sometimes life surprises you in unexpected ways.",
  "The fortune you seek is in another cookie.",
  "Tomorrow, you will forget why you walked into the kitchen.",
  "The next text you get will be slightly disappointing.",
  "Yes, they saw you trip. They just pretended not to.",
  "Beware of people who say “no offense”. Offense is coming",
  "You will soon win an argument in the shower you lost in real life.",
  "Don’t worry, nobody knows what they’re doing either.",
  "Do not take advice from fortune cookies.",
  "Good luck will find you. Bad luck already has your address.",
  "Beware of stairs. They’re always up to something.",
  "You will soon master the art of procrastination. Tomorrow.",
  "You will spend 10 minutes looking for your phone while holding it.",
  "You are destined to be the person who claps first at the wrong time.",
  "You will soon forget where you parked.",
  "The next song you hear will be stuck in your head for days.",
  "Beware: autocorrect is your greatest enemy.",
  "You will soon say “just one more episode.” Lies.",
  "Your future involves forgetting why you opened a tab.",
  "Soon you will successfully parallel park.",
  "Beware: fortune cookies contain trace amounts of sarcasm.",
  "Your Wi-Fi will drop during the most important moment.",
  "Your bed misses you. Return immediately.",
  "Tomorrow you will misplace your keys in a creative new location.",
];

//  fortune being displayed
let currentFortune = "";

// Images
let bagImage, cookieMoving, cookieStatic;

// "bag" = big bag
// "shaking" = bag shaking animation
// "newCookie" = new cookie from bag
// "cookie" = cookie on screen with fortune
// "smallShaking" = small bag shaking
let state = "title";

// Shaking  variables
let shakeCount = 0; // starting shake
let maxShake = 20; // how much shake before stopping
let bagMove = 3; // offset amount for large bag shake
let smallBagMove = 2; // offset amount for small bag shake

// Fortune paper animation variables
let aniProg = 0; //animation progress
let aniSpeed = 0.02;
let aniDone = false; //animation finished?

// Cookie movement variables
let cookieY; // current Y position for moving cookie
let cookieTargetY; // where cookie should stop

// Bag position and sizes
let bagX,
  bagY,
  bagW = 350,
  bagH = 350;
let smallBagX, smallBagY, smallBagW, smallBagH; // small bag

// Tracks if cookie is coming from the small bag or big bag
let fromSmallBag = false;

// Delay between cookie appearing and fortune showing
let cookieDelayMax = 25;

function preload() {
  bagImage = loadImage("bag.png"); // large bag
  cookieMoving = loadImage("cookie_moving.png"); // cookie that moves
  cookieStatic = loadImage("cookie_static.png"); // cookie that stays still
  titleFont = loadFont("FortuneCookieNF.ttf");
  altFont = loadFont("Fortune Cookies.otf");
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(18);

  // Position  big bag to middle
  bagX = width / 2;
  bagY = height / 2;

  //  size and position for the small bag
  smallBagW = bagW * 0.5;
  smallBagH = bagH * 0.5;
  smallBagX = width / 2;
  smallBagY = height - 130;

  pickRandomFortune(); // choose a fortune at start
  resetFortuneAnimation(); // reset paper animation

  cookieY = bagY; // cookie starts inside bag
  cookieTargetY = height / 2 - 80; // final position of cookie
}

function draw() {
  background(255);

  if (state === "title") {
    fill(0);
    textSize(60);
    textFont(titleFont);
    text("Wisdom of the Cookie", width / 2, height / 2 - 150);

    textSize(25);
    textFont(altFont);
    text("Click anywhere to begin!", width / 2, height / 2 - 60);

    textSize(25);
    text(
      "Instructions:\nGrab a cookie from the pile to reveal your fortune.\nClick the small pile to get another one!",
      width / 2,
      height / 2 + 40
    );
  }

  // Big bag screen
  if (state === "bag" || state === "shaking") {
    if (state === "shaking") {
      //  bag shake
      if (shakeCount % 6 === 0) {
        if (bagMove === 3) {
          bagMove = -3;
        } else {
          bagMove = 3;
        }
      }
      shakeCount++;
      // After shaking move to new cookie state
      if (shakeCount > maxShake) {
        state = "newCookie";
        cookieY = bagY; // reset cookie position
        cookieTargetY = height / 2 - 80; // where cookie will stop
        cookieAngle = 0;
        bagMove = 0;
        fromSmallBag = false; // cookie is from big bag
        cookieDelay = 0;
      }
    }

    // Draw the big bag with shake applied
    image(bagImage, bagX + bagMove, bagY, bagW, bagH);

    // Instruction text
    fill(50);
    textSize(25);
    text("Click on the pile to grab a Fortune Cookie!", 300, 80);
  }

  // Cookie emerging animation
  else if (state === "newCookie") {
    // Draw the correct bag
    if (fromSmallBag) {
      image(bagImage, smallBagX, smallBagY, smallBagW, smallBagH);
    } else {
      image(bagImage, bagX, bagY, bagW, bagH);
    }

    // Move cookie downward until it reaches target position
    if (cookieY < cookieTargetY) {
      cookieY += cookieMovingSpeed;
      if (cookieY > cookieTargetY) cookieY = cookieTargetY;
      cookieDelay = 0;
    } else {
      // Once cookie stops, wait a short delay before showing fortune
      if (cookieDelay < cookieDelayMax) {
        cookieDelay++;
      } else {
        state = "cookie"; // switch to cookie screen
        resetFortuneAnimation(); // restart fortune animation
        cookieDelay = 0;
      }
    }

    // Draw the moving cookie
    image(cookieMoving, width / 2, cookieY, 200, 200);
  }

  // stationary cookie  (shows fortune + small bag)
  else if (state === "cookie" || state === "smallShaking") {
    // Draw the static cookie
    image(cookieStatic, width / 2, height / 2 - 80, 200, 200);

    // Draw the fortune paper and text
    if (state === "cookie") fortunePaper();

    // shaking of the small bag
    if (state === "smallShaking") {
      if (shakeCount % 6 === 0) {
        if (smallBagMove === 2) {
          smallBagMove = -2;
        } else {
          smallBagMove = 2;
        }
      }
      shakeCount++;
      // After shaking new cookie
      if (shakeCount > maxShake) {
        state = "newCookie";
        cookieY = height / 2 - 80; // reset cookie Y
        cookieTargetY = height / 2 - 80; // where cookie ends
        fromSmallBag = true; // cookie now from small bag
        pickRandomFortune(); // pick a new fortune
      }
    }

    // Draw the small bag
    image(bagImage, smallBagX + smallBagMove, smallBagY, smallBagW, smallBagH);

    // Instruction text for getting another fortune
    fill(50);
    textSize(25);
    text("Click the pile for another fortune!", 300, 578);
  }
}

// Draw the fortune paper and text
function fortunePaper() {
  // Animate fortune paper sliding down
  if (!aniDone) {
    aniProg += aniSpeed; // progress increases
    if (aniProg >= 1) {
      // stop when it reaches 1
      aniProg = 1;
      aniDone = true;
    }
  }

  // fortune paper move
  let fortuneY =
    height / 2 - 110 + (height / 2 + 65 - (height / 2 - 80)) * aniProg;

  // Paper size based on text
  let paddingX = 20;
  let paddingY = 10;
  let paperWidth = textWidth(currentFortune) - 100;
  let paperHeight = textAscent() + textDescent() + paddingY;

  // Draw white paper rectangle
  fill(255);
  stroke(0);
  rectMode(CENTER);
  rect(width / 2, fortuneY, paperWidth, paperHeight, 5);

  // Draw fortune text
  fill(0);
  noStroke();
  textSize(18);
  textFont("Verdana");
  text(currentFortune, width / 2, fortuneY);
}

//
// Mouse click

function mousePressed() {
  // On title screen → go to bag
  if (state === "title") {
    state = "bag";
  } else if (clickedOnBag()) {
    if (clickedOnBag()) {
      // Clicking the big bag
      if (state === "bag") {
        state = "shaking"; // trigger shake
        shakeCount = 0;
      }
      // Clicking the small bag
      else if (state === "cookie") {
        state = "smallShaking"; // trigger small bag shake
        shakeCount = 0;
      }
    }
  }
}

// Detects if the mouse clicked on bag area
function clickedOnBag() {
  if (state === "bag" || state === "shaking") {
    return (
      mouseX > bagX - bagW / 2 &&
      mouseX < bagX + bagW / 2 &&
      mouseY > bagY - bagH / 2 &&
      mouseY < bagY + bagH / 2
    );
  } else if (state === "cookie" || state === "smallShaking") {
    return (
      mouseX > smallBagX - smallBagW / 2 &&
      mouseX < smallBagX + smallBagW / 2 &&
      mouseY > smallBagY - smallBagH / 2 &&
      mouseY < smallBagY + smallBagH / 2
    );
  }
  return false;
}

// Choose a random fortune
function pickRandomFortune() {
  currentFortune = random(fortunes);
}

// Reset the fortune paper animation
function resetFortuneAnimation() {
  aniProg = 0;
  aniDone = false;
}
