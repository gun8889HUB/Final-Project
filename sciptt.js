let board;
let boardWidth = 800;
let boardHeight = 600;
let context;
let playerX = 50;
let playerY = boardHeight - 85;
let playerWidth = 85;
let playerHeight = 85;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};


let gameover = false;
let score = 0;
let time = 0;
let lives = 3;
let startTime;
let boxImg;
let boxWidth = 40;
let boxHeight = 80;
let boxX = 700;
let boxY = boardHeight - boxHeight;
let flowerImg;
let bossImg;
let blockImg;
let brickImg;
let obstacleImages = [];
let boxArray = [];
let boxSpeed = -3;
let velocityY = 0;
let gravity = 0.25;

// เสียงประกอบเกม
let bgMusic;
let jumpSound;
let hitSound;

window.onload = function() {
    board = document.getElementById('gameboard');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d');

    playerImg = new Image();
    playerImg.src = 'Mario.jpg';
    playerImg.onload = function() {
        context.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight);
    };

    startTime = Date.now();
    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    flowerImg = new Image();
    flowerImg.src = 'flower.jpg';

    bossImg = new Image();
    bossImg.src = 'boss.jpg';

    blockImg = new Image();
    blockImg.src = 'Block.jpg';

    brickImg = new Image();
    brickImg.src = 'Brick.jpg';

    obstacleImages = [
        flowerImg,
        bossImg,
        blockImg,
        brickImg
    ];

    bgMusic = new Audio('bg-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    bgMusic.play().catch(function() {
        document.addEventListener("keydown", function playOnce() {
            bgMusic.play();
            document.removeEventListener("keydown", playOnce);
        });
    });

    jumpSound = new Audio('jump.mp3');
    hitSound = new Audio('hit.mp3');

    createBox();
};

function update() {
    requestAnimationFrame(update);

    if (gameover) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    player.y += velocityY;

    if (player.y > boardHeight - playerHeight) {
        player.y = boardHeight - playerHeight;
        velocityY = 0;
    }

    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let i = 0; i < boxArray.length; i++) {
        let box = boxArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);
    }

    for (let i = 0; i < boxArray.length; i++) {
        let box = boxArray[i];
        if (onCollision(player, box)) {
            hitSound.currentTime = 0;
            hitSound.play();
            loseLife();
            boxArray.splice(i, 1);
            player.y = boardHeight - playerHeight;
            velocityY = 0;
            break;
        }
    }

    if (gameover) {
        return;
    }

    score++;
    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Score: " + score, 10, 30);

    time = (Date.now() - startTime) / 1000;
    context.font = "bold 20px Arial";
    context.textAlign = "right";
    context.fillText("Time: " + time.toFixed(2), 700, 30);

    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Lives: " + lives, 10, 60);

    checkGameTime();
}

function movePlayer(e) {
    if (gameover) {
        return;
    }

    if (e.code === "Space" && player.y === boardHeight - playerHeight) {
        velocityY = -10;
        jumpSound.currentTime = 0;
        jumpSound.play();
    }
}

function randomBoxTime() {
    let randomTime = Math.floor(Math.random() * 2000) + 1000;
    return randomTime;
}

function createBox() {
    if (gameover) {
        return;
    }

    let randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    let randomWidth = 50;
    let randomHeight = 90;

    if (randomImage === flowerImg) {
        randomWidth = 50;
        randomHeight = 80;
    }

    if (randomImage === bossImg) {
        randomWidth = 70;
        randomHeight = 70;
    }

    if (randomImage === blockImg) {
        randomWidth = 70;
        randomHeight = 70;
    }

    if (randomImage === brickImg) {
        randomWidth = 70;
        randomHeight = 70;
    }

    let box = {
        img: randomImage,
        x: boxX,
        y: boardHeight - randomHeight,
        width: randomWidth,
        height: randomHeight
    };

    boxArray.push(box);

    if (boxArray.length > 5) {
        boxArray.shift();
    }

    let randomTime = randomBoxTime();
    setTimeout(createBox, randomTime);
}

function showGameOverScreen(titleText) {
    bgMusic.pause();

    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "black";
    context.fillRect(0, 0, boardWidth, boardHeight);

    context.fillStyle = "white";
    context.font = "bold 40px Arial";
    context.textAlign = "center";
    context.fillText(titleText, boardWidth / 2, boardHeight / 2);

    context.font = "bold 30px Arial";
    context.fillText("Final Score: " + score, boardWidth / 2, boardHeight / 2 + 50);
}

function loseLife() {
    lives--;

    if (lives <= 0) {
        gameover = true;
        showGameOverScreen("Game Over");
        document.getElementById("restartButton").disabled = true;
    }
}

function checkGameTime() {
    if (time >= 60) {
        gameover = true;
        showGameOverScreen("Time Up!");
        document.getElementById("restartButton").disabled = true;
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
           (obj1.x + obj1.width) > obj2.x &&
           obj1.y < (obj2.y + obj2.height) &&
           (obj1.y + obj1.height) > obj2.y;
}

function restartGame() {
    location.reload();
}