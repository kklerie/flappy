let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let scoreElem = document.getElementById("score");
let bestScoreElem = document.getElementById("best_score");

let scoreValue = 0;
let bestScoreValue = 0;

canvas.width = 256;
canvas.height = 512;

let bird = new Image();
bird.src = "img/bird.png";

let fly_audio = new Audio();
fly_audio.src = "audio/fly.mp3";

let back = new Image();
back.src = "img/back.png";

let score_audio = new Audio();
score_audio.src = "audio/score.mp3";

let pipeB = new Image();
pipeB.src = "img/pipeBottom.png";

let pipeU = new Image();
pipeU.src = "img/pipeUp.png";

let road = new Image();
road.src = "img/road.png";

let velY = 0
let gravity = 0.2

let xPos = 10;
let yPos = 150;

let gap = 110
let pause = false;

let pipe = [];
pipe[0] = {
    x: canvas.width,
    y: 0
}

function draw() {
    if (!pause) {
        ctx.drawImage(back, 0, 0);
        ctx.drawImage(bird, xPos, yPos);

        if (yPos + bird.height >= canvas.height - road.height) {
            reset();
        }

        velY += gravity;
        yPos += velY;

        for (let i = 0; i < pipe.length; i++) {
            if (pipe[i].x < -pipeU.width) {
                pipe.shift();
            } else {
                ctx.drawImage(pipeU, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipeB, pipe[i].x, pipe[i].y + pipeU.height + gap);
                pipe[i].x -= 2

                if (pipe[i].x == 80) {
                    pipe.push({
                        x: canvas.width,
                        y: Math.floor(Math.random() * pipeU.height) - pipeU.height
                    })
                }
            }

            if (xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeU.width && (yPos <= pipe[i].y + pipeU.height || yPos + bird.height >= pipe[i].y + pipeU.height + gap)) {
                reset();
            }

            if (pipe[i].x === 0) {
                scoreValue++;
                score_audio.play();
            }
        }
    } else {
        ctx.drawImage(back, 0, 0);
        ctx.drawImage(bird, xPos, yPos);
        for (let i = 0; i < pipe.length; i++) {
            if (pipe[i].x < -pipeU.width) {
                pipe.shift();
            } else {
                ctx.drawImage(pipeU, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipeB, pipe[i].x, pipe[i].y + pipeU.height + gap);

            }
        }
        ctx.drawImage(road, 0, canvas.height - road.height);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
}
    ctx.drawImage(road, 0, canvas.height - road.height);
    scoreElem.innerHTML = "SCORE: " + scoreValue;
    bestScoreElem.innerHTML = "BEST SCORE: " + bestScoreValue;
}

function reset() {
    if (scoreValue > bestScoreValue) {
        bestScoreValue = scoreValue;
    }

    scoreValue = 0;
    xPos = 10
    yPos = 120
    velY = 0
    gravity = 0.2

    pipe = [];
    pipe[0] = {
        x: canvas.width,
        y: 0
    }
}

canvas.addEventListener("mousedown", moveUp);

function moveUp() {
    velY = -4
    fly_audio.play();
}

function gamePause() {
    pause = !pause;
}

setInterval(draw, 20);