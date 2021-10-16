// Patrick 10/2021

var canvas =
  /** @type {HTMLCanvasElement} */ document.getElementById("canvas_1"); // for intellisense VScode
console.log(canvas);
var myContext = canvas.getContext("2d");
console.log(myContext);
var canvas_width = canvas.width;
console.log("canvas_width:", canvas_width);
var canvas_height = canvas.height;
console.log("canvas_height:", canvas_height);
var number_squarre_width = 12;
squarre_width = canvas_width / number_squarre_width;

var animationID = 0;
var autorisedMovement = true;

var Position_X = canvas.width / 2 - squarre_width;
var Position_Y = 0;

var allSquarre = []; // creation of all cases
var compteur = 0;
for (let i = 0; i < 12; i++) {
  for (let j = 0; j < 21; j++) {
    compteur++;
    allSquarre.push([
      i * squarre_width,
      j * squarre_width,
      squarre_width,
      squarre_width,
    ]);
  }
}
console.log("allSquarre:", allSquarre);

var squarreFixedBottom = []; // to initialise a zone at bottom with a line of squarre non visible and 4 points for each squarre
var compteur = 0;
for (let i = 0; i < 12; i++) {
  for (let j = 21; j < 22; j++) {
    compteur++;
    squarreFixedBottom.push([
      i * squarre_width,
      j * squarre_width,
      i * squarre_width,
      j * squarre_width,
      i * squarre_width + squarre_width,
      j * squarre_width,
      i * squarre_width + squarre_width,
      j * squarre_width + squarre_width,
      i * squarre_width,
      j * squarre_width + squarre_width,
    ]);
  }
}
console.log("squarreFixedBottom:", squarreFixedBottom);

class formInMovement {
  constructor(Position_X, Position_Y) {
    var colors = [
      "rgb(0,255,0)",
      "rgb(255,0,0)",
      "rgb(0,0,255)",
      "rgb(255,255,00)",
      "rgb(0,255,255)",
      "rgb(0,0,0)",
    ];
    this.Position_X = Position_X;
    this.Position_Y = Position_Y;
    this.squarres = [];
    this.color = 0;
    this.drawSquarres = function () {
      this.squarres = [
        [
          // need to update this.squarre
          this.Position_X,
          this.Position_Y,
          this.Position_X,
          this.Position_Y,
          this.Position_X + squarre_width,
          this.Position_Y,
          this.Position_X + squarre_width,
          this.Position_Y + squarre_width,
          this.Position_X,
          this.Position_Y + squarre_width,
        ],
      ];
      myContext.beginPath();
      myContext.fillStyle = colors[this.color];
      myContext.lineWidth = "2";
      for (let squarre of this.squarres) {
        myContext.rect(squarre[0], squarre[1], squarre_width, squarre_width);
        myContext.fill();
        myContext.stroke();
        drawPoint(myContext, squarre[2], squarre[3], "rgb(255,0,0)");
        drawPoint(myContext, squarre[4], squarre[5], "rgb(255,0,0)");
        drawPoint(myContext, squarre[6], squarre[7], "rgb(255,0,0)");
        drawPoint(myContext, squarre[8], squarre[9], "rgb(255,0,0)");
      }
    };
  }
}

var form = new formInMovement(Position_X, Position_Y);
drawAllSquarre();
drawsquarreFixedBottom();

function drawAllSquarre() {
  myContext.beginPath();
  myContext.lineWidth = "2";
  myContext.strokeStyle = "black";
  for (let squarre of allSquarre) {
    myContext.rect(squarre[0], squarre[1], squarre_width, squarre_width);
  }
  myContext.stroke();
}

function drawsquarreFixedBottom() {
  myContext.lineWidth = "2";
  myContext.strokeStyle = "blue";
  for (let squarre of squarreFixedBottom) {
    myContext.beginPath();
    myContext.rect(squarre[0], squarre[1], squarre_width, squarre_width);
    myContext.fillStyle ="red";
    myContext.fill();
    myContext.stroke();
    drawPoint(myContext, squarre[2], squarre[3], "rgb(255,255,0)");
    drawPoint(myContext, squarre[4], squarre[5], "rgb(255,255,0)");
    drawPoint(myContext, squarre[6], squarre[7], "rgb(255,255,0)");
    drawPoint(myContext, squarre[8], squarre[9], "rgb(255,255,0)");
    myContext.fillStyle ="green";
  }
}

