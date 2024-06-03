let rulesBtn = document.getElementById("rules-btn");
let closeBtn = document.getElementById("close-btn");
let rules = document.getElementById("rules");

rulesBtn.addEventListener("click", () => {
    rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    rules.classList.remove("show");
});

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let brickRowCount = 9;
let brickColumnCount = 5;

// create ball props
const initialBallSpeed = 3;
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    ballRadius: 10,
    speed: initialBallSpeed,
    dx: 1,  // initial direction
    dy: -1  // initial direction
};

// paddle props
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};

// bricks props
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false; // Flag to control game state
let animationId; // To store the animation frame ID

let bricks = [];
for (let c = 0; c < brickRowCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickColumnCount; r++) {
        const x = c * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = r * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[c][r] = { x, y, ...brickInfo };
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
    if (e.code == "ArrowRight") {
        paddle.dx = paddle.speed;
    } else if (e.code == 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function keyUpHandler(e) {
    if (e.code == 'ArrowRight' || e.code == 'ArrowLeft') {
        paddle.dx = 0;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.w / 2;
    }
}

function resetTheGame() {
    score = 0;
    lives = 3;
    level = 1;
    ball.speed = initialBallSpeed;
    ball.dx = 1;
    ball.dy = -1;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    paddle.x = canvas.width / 2 - paddle.w / 2;
    showAllBricks();
    gameRunning = false; // Stop the game
    if (animationId) {
        cancelAnimationFrame(animationId); // Stop the previous animation frame
    }
}

function increaseScore() {
    score++;
    // if no bricks are left
    if (score % (brickColumnCount * brickRowCount) === 0) {
        level++;
        ball.speed *= 1.1; // increase ball speed
        showAllBricks();
    }
}

function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true;
        });
    });
}

function collisionDetection() {
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (ball.x - ball.ballRadius > brick.x && // left
                    ball.x + ball.ballRadius < brick.x + brick.w && // right
                    ball.y + ball.ballRadius > brick.y && // top
                    ball.y - ball.ballRadius < brick.y + brick.h // bottom
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
    });

    // Hit bottom wall - Lose a life
    if (ball.y + ball.ballRadius > canvas.height) {
        lives--;
        if (lives === 0) {
            showGameOverModal();
            gameRunning = false; // Stop the game
        } else {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = 1;
            ball.dy = -1;
            paddle.x = canvas.width / 2 - paddle.w / 2;
        }
    }
}

function showGameOverModal() {
    const modal = document.getElementById("myModal");
    const message = document.getElementById("congratulationsMessage");
    message.textContent = `Congratulations! You scored ${score} in level ${level}.`;
    modal.style.display = "block";
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
            ctx.fill();
            ctx.closePath();
        });
    });
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + level, canvas.width / 2, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawLevel();
}

function movePaddle() {
    paddle.x += paddle.dx;

    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

function moveBall() {
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;

    // Wall collision
    // right and left
    if (ball.x + ball.ballRadius > canvas.width || ball.x - ball.ballRadius < 0) {
        ball.dx *= -1;
    }

    // top
    if (ball.y - ball.ballRadius < 0) {
        ball.dy *= -1;
    }

    // paddle collision
    if (ball.x - ball.ballRadius > paddle.x && ball.x + ball.ballRadius < paddle.x + paddle.w && ball.y + ball.ballRadius > paddle.y) {
        ball.dy *= -1;
    }
}

function gameLoop() {
    if (gameRunning) {
        movePaddle();
        moveBall();
        collisionDetection();
        draw();
    }
    animationId = requestAnimationFrame(gameLoop);
}

document.getElementById("runButton").addEventListener("click", () => {
    resetTheGame();
    gameRunning = true;
    gameLoop();
});

document.getElementById("resetButton").addEventListener("click", () => {
    document.getElementById("myModal").style.display = "none";
    resetTheGame();
    gameRunning = true;
    gameLoop();
});

// Modal close button
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("myModal").style.display = "none";
    gameRunning = false;
});
