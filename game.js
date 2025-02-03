const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 100, y: canvas.height - 150, width: 30, height: 50,
    velX: 0, velY: 0, onGround: false, climbing: false
};

const gravity = 0.6;
const jumpPower = -12;
const moveSpeed = 3;
const friction = 0.8;
let scrollSpeed = 2; // Velocidade inicial da esteira
let keys = {};
let gameRunning = false;

const platforms = [
    { x: 200, y: canvas.height - 80, width: 100, height: 20 },
    { x: 500, y: canvas.height - 150, width: 100, height: 20 },
    { x: 800, y: canvas.height - 200, width: 100, height: 20 },
    { x: 1100, y: canvas.height - 250, width: 50, height: 100 } // Parede para escalar
];

function update() {
    if (!gameRunning) return;

    player.velY += gravity;
    player.velX *= friction;

    if (keys["ArrowLeft"]) player.velX = -moveSpeed;
    if (keys["ArrowRight"]) player.velX = moveSpeed;

    if (keys["ArrowUp"] && player.onGround) {
        player.velY = jumpPower;
        player.onGround = false;
    }

    player.x += player.velX;
    player.y += player.velY;

    player.onGround = false;
    player.climbing = false;

    platforms.forEach(platform => {
        if (player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velY &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width) {
                player.y = platform.y - player.height;
                player.velY = 0;
                player.onGround = true;
        }

        platform.x -= scrollSpeed;
        if (platform.x + platform.width < 0) {
            platform.x = canvas.width + Math.random() * 200;
        }
    });

    if (player.y > canvas.height) {
        player.y = canvas.height - player.height;
        player.velY = 0;
        player.onGround = true;
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "gray";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Play/Pause
document.getElementById("playPauseBtn").addEventListener("click", () => {
    gameRunning = !gameRunning;
    document.getElementById("playPauseBtn").innerText = gameRunning ? "Pause" : "Play";
});

// Aumentar velocidade
document.getElementById("speedUpBtn").addEventListener("click", () => {
    scrollSpeed += 1; // Aumenta a velocidade da esteira
});

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
