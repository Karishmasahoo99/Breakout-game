let rulesBtn=document.getElementById("rules-btn");
let closeBtn=document.getElementById("close-btn");
let rules=document.getElementById("rules");

rulesBtn.addEventListener("click",()=>{
    rules.classList.add("show");
})

closeBtn.addEventListener("click",()=>{
    rules.classList.remove("show");
})

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let brickRowCount = 9;
let brickColumnCount = 5;

//create ball props
const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    ballRadius:10,
    dx:2,
    dy:-2
}
//paddle props
const paddle={
   x:canvas.width/2 -40,
   y:canvas.height-20,
   w:80,
   h:10,
   speed:8,
   dx:0
}

//bricks props
const brickInfo={
    w:70,
    h:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible:true
}
    let rightPressed = false;
    let leftPressed = false;
let score = 0;
    let lives = 3;

let bricks = [];
for(let c=0; c<brickRowCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickColumnCount; r++) {
        const x=c*(brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y=r*(brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[c][r]={x,y, ...brickInfo}
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if(e.code  == "ArrowRight") {
            rightPressed = true;
        }
        else if(e.code == 'ArrowLeft') {
            leftPressed = true;
        }
    }
    function keyUpHandler(e) {
        if(e.code == 'ArrowRight') {
            rightPressed = false;
        }
        else if(e.code == 'ArrowLeft') {
            leftPressed = false;
        }
    }
    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
    }
    function collisionDetection() {
        for(let c=0; c<brickColumnCount; c++) {
            for(let r=0; r<brickRowCount; r++) {
                let b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if(score == brickRowCount*brickColumnCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI*2);
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
    bricks.forEach(column=>{
        column.forEach(brick=>{
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle=brick.visible ? "#0095dd" : "transparent";
            ctx.fill();
            ctx.closePath();
        })
    })
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    //     dx = -dx;
    // }
    // if(y + dy < ballRadius) {
    //     dy = -dy;
    // }
    // else if(y + dy > canvas.height-ballRadius) {
    //     if(x > paddleX && x < paddleX + paddleWidth) {
    //         dy = -dy;
    //     }
    //     else {
    //         lives--;
    //         if(!lives) {
    //             alert("GAME OVER");
    //             document.location.reload();
    //         }
    //         else {
    //             x = canvas.width/2;
    //             y = canvas.height-30;
    //             dx = 2;
    //             dy = -2;
    //             paddleX = (canvas.width-paddleWidth)/2;
    //         }
    //     }
    // }

    // if(rightPressed && paddleX < canvas.width-paddleWidth) {
    //     paddleX += 7;
    // }
    // else if(leftPressed && paddleX > 0) {
    //     paddleX -= 7;
    // }

    // x += dx;
    // y += dy;
    // requestAnimationFrame(draw);
}

function movePaddle(){
    paddle.x+=paddle.dx;

    if(paddle.x + paddle.w >canvas.width){
        paddle.x=canvas.width= paddle.w;
    }

    if(paddle.x<0){
        paddle.x=0;
    }
}

function update(){
    movePaddle();
    draw();
    requestAnimationFrame(update)
}

document.getElementById("runButton").addEventListener("click",update);