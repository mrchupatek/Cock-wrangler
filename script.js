const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Установка размеров холста равными размерам окна браузера
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cellSize = 20;
let playerX = Math.floor(Math.random() * (canvas.width / cellSize));
let playerY = Math.floor(Math.random() * (canvas.height / cellSize));
let isCaught = false;
let startTime;
let mouseX = Math.floor(Math.random() * (canvas.width / cellSize));
let mouseY = Math.floor(Math.random() * (canvas.height / cellSize));

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(playerX * cellSize, playerY * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
    const newX = playerX + dx;
    const newY = playerY + dy;
    if (newX >= 0 && newX < canvas.width / cellSize && newY >= 0 && newY < canvas.height / cellSize) {
        playerX = newX;
        playerY = newY;
    }
}

canvas.addEventListener("mousemove", function(event) {
    mouseX = Math.floor((event.clientX - canvas.getBoundingClientRect().left) / cellSize);
    mouseY = Math.floor((event.clientY - canvas.getBoundingClientRect().top) / cellSize);
});

function update() {
    const deltaX = mouseX - playerX;
    const deltaY = mouseY - playerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = 0.1; // Уменьшаем скорость для плавности движения
    const dx = speed * deltaX / distance;
    const dy = speed * deltaY / distance;
    movePlayer(dx, dy);
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        isCaught = true;
        if (startTime) {
            startTime = null; // Обнуляем таймер
        }
        setTimeout(function() {
            isCaught = false;
        }, 1000); // Показываем сообщение "Поймал" в течение 1 секунды
    }
}

function drawMessage() {
    if (isCaught) {
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Петух пойман", canvas.width / 2, canvas.height / 2);
    }
}

function drawTimer() {
    if (!isCaught && startTime) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Время: ${elapsedTime} сек`, canvas.width - 10, 30);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawMessage();
    drawTimer();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener("mousemove", function(event) {
    if (!startTime) {
        startTime = new Date().getTime();
    }
});

gameLoop();
