export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  resource = 0;

  constructor(ctx, scaleRatio, clickCount) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.clickCount = clickCount; // Pass the clickCount here
  }

  update(frameTimeDelta, clickCount) {
    // Increment score when a tree is clicked
    if (clickCount>200) {
      this.score=this.score*2;  
    }
    else{
      this.score = this.score + 1;
    }
  }

  reset() {
    this.score = 0;
    this.resource = 0;
  }

  setHighScore() {
    // Update the clickCount when a cactus is clicked
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
      // Increment the clickCount when high score is updated
      this.clickCount++;
    }
  }

  draw() {
    
    // this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}
