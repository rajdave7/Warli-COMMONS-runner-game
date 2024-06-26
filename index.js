import CactiController from "./CactiController.js";
import Ground from "./Ground.js";
import Player from "./Player.js";
import Score from "./Score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1; // 1.0
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 250;
const PLAYER_WIDTH = 88 / 1.5; //58
const PLAYER_HEIGHT = 94 / 1.5; //62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.25;

const CACTI_CONFIG = [
  { width: 148 / 3, height: 170 / 1.5, image: "img/treeSmall.png" },
  { width: 230 / 3, height: 120 / 1.5, image: "public/animal_img.png" },
  { width: 168 / 3, height: 170 / 1.5, image: "img/treeSmall.png" },
];

//Game Objects
let player = null;
let ground = null;
let cactiController = null;
let score = null;
let resources = 0;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio
  );

  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio
  );

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED,
    resources
  );

  score = new Score(ctx, scaleRatio);
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
//Use setTimeout on Safari mobile rotation otherwise works fine on desktop
window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  //window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function showGameOver() {
  const fontSize = 30 * scaleRatio;
  dance;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x =
    canvas.width / 2 - ctx.measureText("YOU BUMPED INTO TREE!").width / 2;
  const y = canvas.height / 2;
  ctx.fillText("YOU BUMPED INTO TREE!", x, y);
}

const spriteSheet = new Image();
spriteSheet.src = "public/dance_sprite.png";

// Define animation parameters
const frameWidth = 600; // Width of each frame in the sprite sheet
const frameHeight = 336; // Height of each frame in the sprite sheet
const numFrames = 4; // Total number of frames in the sprite sheet
let currentFrame = 0; // Current frame index
let animationSpeed = 5100; // Milliseconds per frame

function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the scaled frame dimensions
  const scaledFrameWidth = frameWidth * scaleRatio;
  const scaledFrameHeight = frameHeight * scaleRatio;

  // Calculate the destination position
  const canvasCenterX = canvas.width / 2;
  const canvasCenterY = canvas.height / 2;
  const destinationX = canvasCenterX - scaledFrameWidth / 2;
  const destinationY = canvasCenterY - scaledFrameHeight / 2;

  // Draw current frame
  ctx.drawImage(
    spriteSheet,
    currentFrame * frameWidth, // Source X coordinate
    0, // Source Y coordinate (assuming all frames are in the same row)
    frameWidth, // Source width
    frameHeight, // Source height
    destinationX, // Destination X coordinate
    destinationY, // Destination Y coordinate
    scaledFrameWidth, // Destination width
    scaledFrameHeight // Destination height
  );

  // Move to the next frame
  currentFrame = (currentFrame + 1) % numFrames;

  // Request next frame render
  setTimeout(render, animationSpeed);
}

// danceGif.onload = function () {
//   // Start the game loop once the GIF is loaded
//   requestAnimationFrame(gameLoop);
// };
function dance() {
  // show the gif in public folder

  // clearScreen();
  render();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    setupGameReset();
  }
});

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 2 - ctx.measureText("Start").width / 2;
  const y = canvas.height / 2;
  ctx.fillText("Space to Start", x, y);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const videoElement = document.getElementById("gameOverVideo");

// Function to show the game over video
function showGameOverVideo() {
  // Show the video element
  videoElement.style.display = "block";
  // Play the video
  videoElement.play();
}

const audioElement = document.getElementById("backgroundAudio");

// Function to play the background audio
function playBackgroundAudio() {
  // Show the audio element
  audioElement.style.display = "block";
  // Play the audio
  audioElement.play();
}
function stopBackgroundAudio() {
  const backgroundAudio = document.getElementById("backgroundAudio");
  backgroundAudio.pause(); // Pause the background audio
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();
  let clickCount = 0;
  let prevClickCount = clickCount;
  if (!gameOver && !waitingToStart && prevClickCount == clickCount) {
    //Update game objects
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && cactiController.collideWith(player)) {
    gameOver = true;
    // setupGameReset();
    dance();
    score.setHighScore();
  }

  //Draw game objects
  ground.draw();
  cactiController.draw();
  player.draw();
  score.draw();
  const highScore = Number(localStorage.getItem(5000));
  const y = 20 * getScaleRatio();

  const fontSize = 20 * getScaleRatio();
  ctx.font = `${fontSize}px serif`;
  ctx.fillStyle = "#525250";
  const scoreX = canvas.width - 500 * getScaleRatio();
  const highScoreX = scoreX - 125 * getScaleRatio();

  const scorePadded = Math.floor(score).toString().padStart(6, 0);
  const highScorePadded = highScore.toString().padStart(6, 0);
  // const resourcePadded = resource.toString().padStart(6, 0);

  ctx.fillText(`Resources \n ${res}`, scoreX, y);
  playBackgroundAudio();
  function showCongratulationsMessage() {
    const congratulationsDiv = document.getElementById("congratulations");
    congratulationsDiv.style.display = "block";
  }
  if (gameOver) {
    // showGameOver();
    // const gameOverImage = document.getElementById("gameOverImage");
    // gameOverImage.src = "public/dance.gif";
    // const gameOverOverlay = document.querySelector(".game-over-overlay");
    // gameOverOverlay.style.display = "block";
    // dance();
    stopBackgroundAudio();
    showCongratulationsMessage();
    setTimeout(showGameOverVideo, 2000);
  }
  function redirectToStartPage() {
    window.location.href = "startPage.html";
  }

  // Add event listener to detect when the video playback ends
  videoElement.addEventListener("ended", redirectToStartPage);

  if (waitingToStart) {
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
// const _this = this; // Store reference to 'this'
let clickCount = 0;
let res = 0;
// let score = 0;
canvas.addEventListener("click", () => {
  // Increment the click count variable
  clickCount++;
  // Log the updated click count to the console
  console.log("Click count:", clickCount);
  if (clickCount > 50) {
    res = res * 2;
  } else {
    res = res + 1;
  }
  if (res > 100000) {
    // console.log("ohno");
    // ctx.draw()
    gameOver = true;
  }
});
