let data;
let url = "MyFood.csv";

function preload() {
  data = loadTable(url, "csv", "header");
}

function setup() {
  createCanvas(900, 600);
  angleMode(DEGREES);
  background(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  noStroke();

  // read string name
  let fN1 = data.getString(0, "Food");
  let fN2 = data.getString(1, "Food");
  let fN3 = data.getString(2, "Food");
  let fN4 = data.getString(3, "Food");
  let fN5 = data.getString(4, "Food");

  //read numbers. use getNum to make strings numers)
  let cN1 = data.getNum(0, "Calories");
  let cN2 = data.getNum(1, "Calories");
  let cN3 = data.getNum(2, "Calories");
  let cN4 = data.getNum(3, "Calories");
  let cN5 = data.getNum(4, "Calories");

  let sN1 = data.getNum(0, "Sugar");
  let sN2 = data.getNum(1, "Sugar");
  let sN3 = data.getNum(2, "Sugar");
  let sN4 = data.getNum(3, "Sugar");
  let sN5 = data.getNum(4, "Sugar");

  let caN1 = data.getNum(0, "Carbs");
  let caN2 = data.getNum(1, "Carbs");
  let caN3 = data.getNum(2, "Carbs");
  let caN4 = data.getNum(3, "Carbs");
  let caN5 = data.getNum(4, "Carbs");

  let soN1 = data.getNum(0, "Sodium");
  let soN2 = data.getNum(1, "Sodium");
  let soN3 = data.getNum(2, "Sodium");
  let soN4 = data.getNum(3, "Sodium");
  let soN5 = data.getNum(4, "Sodium");

  let pN1 = data.getNum(0, "Protein");
  let pN2 = data.getNum(1, "Protein");
  let pN3 = data.getNum(2, "Protein");
  let pN4 = data.getNum(3, "Protein");
  let pN5 = data.getNum(4, "Protein");

  // labels and colors
  let words = [
    "Calories",
    "Sugar in Grams",
    "Carbs in Grams",
    "Sodium in Milligrams",
    "Protein in Grams",
  ];
  let colors = ["#ff9999", "#ffcc99", "#ffff99", "#99ff99", "#99ccff"];

  //values for pies
  let pies = [
    [cN1, sN1, caN1, soN1, pN1],
    [cN2, sN2, caN2, soN2, pN2],
    [cN3, sN3, caN3, soN3, pN3],
    [cN4, sN4, caN4, soN4, pN4],
    [cN5, sN5, caN5, soN5, pN5],
  ];

  // titles for each pie
  let titles = [fN1, fN2, fN3, fN4, fN5];

  // positions of each pue
  let positions = [
    { x: 200, y: 150 },
    { x: 450, y: 150 },
    { x: 700, y: 150 },
    { x: 325, y: 420 },
    { x: 575, y: 420 },
  ];

  //size of pies
  let diameter = 220;

  //draw pies with titles
  for (let i = 0; i < 5; i++) {
    drawPieChartWithTitle(
      positions[i].x,
      positions[i].y,
      diameter,
      pies[i],
      colors,
      titles[i]
    );
  }

  // legend
  drawLegend(70, 550, words, colors);
}

function drawPieChartWithTitle(cx, cy, d, values, colors, title) {
  fill(0);
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text(title, cx, cy - d / 2 - 10);

  // Chart
  let total = values.reduce((a, b) => a + b, 0);
  if (total <= 0) return;

  let startAngle = 0;
  for (let i = 0; i < values.length; i++) {
    let angle = (values[i] / total) * 360;
    fill(colors[i % colors.length]);
    arc(cx, cy, d, d, startAngle, startAngle + angle);
    startAngle += angle;
  }
}

function drawLegend(x, y, labels, colors) {
  textAlign(LEFT, CENTER);
  textSize(14);
  let boxSize = 20;
  let spacing = 160;

  for (let i = 0; i < labels.length; i++) {
    fill(colors[i % colors.length]);
    rect(x + i * spacing, y, boxSize, boxSize);

    fill(0);
    text(labels[i], x + boxSize + 3 + i * spacing, y + boxSize / 2);
  }
}
