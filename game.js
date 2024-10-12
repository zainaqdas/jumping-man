const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let score = 0;
let isJumping = false;
let obstacles = [];
let obstacleSpeed = 5;
let gameOver = false;

// Load images
const runnerImg = new Image();
const obstacleImg = new Image();
runnerImg.src = 'images/runner.png'; // Path to your runner image
obstacleImg.src = 'images/obstacle.png'; // Path to your obstacle image

// Character properties
const character = {
    x: 50,
    y: canvas.height - 60, // Adjusted to place at bottom of canvas
    width: 50,
    height: 50,
    gravity: 1,
    jumpStrength: 15,
    velocityY: 0
};

// Ground level constant
const groundLevel = canvas.height - 60; // Adjust ground level according to character height

// Obstacle properties
function createObstacle() {
    const obstacleHeight = 30; // Height of the obstacle image
    const obstacle = {
        x: canvas.width,
        y: groundLevel - obstacleHeight, // Position it on the ground
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
    ctx.drawImage(runnerImg, character.x, character.y, character.width, character.height);
}

function updateCharacter() {
    if (isJumping) {
        character.velocityY -= character.gravity;
        character.y -= character.velocityY;

        // Prevent the character from falling below the ground level
        if (character.y >= groundLevel) {
            character.y = groundLevel;
            isJumping = false;
        }
    } else {
        // If not jumping, ensure the character stays at the ground level
        character.y = groundLevel;
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
    for (let obstacle of obstacles) {
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
