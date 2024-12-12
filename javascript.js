// Game constants
const WIDTH = 800;
const HEIGHT = 600;
const TRACKS = 4;
const TRACK_WIDTH = WIDTH / TRACKS;
const CHARACTER_SIZE = 40;
const FONT = "60px Arial";
const WHITE = "white";
const BLACK = "black";
const BLUE = "blue";
const RED = "red";

// Game variables
let score = 0;
let targetLetter = getRandomLetter();
let characterTrack = 2; // Starting at the middle
let letterSpeed = 5; // Falling speed
let letters = Array.from({ length: TRACKS }, () => createNewLetter());
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Game state
let gameRunning = false;

// Handle player movement
let moveLeft = false;
let moveRight = false;

document.getElementById('left').addEventListener('click', () => {
    if (characterTrack > 0) {
        characterTrack--;
    }
});

document.getElementById('right').addEventListener('click', () => {
    if (characterTrack < TRACKS - 1) {
        characterTrack++;
    }
});

document.getElementById('start-stop').addEventListener('click', () => {
    gameRunning = !gameRunning;
    if (gameRunning) {
        document.getElementById('start-stop').textContent = 'Stop';
        gameLoop();
    } else {
        document.getElementById('start-stop').textContent = 'Start';
    }
});

// Create a new falling letter
function createNewLetter() {
    return {
        letter: getRandomLetter(),
        y: 0,
    };
}

// Get a random uppercase letter
function getRandomLetter() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters.charAt(Math.floor(Math.random() * letters.length));
}

// Update game state
function update() {
    // Update letter positions
    for (let i = 0; i < TRACKS; i++) {
        letters[i].y += letterSpeed;

        // Check if letter reaches player
        if (letters[i].y >= HEIGHT - 100 && characterTrack === i) {
            if (letters[i].letter === targetLetter) {
                score++;
                targetLetter = getRandomLetter(); // New target letter
                letterSpeed = Math.min(letterSpeed + 1, 20); // Increase speed
            }
            letters[i] = createNewLetter(); // Reset letter
        }

        // Reset letter if it falls off screen
        if (letters[i].y > HEIGHT) {
            letters[i] = createNewLetter();
        }
    }
}

// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear canvas

    // Draw tracks
    for (let i = 0; i < TRACKS; i++) {
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 3;
        ctx.strokeRect(i * TRACK_WIDTH, 0, TRACK_WIDTH, HEIGHT); // Track lines
    }

    // Draw falling letters
    for (let i = 0; i < TRACKS; i++) {
        ctx.fillStyle = BLUE;
        ctx.font = FONT;
        const letter = letters[i].letter;
        ctx.fillText(letter, i * TRACK_WIDTH + TRACK_WIDTH / 2 - 15, letters[i].y);
    }

    // Draw player
    const playerImage = new Image();
    playerImage.src = 'car.png';
    const playerX = characterTrack * TRACK_WIDTH + TRACK_WIDTH / 2 - CHARACTER_SIZE / 2;
    ctx.drawImage(playerImage, playerX-30, HEIGHT-190, CHARACTER_SIZE+80, CHARACTER_SIZE+150);

    // Draw score
    ctx.fillStyle = 'green';
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 35);

    // Draw target letter
    ctx.fillStyle = RED;
    ctx.fillText(`Catch: ${targetLetter}`, WIDTH - 180, 35);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    update();
    drawGame();
    requestAnimationFrame(gameLoop);
}
