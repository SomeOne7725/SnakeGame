const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

const eatSound = new Audio('sound5.wav');

let snake;
let apple;
let gameInterval;
let score = 0;

const appleImage = new Image();
appleImage.src = 'https://someone7725.github.io/SnakeGame/apfel.png';  // Vollständiger URL-Pfad

appleImage.onload = function() {
    console.log("Apple image loaded successfully!");
};

appleImage.onerror = function() {
    console.error("Failed to load the apple image. Please check the file path.");
};

const playButton = document.getElementById('playButton');
const playButtonContainer = document.getElementById('playButtonContainer');

function startGame() {
    playButtonContainer.style.display = 'none';
    setup();
}

playButton.addEventListener('click', startGame);

function setup() {
    snake = new Snake();
    apple = new Apple();
    gameInterval = setInterval(game, 120);
}

function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    apple.draw();

    if (snake.eatApple(apple)) {
        eatSound.play();
        apple.randomPosition();
        snake.grow();
        score++;

        if (quests.quest1.progress < quests.quest1.goal) {
            quests.quest1.progress++;
        }

        updateScore();
        updateQuestStatus();
    }

    if (snake.checkCollision()) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('gameOverButtonContainer').style.display = 'block';
}

function restartGame() {
    snake = new Snake();
    apple.randomPosition();
    score = 0;
    quests.quest1.progress = 0;
    quests.quest1.completed = false;
    updateScore();
    document.getElementById('gameOverButtonContainer').style.display = 'none';
    gameInterval = setInterval(game, 120);
    updateQuestStatus();
}

function updateScore() {
    if (isNaN(score)) {
        score = 0;
    }
    document.getElementById('score').textContent = `Punktestand: ${score}`;
}

function Snake() {
    this.body = [{ x: 5, y: 5 }];
    this.length = 1;
    this.direction = 'right';
    this.nextDirection = 'right';

    this.update = function() {
        let head = { ...this.body[0] };
        this.direction = this.nextDirection;

        if (this.direction === 'right') head.x++;
        if (this.direction === 'left') head.x--;
        if (this.direction === 'up') head.y--;
        if (this.direction === 'down') head.y++;

        this.body.unshift(head);

        if (this.body.length > this.length) {
            this.body.pop();
        }
    };

    this.draw = function() {
        this.body.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? 'lime' : 'green';
            ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        });
    };

    this.changeDirection = function(event) {
        if (event.repeat) return;

        if ((event.key === 'ArrowLeft' || event.key === 'a') && this.direction !== 'right') {
            this.nextDirection = 'left';
        }
        if ((event.key === 'ArrowUp' || event.key === 'w') && this.direction !== 'down') {
            this.nextDirection = 'up';
        }
        if ((event.key === 'ArrowRight' || event.key === 'd') && this.direction !== 'left') {
            this.nextDirection = 'right';
        }
        if ((event.key === 'ArrowDown' || event.key === 's') && this.direction !== 'up') {
            this.nextDirection = 'down';
        }
    };

    this.eatApple = function(apple) {
        return this.body[0].x === apple.x && this.body[0].y === apple.y;
    };

    this.checkCollision = function() {
        const head = this.body[0];
        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) return true;

        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) return true;
        }
        return false;
    };

    this.grow = function() {
        this.length++;
    };
}

function Apple() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.randomPosition = function() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    };

    this.draw = function() {
        if (appleImage.complete && appleImage.naturalWidth > 0) {
            ctx.drawImage(appleImage, this.x * scale, this.y * scale, scale, scale);
        } else {
            // Bild noch nicht geladen oder nicht verfügbar, daher ein Platzhalter zeichnen
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
        }
    };
}

document.addEventListener('keydown', function(event) {
    if ((event.key === ' ' || event.key === 'Enter') && playButtonContainer.style.display !== 'none') {
        startGame();
    }
    if (event.key === ' ' || event.key === 'Enter') {
        const gameOverButtonContainer = document.getElementById('gameOverButtonContainer');
        if (gameOverButtonContainer.style.display === 'block') {
            restartGame();
        }
    }
    snake.changeDirection(event);
});

document.addEventListener('DOMContentLoaded', function() {
    const gameOverButton = document.getElementById('gameOverButton');
    if (gameOverButton) {
        gameOverButton.addEventListener('click', restartGame);
    }
    showQuests();
});

const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');

volumeSlider.addEventListener('input', function() {
    const volume = volumeSlider.value;
    eatSound.volume = volume;
    volumeValue.textContent = `${Math.round(volume * 100)}%`;
});

eatSound.volume = 1;

let quests = {
    quest1: {
        description: "Sammle 10 Punkte",
        goal: 10,
        progress: 0,
        completed: false
    }
};

function updateQuestStatus() {
    const quest1Status = document.getElementById('quest1Status');
    quest1Status.textContent = `${quests.quest1.progress}/${quests.quest1.goal}`;

    if (quests.quest1.progress >= quests.quest1.goal) {
        quests.quest1.progress = quests.quest1.goal;
        quests.quest1.completed = true;
    }
}

function showQuests() {
    const quest1Status = document.getElementById('quest1Status');
    quest1Status.textContent = `${quests.quest1.progress}/${quests.quest1.goal}`;
}
