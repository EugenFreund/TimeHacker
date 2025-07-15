import { Player } from './player';
import { Obstacle } from './obstacle';
import { Explosion } from './explosion';

export class Game {
  // code to be added
  constructor() {
    try {
      this.startScreen = document.getElementById('game-intro');
      this.gameScreen = document.getElementById('game-screen');
      this.gameEndScreen = document.getElementById('game-end');

      // Validate required elements exist
      if (!this.startScreen || !this.gameScreen || !this.gameEndScreen) {
        throw new Error('Required game elements not found in DOM');
      }

      // this.width = 1200;
      // this.height = 800;
      this.player = new Player(this.gameScreen, 20, 620, 180);
      this.obstacle = [];
      this.animatedId = 0;
      this.heightSrore = [];
      this.years = 0;
      this.isGameRunning = false;
    } catch (error) {
      console.error('Game initialization failed:', error);
      this.showError('Failed to initialize game. Please refresh the page.');
    }
  }

  start() {
    try {
      if (!this.player || !this.gameScreen) {
        throw new Error('Game not properly initialized');
      }

      this.isGameRunning = true;
      this.startScreen.style.display = 'none';
      this.gameEndScreen.style.display = 'none';
      this.gameScreen.style.display = 'block';

      this.gameScreen.style.width = '1200px';
      this.gameScreen.style.height = '800px';

      this.gameLoop();
    } catch (error) {
      console.error('Failed to start game:', error);
      this.showError('Failed to start game. Please try again.');
    }
  }

  gameLoop() {
    if (this.player.lives < 1) {
      this.gameOver();
    } else {
      this.update();

      if (this.animatedId % 10 === 0) {
        this.yearsHacked();
      }

      if (this.animatedId % 100 === 0) {
        this.obstacle.push(
          new Obstacle(
            this.gameScreen,
            this.gameScreen.clientWidth + 240, // 240px out of the screen bc the
            Math.random() * (this.gameScreen.clientHeight - 360) + 230,
            150
          )
        );
      }
      this.animatedId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  update() {
    const nextObstacles = [];

    this.obstacle.forEach(obstacle => {
      obstacle.moveLeft();
      if (this.player.didCollide(obstacle)) {
        new Explosion(
          this.gameScreen,
          obstacle.left,
          obstacle.top - obstacle.height / 2
        );
        obstacle.element.remove();

        if (this.years > 100) {
          this.years -= 100;
        } else {
          this.years = 0;
        }
        this.player.lives -= 1;
        let liveBarStatus = String(this.player.lives * 33);
        document.documentElement.style.setProperty(
          '--liveBar',
          `${liveBarStatus}%`
        );
      } else if (obstacle.left < 0 - obstacle.width) {
        this.years += 100;
        obstacle.element.remove();
      } else {
        nextObstacles.push(obstacle);
      }
    });

    this.obstacle = nextObstacles;
  }

  yearsHacked() {
    let years = document.getElementById('years');
    years.innerHTML = this.years += 1;
  }

  gameOver() {
    this.startScreen.style.display = 'none';
    this.gameEndScreen.style.display = 'block';
    this.gameScreen.style.display = 'none';

    document.documentElement.style.setProperty('--liveBar', '100%');

    this.obstacle.forEach(obstacle => obstacle.element.remove());
    this.storeData(this.player.name, this.years);
    this.outputScore();
  }

  outputScore() {
    // Check if local storage has the data you want to display
    if (localStorage.getItem('userData')) {
      let highscoreList = document.getElementById('highscore');
      highscoreList.innerHTML = '';

      // Parse the data from local storage
      const data = JSON.parse(localStorage.getItem('userData'));

      // Create an unordered list element
      const ul = document.createElement('ul');

      // Limit the number of items to 5
      const maxItems = Math.min(5, data.length);

      // Loop through the data and create list items
      for (let i = 0; i < maxItems; i++) {
        const li = document.createElement('li');
        // Access the 'Name' and 'Score' properties and set them as the list item's text
        li.textContent = `${data[i].Name} _____ ${data[i].Score} Years`;
        ul.appendChild(li); // Add the list item to the unordered list
      }

      // Add the unordered list to your HTML document

      highscoreList.appendChild(ul);
    }
  }

  // Function to store data in local storage
  storeData(name, score) {
    try {
      // Check if local storage is supported by the browser
      if (typeof Storage === 'undefined') {
        throw new Error('Local storage is not supported by this browser.');
      }

      // Validate input
      if (!name || name.trim() === '') {
        name = 'Anonymous';
      }

      if (typeof score !== 'number' || score < 0) {
        score = 0;
      }

      // Check if there's existing data in local storage
      let existingData = [];
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        existingData = JSON.parse(storedData);
      }

      // Create a new object with the provided Name and score
      const newData = { Name: name.trim(), Score: score };

      // Add the new data to the existing data array
      existingData.push(newData);

      // Sort by score (highest first)
      existingData.sort((a, b) => b.Score - a.Score);

      // Keep only top 5 scores
      if (existingData.length > 5) {
        existingData = existingData.slice(0, 5);
      }

      // Store the updated data back in local storage
      localStorage.setItem('userData', JSON.stringify(existingData));

      console.log('Data stored successfully');
    } catch (error) {
      console.error('Failed to store data:', error);
      this.showError('Failed to save high score.');
    }
  }

  // Error handling method
  showError(message) {
    console.error(message);

    // Create or update error display
    let errorElement = document.getElementById('game-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = 'game-error';
      errorElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ff0000;
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-family: 'VT323', monospace;
                font-size: 24px;
                text-align: center;
                z-index: 9999;
                max-width: 400px;
                border: 2px solid #ffffff;
            `;
      document.body.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }, 5000);
  }
}
