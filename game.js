const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let score = 0;
let isJumping = false;
let obstacles = [];
let obstacleSpeed = 5;
let gameOver = false;

// Character properties
const character = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    gravity: 1,
    jumpStrength: 15,
    velocityY: 0
};

// Obstacle properties
function createObstacle() {
    const obstacleHeight = 30;
    const obstacle = {
        x: canvas.width,
        y: 300 - obstacleHeight,
        width: 20,
        height: obstacleHeight
    };
    obstacles.push(obstacle);
}

// Game loop
function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter();
    updateCharacter();
    updateObstacles();
    drawObstacles();
    checkCollision();
    updateScore();
    requestAnimationFrame(gameLoop);
}

function drawCharacter() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

function updateCharacter() {
    if (isJumping) {
        character.velocityY -= character.gravity;
        character.y -= character.velocityY;

        if (character.y >= 300) {
            character.y = 300;
            isJumping = false;
        }
    }
}

function updateObstacles() {
    if (Math.random() < 0.02) { // Adjust the frequency of obstacles
        createObstacle();
    }
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;
    }
    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y + character.height > obstacle.y
        ) {
            gameOver = true;
            alert("Game Over! Final Score: " + score);
            document.location.reload();
        }
    }
}

function updateScore() {
    score += 1; // Increment score continuously
    document.getElementById('score').innerText = 'Score: ' + score;
}

// Event listener for jumping on tap
canvas.addEventListener('touchstart', (event) => {
    if (!isJumping) {
        isJumping = true;
        character.velocityY = character.jumpStrength;
    }
});

// Start the game loop
gameLoop(); 
