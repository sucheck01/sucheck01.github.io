const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 100, y: canvas.height - 150, width: 30, height: 50,
    velX: 0, velY: 0, onGround: false, climbing: false
};

const gravity = 0.5;
const jumpPower = -12;
const moveSpeed = 3;
const friction = 0.9;
const scrollSpeed = 2;
let keys = {};

const platforms = [
    { x: 300, y: canvas.height - 100, width: 100, height: 20 },
    { x: 600, y: canvas.height - 150, width: 100, height: 20 },
    { x: 900, y: canvas.height - 200, width: 100, height: 20 },
    { x: 1200, y: canvas.height - 250, width: 50, height: 100 } // Parede para escalar
];

function update() {
    player.velY += gravity;
    player.velX *= friction;

    if (keys["ArrowLeft"]) player.velX = -moveSpeed;
    if (keys["ArrowRight"]) player.velX = moveSpeed;
    
    if (keys["ArrowUp"] && player.onGround) {
        player.velY = jumpPower;
        player.onGround = false;
    }

    if (keys["ArrowUp"] && player.climbing) {
        player.velY = -5; // Subir escalando
    }

    player.x += player.velX;
    player.y += player.velY;

    player.onGround = false;
    player.climbing = false;

    platforms.forEach(platform => {
        // Detecção de colisão com o topo da plataforma (para pisar nela)
        if (player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velY &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width) {
                player.y = platform.y - player.height;
                player.velY = 0;
                player.onGround = true;
        }

        // Verifica se está agarrado na parede
        if (player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.height > platform.y &&
            player.y < platform.y + platform.height) {
                if (keys["ArrowUp"]) {
                    player.climbing = true;
                }
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

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
