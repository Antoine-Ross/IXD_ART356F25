let table;
let data = [];
let selected = null; // clicked sighting
let shipImg;
let mapImg;
let dotSize = 10;
let pulse = 5; // dot grow/shrink
let clickDist = 40; //distance for a click to count

function preload() {
  table = loadTable("used dataset.csv", "csv", "header");
  shipImg = loadImage("ship.png");
  mapImg = loadImage("Map.jpg");
}

function setup() {
  createCanvas(800, 650);
  for (let r = 0; r < table.getRowCount(); r++) {
    let row = table.getRow(r);
    let rawCity = row.getString("city") || "";
    let cityNorm = rawCity.trim().toLowerCase();

    //single sighting object
    let entry = {
      id: r + 1, // id for animation
      datetime: row.getString("datetime"),
      city: cityNorm,
      shape: row.getString("shape"),
      duration: row.getString("duration (hours/min)"),
      desc: row.getString("comments"),
    };

    //  add only with city and datetime
    if (entry.city && entry.datetime) data.push(entry);
  }

  for (let d of data) {
    if (d.city === "napa") {
      d.x = 420;
      d.y = 205;
    }
    if (d.city === "antioch") {
      d.x = 565;
      d.y = 290;
    }
    if (d.city === "concord") {
      d.x = 500;
      d.y = 300;
    }
    if (d.city === "sacramento") {
      d.x = 670;
      d.y = 120;
    }
    if (d.city === "berkeley") {
      d.x = 430;
      d.y = 335;
    }
    if (d.city === "brentwood") {
      d.x = 605;
      d.y = 315;
    }
    if (d.city === "burlingame") {
      d.x = 400;
      d.y = 410;
    }
    if (d.city === "san jose") {
      d.x = 543;
      d.y = 490;
    }
    if (d.city === "cupertino") {
      d.x = 505;
      d.y = 495;
    }
    if (d.city === "discovery bay") {
      d.x = 630;
      d.y = 320;
    }
    if (d.city === "dublin") {
      d.x = 540;
      d.y = 380;
    }
    if (d.city === "elk grove") {
      d.x = 690;
      d.y = 165;
    }
    if (d.city === "fremont") {
      d.x = 515;
      d.y = 425;
    }
    if (d.city === "half moon bay") {
      d.x = 380;
      d.y = 455;
    }
    if (d.city === "hayward") {
      d.x = 488;
      d.y = 390;
    }
    if (d.city === "iselton") {
      d.x = 620;
      d.y = 250;
    }
    if (d.city === "livermore") {
      d.x = 585;
      d.y = 385;
    }
    if (d.city === "palo alto") {
      d.x = 465;
      d.y = 460;
    }
    if (d.city === "san francisco") {
      d.x = 380;
      d.y = 370;
    }
    if (d.city === "san rafael") {
      d.x = 355;
      d.y = 300;
    }
    if (d.city === "stockton") {
      d.x = 723;
      d.y = 305;
    }
    if (d.city === "suisun city (fairfield)") {
      d.x = 503;
      d.y = 220;
    }
    if (d.city === "tracy") {
      d.x = 685;
      d.y = 370;
    }
    if (d.city === "vallejo") {
      d.x = 440;
      d.y = 260;
    }
  }
}

function draw() {
  push(); // save drawing settings
  // imageMode(CORNER); // draw map aligned to top-left corner
  image(mapImg, 0, 0, width, height); // draw full map background
  pop(); //  previous settings

  // dots pulse (changing their radius with time)
  let t = millis() * 0.005;
  for (let d of data) {
    // calculate dot radius based on sine wave for smooth pulse
    let r = dotSize + pulse * (0.5 + 0.5 * sin(t + d.id));

    //outer glowing circle
    noStroke();
    fill(0, 255, 120, 40); // translucent green
    circle(d.x, d.y, r * 3.5);

    // solid inner circle
    fill(0, 255, 120);
    circle(d.x, d.y, r * 1.3);
  }

  // if dot is selected/clicked
  if (selected) {
    push();
    imageMode(CENTER);
    //  ship above current dot
    image(shipImg, selected.x, selected.y - 50, 90, 90);
    pop();

    // info box above UFO
    drawInfo(selected, selected.x, selected.y - 80);
  }
}

function mousePressed() {
  // dot closest to click
  selected = getNearest(mouseX, mouseY, clickDist);
}

// find closest dot to click position
function getNearest(mx, my, distMax) {
  let closest = null;
  let best = distMax;

  for (let d of data) {
    // distance from mouse to dot
    let dd = dist(mx, my, d.x, d.y);

    // if closer than current
    if (dd <= best) {
      best = dd;
      closest = d;
    }
  }
  return closest;
}
// infobox
function drawInfo(d, px, py) {
  let pad = 10; // padding box edge and text
  let bx = px + 40; // x position
  let by = py - 120; // y above UFO
  let boxH = 165;
  let boxW = 310;

  // reposition
  if (bx + boxW > width - 10) bx = px - boxW - 30; // move left if near right edge
  if (by < 12) by = py + 20; // move below if near top edge

  // rectangle with rounded corners
  noStroke();
  fill(20, 20, 20, 230);
  rect(bx, by, boxW, boxH, 10);

  //  green border
  stroke(0, 255, 160);
  noFill();
  rect(bx, by, boxW, boxH, 10);

  // green city name
  noStroke();
  fill(0, 255, 160);
  textSize(15);
  textAlign(LEFT, TOP);

  //lowercase tu upper
  let titleCity = d.city
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  text(titleCity, bx + pad, by + pad);

  // sighting details
  fill(220);
  textSize(13);
  let ty = by + pad + 20; // y for first line of text

  // print individual details
  text(`Date/Time: ${d.datetime}`, bx + pad, ty);
  ty += 18;
  text(`Shape: ${d.shape}`, bx + pad, ty);
  ty += 18;
  text(`Duration: ${d.duration}`, bx + pad, ty);
  ty += 18;
  ty += 6;
  text("Description:", bx + pad, ty);
  ty += 18;

  //  text wrapped description
  text(d.desc, bx + pad, ty, boxW - pad * 2);
}
