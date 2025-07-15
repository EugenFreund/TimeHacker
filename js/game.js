import { GameState } from './gameState.js';
import Player from './player.js';
import Obstacle from './obstacle.js';
import Explosion from './explosion.js';
import PowerUp from './powerup.js';
import { GameConfig } from './config.js'; // Import GameConfig

export default class Game {
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
            this.player = new Player(this.gameScreen,20, 620,180);
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
            
            this.gameScreen.style.width = "1200px";
            this.gameScreen.style.height = "800px";
    
            this.gameLoop();
        } catch (error) {
            console.error('Failed to start game:', error);
            this.showError('Failed to start game. Please try again.');
        }
    }

    gameLoop() {
        try {
            if (!this.isGameRunning) {
                return; // Stop the game loop if game is not running
            }
            
            if (this.player.lives < 1) {
                this.gameOver();
            } else {
                this.update();
    
                if (this.animatedId % 10 === 0) {
                    this.yearsHacked();
                }
        
                if (this.animatedId % 100 === 0) {
                    this.obstacle.push(new Obstacle(
                        this.gameScreen,
                        this.gameScreen.clientWidth + 240, // 240px out of the screen bc the 
                        Math.random() * (this.gameScreen.clientHeight - 360) + 230,
                        150));
                }
                this.animatedId = requestAnimationFrame(() => this.gameLoop());
            }
        } catch (error) {
            console.error('Game loop error:', error);
            this.gameOver();

        }
    }

    start() {
        this._resetGameParameters(); 
        this.currentState = GameState.PLAYING;
        this._manageScreenVisibility();
        
        this.gameScreen.style.width = `${GameConfig.GAME_WIDTH}px`; 
        this.gameScreen.style.height = `${GameConfig.GAME_HEIGHT}px`;
    }

    gameLoop(timestamp) { 
        if (!this.lastTime && timestamp) { // Ensure timestamp is provided
            this.lastTime = timestamp;
        }
        // If timestamp is not available (e.g. first call after reset), use a default deltaTime or skip update
        const deltaTime = (timestamp && this.lastTime) ? timestamp - this.lastTime : (1000/60); // Default to 60 FPS if no timestamp
        this.lastTime = timestamp || 0;


        if (this.currentState === GameState.PLAYING) {
            if (!this.player) {
                console.error("Player not initialized in PLAYING state!");
                this.gameOver();
            } else {
                // Core game logic for PLAYING state
                this.processInput();
                this.updateGameElements(deltaTime);
                this.handleCollisions();
                this.updateScoreAndLives(deltaTime); // Includes game over check
                this.spawnElements(deltaTime);
            }
        }
        // this.renderGame(); // Future placeholder

        this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    processInput() {
        // Future: Handle real-time game input like continuous movement
        // For now, player input (moveUp, moveDown) is handled in script.js via event listeners
    }

    updateGameElements(deltaTime) {
        if (!this.player) return;

        this.player.updateInvincibility(deltaTime);

        // Move obstacles
        this.obstacle.forEach(obs => {
            obs.moveLeft(); // Obstacle movement logic is simple, no deltaTime needed for now
        });

        // Update power-ups (movement, etc.)
        this.updatePowerUps(deltaTime); // Pass deltaTime if powerups need it
    }

    handleCollisions() {
        if (!this.player) return;

        // Player-Obstacle collision
        const nextObstacles = [];
        this.obstacle.forEach(obs => {
            if (this.player.didCollide(obs)) {
                new Explosion(
                    this.gameScreen,
                    obs.left,
                    // Ensure obs.height is valid, Explosion might take default size from config if needed
                    obs.top - (obs.height || GameConfig.OBSTACLE_DEFAULT_HEIGHT) / 2); 
                if (obs.element && obs.element.parentNode) {
                    obs.element.remove();
                }
                
                if (this.years > GameConfig.SCORE_PENALTY_OBSTACLE_COLLISION) {
                    this.years -= GameConfig.SCORE_PENALTY_OBSTACLE_COLLISION;
                } else {
                    this.years = 0;
                }
                this.player.lives -= 1; // Lives decrease by 1
                // Player lives are 3, so 100/3 for percentage. GameConfig could store PLAYER_MAX_LIVES for this calc.
                let liveBarStatus = String(Math.max(0, this.player.lives) * (100 / GameConfig.PLAYER_INITIAL_LIVES));
                document.documentElement.style.setProperty('--liveBar', `${liveBarStatus}%`);
            } else if (obs.left < 0 - (obs.width || GameConfig.OBSTACLE_DEFAULT_HEIGHT)) { // Obstacle off-screen
                this.years += GameConfig.SCORE_REWARD_OBSTACLE_PASSED;
                if (obs.element && obs.element.parentNode) {
                    obs.element.remove();
                }
            } else {
                nextObstacles.push(obs);
            }
        });
        this.obstacle = nextObstacles;

        // Player-PowerUp collision is handled within updatePowerUps for now
    }
    
    updateScoreAndLives(deltaTime) {
        if (!this.player) return;

        // Time-based score increment (replaces yearsHacked frame-based logic)
        this.scoreUpdateTimer += deltaTime;
        if (this.scoreUpdateTimer >= this.scoreUpdateInterval) {
            this.scoreUpdateTimer -= this.scoreUpdateInterval; 
            this.years += GameConfig.SCORE_INCREMENT_PER_INTERVAL; 
        }
        document.getElementById('years').innerHTML = this.years; 

        // Game over check
        if (this.player.lives < 1) {
            this.gameOver();
        }
    }

    spawnElements(deltaTime) {
        // Time-based obstacle spawning
        this.obstacleSpawnTimer += deltaTime;
        if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
            this.obstacleSpawnTimer -= this.obstacleSpawnInterval; 
            this.obstacle.push(new Obstacle(
                this.gameScreen,
                this.gameScreen.clientWidth + GameConfig.GAME_OBSTACLE_OFFSCREEN_SPAWN_OFFSET, 
                Math.random() * (this.gameScreen.clientHeight - GameConfig.GAME_OBSTACLE_RANDOM_Y_MAX_OFFSET) + GameConfig.GAME_OBSTACLE_RANDOM_Y_MIN_OFFSET, 
                GameConfig.OBSTACLE_DEFAULT_HEIGHT)); // Assuming default height for now
        }
    }
    
    updatePowerUps(deltaTime) { 
        // Time-based power-up spawning logic
        this.powerUpSpawnTimer += deltaTime;
        if (this.powerUpSpawnTimer >= GameConfig.POWERUP_SPAWN_INTERVAL) {
            this.powerUpSpawnTimer = 0; // Reset timer (or subtract interval for accuracy: this.powerUpSpawnTimer -= GameConfig.POWERUP_SPAWN_INTERVAL)

    gameOver() {
        try {
            this.isGameRunning = false;
            
            // Cancel animation frame to stop the game loop
            if (this.animatedId) {
                cancelAnimationFrame(this.animatedId);
            }
            
            this.startScreen.style.display = 'none';
            this.gameEndScreen.style.display = 'block';
            this.gameScreen.style.display = 'none';
    
            document.documentElement.style.setProperty('--liveBar', '100%');
    
            this.obstacle.forEach(obstacle => {
                if (obstacle.element && obstacle.element.parentNode) {
                    obstacle.element.remove();
                }
            });
            
            this.storeData(this.player.name, this.years);
            this.outputScore();
        } catch (error) {
            console.error('Game over error:', error);
            this.showError('Game ended with an error.');
        }

    }

    // outputScore and storeData methods remain largely the same.
    outputScore() {
        // Check if local storage has the data you want to display
        if (localStorage.getItem('userData')) {

            let highscoreList = document.getElementById('highscore')
            highscoreList.innerHTML="";

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
            if (typeof (Storage) === 'undefined') {
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
