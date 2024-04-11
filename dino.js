// The game board setup remains the same
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino setup remains mostly the same
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

// New game elements arrays
let obstacleArray = []; // Now holds trees, mountains, rivers, ponds, and other dinos

// New obstacle dimensions
let treeWidthSmall = 180; // Small tree
let treeWidthLarge = 180; // Large tree
let obstacleHeight = 280; // Generalized for simplicity, can be adjusted per obstacle

// New images for game elements
let treeSmallImg;
let treeLargeImg;
let mountainImg;
let riverImg;
let pondImg;
let otherDinoImg;

// Physics and game control variables remain the same
let velocityX = -4; // Obstacles moving left speed
let gravity = .4;

let gameOver = false;
let score = 0;
let partyMode = false; // New variable to control party mode

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // Used for drawing on the board

    // Loading the dino image remains the same
    dinoImg = new Image();
    dinoImg.src = "./img/stickman_normal.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    };

    // Load new images for obstacles
    treeSmallImg = new Image();
    treeSmallImg.src = "./img/treeSmall.png";

    // treeLargeImg = new Image();
    // treeLargeImg.src = "./img/treeLarge.png";

    mountainImg = new Image();
    mountainImg.src = "./img/mountain.png";

    // riverImg = new Image();
    // riverImg.src = "./img/river.png";

    // pondImg = new Image();
    // pondImg.src = "./img/pond.png";

    otherDinoImg = new Image();
    otherDinoImg.src = "./img/stickman_normal.png";

    // Initialize game loop and event listeners
    requestAnimationFrame(update);
    setInterval(placeObstacle, 2000); // Adjust frequency and type of obstacles
    document.addEventListener("keydown", moveDino);
};

function update() {
    if (partyMode) {
        // Implement party mode visuals here
        // Example: draw many dinos dancing on the screen
        return; // Skip the normal game loop
    }

    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Dino movement handling remains the same
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Handling obstacles (now including trees, mountains, etc.)
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (detectCollision(dino, obstacle)) {
            if (obstacle.type === 'tree') {
                score += obstacle.size === 'small' ? 5 : 10; // Increase score by tree size
            } else if (obstacle.type === 'otherDino') {
                score += 10; // Increase score for passing other dinos
            }
            // No gameOver for touching obstacles, but you can implement different logic here
        }
    }

    // Check for party mode activation
    if (score >= 100 && !partyMode) {
        startPartyMode();
    }

    // Score display remains the same
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    // Dino movement control remains the same
    if (gameOver || partyMode) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10; // Jump
    }
    // Implement ducking or other controls if desired
}

function placeObstacle() {
    if (gameOver || partyMode) {
        return;
    }

    // Place a new obstacle with randomized type (tree, mountain, etc.)
    let obstacleChance = Math.random();
    let obstacle = {
        img: null,
        x: boardWidth, // Start from the right edge
        y: boardHeight - obstacleHeight, // Adjust per obstacle
        width: null,
        height: obstacleHeight,
        type: '', // New attribute to distinguish obstacle types
        size: '' // For trees, to adjust scoring
    };

    // Randomize obstacles (simplified version, extend as needed)
    if (obstacleChance > .8) {
        obstacle.img = treeLargeImg;
        obstacle.width = treeWidthLarge;
        obstacle.type = 'tree';
        obstacle.size = 'large';
    } else if (obstacleChance > .6) {
        obstacle.img = treeSmallImg;
        obstacle.width = treeWidthSmall;
        obstacle.type = 'tree';
        obstacle.size = 'small';
    }else if (obstacleChance > .4) {
        obstacle.img = mountainImg;
        obstacle.width = obstacleHeight;
        obstacle.type = 'mountain';
    }
    // Add more conditions for other obstacles like mountains, rivers, etc.

    obstacleArray.push(obstacle);

    if (obstacleArray.length > 5) {
        obstacleArray.shift(); // Keep array size manageable
    }
}

function startPartyMode() {
    // Logic to start the party mode
    partyMode = true;
    // Here, you can draw many dinos dancing or change the game visuals
}

function detectCollision(a, b) {
    // Collision detection remains the same
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
