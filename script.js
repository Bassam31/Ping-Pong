var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var animationId;
var gameRunning = false;
var playerMode; 
var aiDifficulty;

var countdown = 3;
var countdownInterval;

startBtn.addEventListener("click", function() {
  if (!gameRunning) {
    $('#options-modal').modal('show');
  }
});

pauseBtn.addEventListener("click", function() {
  gameRunning = false;
  clearInterval(countdownInterval);
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", function() {
  document.location.reload();
});

var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 7; 
var ballSpeedY = 7; 

var paddleHeight = 120; 
var paddleWidth = 8; 
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 7; 

var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 20;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (playerMode === "player") {
    if (e.key === "ArrowUp") {
      upPressed = true;
    } else if (e.key === "ArrowDown") {
      downPressed = true;
    } else if (e.key === "w") {
      wPressed = true;
    } else if (e.key === "s") {
      sPressed = true;
    }
  } else if (playerMode === "ai") {
    if (e.key === "w") {
      wPressed = true;
    } else if (e.key === "s") {
      sPressed = true;
    }
  }
}

function keyUpHandler(e) {
  if (playerMode === "player") {
    if (e.key === "ArrowUp") {
      upPressed = false;
    } else if (e.key === "ArrowDown") {
      downPressed = false;
    } else if (e.key === "w") {
      wPressed = false;
    } else if (e.key === "s") {
      sPressed = false;
    }
  } else if (playerMode === "ai") {
    if (e.key === "w") {
      wPressed = false;
    } else if (e.key === "s") {
      sPressed = false;
    }
  }
}

function update() {
  if (gameRunning) {
    if (playerMode === "player") {
      if (upPressed && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
      } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
        rightPaddleY += paddleSpeed;
      }

      if (wPressed && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
      } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
        leftPaddleY += paddleSpeed;
      }
    } else if (playerMode === "ai") {
      if (ballY > rightPaddleY + paddleHeight / 2) {
        rightPaddleY += paddleSpeed * 0.8;
      } else if (ballY < rightPaddleY + paddleHeight / 2) {
        rightPaddleY -= paddleSpeed * 0.8;
      }

      if (wPressed && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
      } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
        leftPaddleY += paddleSpeed;
      }
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

    if (
      ballX - ballRadius < paddleWidth &&
      ballY > leftPaddleY &&
      ballY < leftPaddleY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (
      ballX + ballRadius > canvas.width - paddleWidth &&
      ballY > rightPaddleY &&
      ballY < rightPaddleY + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (ballX < 0) {
      rightPlayerScore++;
      if (rightPlayerScore >= maxScore) {
        playerWin();
        return;
      }
      reset();
    } else if (ballX > canvas.width) {
      leftPlayerScore++;
      if (leftPlayerScore >= maxScore) {
        playerWin();
        return;
      }
      reset();
    }
    
    document.getElementById("user-score").textContent = leftPlayerScore;
    document.getElementById("ai-score").textContent = rightPlayerScore;
  }
}

function playerWin() {
  var winner = (leftPlayerScore >= maxScore) ? "User" : "AI";
  var message = "Congratulations! " + winner + " wins!";
  $('#message').text(message); 
  $('#message-modal').modal('show'); 
  gameRunning = false;
}

function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 7; 
  ballSpeedY = 7;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  ctx.fillStyle = "blue";
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  ctx.fillStyle = "purple";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();

  update();

  animationId = requestAnimationFrame(draw);
}

function startCountdown() {
  countdownInterval = setInterval(function() {
    if (countdown > 0) {
      $('#message').text("Are you ready? " + countdown);
      $('#message-modal').modal('show');
      countdown--;
    } else {
      clearInterval(countdownInterval);
      gameRunning = true;
      $('#message-modal').modal('hide');
      draw(); 
    }
  }, 1000);
}

$('#play-with-player-btn').click(function() {
  playerMode = "player";
  $('#options-modal').modal('hide');
  startCountdown();
});

$('#play-with-ai-btn').click(function() {
  playerMode = "ai";
  $('#options-modal').modal('hide');
  startCountdown();
});
