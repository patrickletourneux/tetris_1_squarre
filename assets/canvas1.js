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
var scoreValue = 0;
var score = document.getElementById("score");
var animationID = 0;
var autorisedMovement = true;

var Position_X = canvas.width / 2 - squarre_width;
var Position_Y = 0;

var yPositionToTest = [
  25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400,
  425, 450, 475, 500,
]; // for function testLineComplete

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
function initSquarreFixedBottom() {
  squarreFixedBottom = [];
  compteur = 0;
  for (let i = 0; i < 12; i++) {
    // good values
    for (let j = 21; j < 22; j++) {
      // good values
      // for (let i = 0; i < 12; i++) {
      //   // debugging value
      //   for (let j = 19; j < 22; j++) {
      //     // debugging value
      if ((j == 20 && i == 11) || (j == 19 && i == 11)) {
      } else {
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
  }
}
// console.log("squarreFixedBottom:", squarreFixedBottom);

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
        drawLine(
          myContext,
          this.Position_X,
          this.Position_Y,
          this.Position_X,
          525
        );
        drawLine(
          myContext,
          this.Position_X + squarre_width,
          this.Position_Y,
          this.Position_X + squarre_width,
          525
        );
      }
    };
  }
}

var form = new formInMovement(Position_X, Position_Y);
initSquarreFixedBottom();
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
  // myContext.clearRect(0, 0, 300, 525);
  myContext.lineWidth = "2";
  myContext.strokeStyle = "blue";
  for (let squarre of squarreFixedBottom) {
    myContext.beginPath();
    myContext.rect(squarre[0], squarre[1], squarre_width, squarre_width);
    myContext.fillStyle = "red";
    myContext.fill();
    myContext.stroke();
    myContext.fillStyle = "green";
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
  // drawLine(myContext, canvas_width / 2, 0, canvas_width / 2, canvas_height);
  drawsquarreFixedBottom();

  if (direction == "down") {
    console.log("move " + direction);
    form.Position_Y += 1;
  } else if (direction == "downquick") {
    // findClosestFixSquaSameY(form.Position_X);
    console.log("move " + direction);
    form.Position_Y =
      Math.min(...findClosestFixSquaSameY(form.Position_X)) - squarre_width; // need to understand this line
    form.drawSquarres();
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
  if (form.Position_Y % 25 == 0) {
    console.log("form.Position_Y:", form.Position_Y);
    testContact();
    testLineComplete();
  }
  animationID = window.requestAnimationFrame(move);
}

function findClosestFixSquaSameY(Xposition) {
  // le premier squarre trouve est forcément le plus pret de la forme en mouvement
  console.log("findClosestFixSquaSameY:----------------------");
  var YsquarreFixSameX = [];
  for (squarreFix of squarreFixedBottom) {
    if (squarreFix[0] == Xposition) {
      YsquarreFixSameX.unshift(squarreFix[1]);
      console.log("squarreFix[1]:", squarreFix[1]);
      console.log("YsquarreFixSameX:", YsquarreFixSameX);
    }
  }
  return YsquarreFixSameX;
}

function testContact() {
  // test contact between form in movement and squarrefixedbottom
  for (let squarrefixed of squarreFixedBottom) {
    // console.log('squarrefixed '+squarrefixed)
    for (let squarreInMove of form.squarres) {
      if (
        squarrefixed[2] == squarreInMove[8] &&
        squarrefixed[3] == squarreInMove[9] &&
        squarrefixed[4] == squarreInMove[6] &&
        squarrefixed[5] == squarreInMove[7]
      ) {
        console.log(
          "Contact segment horizontal on stoppe le squarre !!---------------------------------------------------------"
        );
        if (form.Position_Y == 50) {
          console.log("vous avez PERDU !!!");
          alert("vous avez perdu");
          restart();
          return;
        }
        console.log("squarreInMove:", squarreInMove);
        squarreFixedBottom.push(squarreInMove);
        console.log("squarreFixedBottom:", squarreFixedBottom);
        form.Position_X = canvas.width / 2 - squarre_width;
        form.Position_Y = 0;
        scoreValue += 10;
        score.innerHTML = scoreValue;
      }
    }
  }
}

function testLineComplete() {
  // console.log("testLineComplete:");
  for (yPosition of yPositionToTest) {
    var compteur2 = 0;
    for (let squarrefixed of squarreFixedBottom) {
      if (squarrefixed[1] == yPosition) {
        compteur2 += 1;
      }
    }
    if (compteur2 == 12) {
      console.log(
        "ligne complete yposition " + yPosition + "------------------------"
      );
      destroyLineFixed(yPosition);
      scoreValue += 100;
      score.innerHTML = scoreValue;
      updateSquarreFixedBottom(yPosition);
    }
  }
}

function destroyLineFixed(yOrigineSquarre) {
  var l = 0;
  var tempFixedBottom = [];
  for (let squarreFixed of squarreFixedBottom) {
    if (squarreFixed[1] != yOrigineSquarre) {
      tempFixedBottom.push(squarreFixed);
      console.log("squarreFixed:", squarreFixed);
    }
  }
  squarreFixedBottom = tempFixedBottom;
}

function updateSquarreFixedBottom(yPositionlinedestroyed) {
  // after destroyLineFixed
  for (let squarreFixed of squarreFixedBottom) {
    if (squarreFixed[1] < yPositionlinedestroyed) {
      squarreFixed[1] += squarre_width;
      squarreFixed[3] += squarre_width;
      squarreFixed[5] += squarre_width;
      squarreFixed[7] += squarre_width;
      squarreFixed[9] += squarre_width;
    }
  }
  drawsquarreFixedBottom();
  // alert("end updateSquarreFixedBottom");
}

function start() {
  autorisedMovement = true;
  move();
}

function restart() {
  console.log("restart:");
  window.cancelAnimationFrame(animationID);
  scoreValue = 0;
  myContext.clearRect(0, 0, 300, 525);
  initSquarreFixedBottom();
  drawAllSquarre();
  drawsquarreFixedBottom();
  autorisedMovement = true;
  form.Position_X = canvas.width / 2 - squarre_width;
  form.Position_Y = 0;
  form.drawSquarres();
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
