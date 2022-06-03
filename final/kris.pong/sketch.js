let player1Score = 0
let player2Score = 0
let ball
let player1, player2
let gameState = "start"
let servingPlayer = 1
let winningPlayer
let ponghit, pongbounce, pongscore
let bgImage

function preload() {
  fontRetro = loadFont("font.ttf")
  ponghit = loadSound("ponghit.wav")
  pongbounce = loadSound("pongbounce.wav")
  pongscore = loadSound("pongscore.wav")
  bgImage = loadImage("pongtable.png")
}

function setup() {
  createCanvas(800, 500)
  ball = new Ball()
  
  player1 = new Paddle("left")
  player2 = new Paddle("right")
}

function draw() {
  image(bgImage, 0, 0, width, height)
  dashedLine(25)
  title()
  score()
  
  ball.display()
  
  if (gameState == "serve") {
    if (servingPlayer == 1) {
      ball.dx = random(4, 6)
    }
    else {
      ball.dx = random(-6, -4)
    }
  }
  else if (gameState == "play") {
    ball.move()
    
    if (ball.collides(player1)) {
      ball.x = player1.x + 10
      ponghit.play()
    }
    
    if (ball.collides(player2)) {
      ball.x = player2.x - 10
      ponghit.play()
    }
    
    if (ball.y < 0 || ball.y > height) {
      ball.dy = -ball.dy
      pongbounce.play()
    }
    
    if (ball.x > width) {
      servingPlayer = 2
      pongscore.play()
      player1Score++
      
      if (player1Score == 10) {
        winningPlayer = 1
        gameState = "done"
      }
      else if (player2Score == 10) {
        winningPlayer = 2
        gameState = "done"
      }
      else {
        gameState = "serve"
        ball.reset()
      }
    }
    
    if (ball.x < 0) {
      servingPlayer = 1
      pongscore.play()
      ball.reset()
      player2Score++
      gameState = "serve"
      
      if (player2Score == 10) {
        winningPlayer = 2
        gameState = "done"
      }
      else {
        gameState = "serve";
      }
    }
  }
  
  player1.display();
  player2.display();
  player1.move();
  player2.move();

}

function score() {
  fill(180);
  noStroke();
  textAlign(CENTER);
  textSize(60);
  textFont(fontRetro);
  text(player1Score, width / 4, 80);
  text(player2Score, 3*width / 4, 80);
}

function keyPressed() {
  if (keyCode == ENTER || keyCode == RETURN) {
    if (gameState == "start") {
      gameState = "serve";
    }
    else if (gameState == "serve") {
      gameState = "play";
    }
    else if (gameState == "done") {
      gameState = "serve";
      player1Score = 0;
      player2Score = 0;
      ball.reset();
      servingPlayer = winningPlayer == 1 ? 2 : 1;
    }
  }
}

function title() {
  fill(255);
  noStroke();
  textSize(18);
  textFont(fontRetro);
  
  if (gameState == "start") {
    text("Press Enter to Begin", width / 2, 35);
  }
  else if (gameState == "serve") {
    textSize(36);
    text("Player " + servingPlayer + " Serves", width / 2, 35);
    textSize(18);
    text("Press Enter to Restart", width / 2, 60);
  }
  else if (gameState == "done") {
    textSize (36);
    text("Player " + winningPlayer + " Wins!", width / 2, 35);
    textSize(18);
    text("Press Enter to Restart", width / 2, 60);
  }
}

function dashedLine(pixels) {
  stroke(180);
  strokeWeight(2);
  let center = width / 2;
  for (let i = 0; i < height / pixels; i++) {
    line(center, i * pixels + 5, center, i * pixels + 15);
  }
}

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.dx = random(2) < 1 ? 5 : -5;
    this.dy = random(-3, 3);
    this.w = 10;
    this.h = 10;
  }
  
  display() {
    rectMode(CENTER);
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
  
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
  
  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.dx = random(2) < 1 ? 5 : -5;
    this.dy = random(-3, 3);
  }
  
  collides(paddle) {
    if (this.x - this.w / 2 > paddle.x + paddle.w / 2 || paddle.x - paddle.w / 2 > this.x + this.w / 2) {
      return false;
    }
    if (this.y - this.h / 2 > paddle.y + paddle.h / 2 || paddle.y - paddle.h / 2 > this.y + this.h / 2) {
      return false;
    }
    
    this.dx = -this.dx * 1.03;
    this.dy = this.dy < 0 ? random (-5, -2) : random(2, 5);
    return true;
  }
}

class Paddle {
  constructor(position) {
    this.position = position;
    this.w = 10;
    this.h = 50;
    this.y = height / 2;
    this.x = this.position == "left" ? width / 2 - 350 : width / 2 + 350;
  }
  
  display() {
    rectMode(CENTER);
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
  
  move() {
    if (this.position == "right") {
      if (keyIsDown(UP_ARROW)) {
        this.y -= 10;
      }
      else if(keyIsDown(DOWN_ARROW)) {
        this.y += 10;
      }
    }
    
    if(this.position == "left") {
      if (keyIsDown(87)) {
        this.y -= 10;
      }
      else if (keyIsDown(83)) {
        this.y += 10;
      }
    }
    this.y = constrain(this.y, this.h / 2, height - this.h / 2);
  }
}