// function drawLine
function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function drawPoint(ctx, x, y, color) {
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  drawLine(ctx, x - 5, y - 5, x + 5, y + 5);
  drawLine(ctx, x - 5, y + 5, x + 5, y - 5);
  ctx.restore();
}

//function movement
function move(direction) {
  // defaut value direction = "down" is not working  why ???
  if (direction != "right" && direction != "left" && direction != "downquick") {
    direction = "down";
  }
  window.cancelAnimationFrame(animationID); //need to cancel the animation to avoid acceleration if start several times
  myContext.clearRect(0, 0, 300, 525);
  // drawAllSquarre();
  drawLine(myContext, canvas_width / 2, 0, canvas_width / 2, canvas_height);
  drawsquarreFixedBottom()

  if (direction == "down") {
    console.log("move " + direction);
    form.Position_Y += 1;
  } else if (direction == "downquick") {
    form.Position_Y += 100;
    console.log("move " + direction);
  } else if (direction == "left") {
    form.Position_X -= squarre_width;
    console.log("move " + direction);
  } else if (direction == "right") {
    form.Position_X += squarre_width;
    console.log("move " + direction);
  }
  if (form.Position_Y + squarre_width > canvas.height) {
    form.Position_X = canvas.width / 2 - squarre_width;
    form.Position_Y = 0;
  }
  if (form.Position_X < 0) {
    form.Position_X = 0;
  }
  if (form.Position_X + squarre_width > canvas_width) {
    form.Position_X = canvas_width - squarre_width;
  }

  form.drawSquarres();
  // here i must test contact
  if (form.Position_Y % 25 == 0) {
    console.log("form.Position_Y:", form.Position_Y);
    testContact();
  }
  animationID = window.requestAnimationFrame(move);
}

function testContact() {
  for (let squarrefixed of squarreFixedBottom) {
    // console.log('squarrefixed '+squarrefixed)
    for (let squarreInMove of form.squarres) {
      if (
        squarrefixed[2] == squarreInMove[8] &&
        squarrefixed[3] == squarreInMove[9] &&
        squarrefixed[4] == squarreInMove[6] &&
        squarrefixed[5] == squarreInMove[7]
      ) {
        // console.log('squarreInMove[9]:', squarreInMove[9])
        // console.log('squarrefixed[3]:', squarrefixed[3])
        // console.log('squarrefixed[2]:', squarrefixed[2])
        // console.log('squarreInMove[8]:', squarreInMove[8])
        console.log("Contact segment horizontal on stoppe le squarre !!---------------------------------------------------------");
        squarreFixedBottom.push(squarreInMove)
        form.Position_X = canvas.width / 2 - squarre_width;
        form.Position_Y = 0;
      }
    }
  }
}

function start() {
  autorisedMovement = true;
  move();
}

function restart() {
  window.cancelAnimationFrame(animationID);
  autorisedMovement = true;
  form.Position_X = canvas.width / 2 - squarre_width;
  form.Position_Y = 0;
  move();
}

function pause() {
  window.cancelAnimationFrame(animationID);
}

function changeColor() {
  console.log("changeColor");
  if (form.color < 5) {
    form.color += 1;
  } else {
    form.color = 0;
  }
  console.log("formInMovement.color  " + formInMovement.color);
  form.drawSquarres();
}

// event keyboad,  event mouse managed in .html
window.addEventListener("keydown", keyAction);
function keyAction(evt) {
  console.log("touche pressee  :" + evt.code);
  if (evt.code == "ArrowDown") {
    move("downquick");
  }
  if (evt.code == "ArrowRight") {
    move("right");
  }
  if (evt.code == "ArrowLeft") {
    move("left");
  }
  if (evt.code == "ArrowUp") {
    changeColor();
  }
}
