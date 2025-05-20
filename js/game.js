import { GameState } from './gameState.js';
import Player from './player.js';
import Obstacle from './obstacle.js';
import Explosion from './explosion.js';
import PowerUp from './powerup.js';
import { GameConfig } from './config.js'; // Import GameConfig

export default class Game {
    constructor() {
        this.startScreen = document.getElementById('game-intro');
        this.gameScreen = document.getElementById('game-screen');
        this.gameEndScreen = document.getElementById('game-end');
        
        this.player = null; 
        this.obstacle = [];
        this.powerUps = []; 
        // this.powerUpSpawnChance = GameConfig.POWERUP_SPAWN_CHANCE; // Removed, replaced by time-based spawning
        this.years = 0;
        this.lastTime = 0; 
        this.animationFrameId = null; 

        // Timers and Intervals for game logic
        this.obstacleSpawnTimer = 0;
        this.obstacleSpawnInterval = GameConfig.OBSTACLE_SPAWN_INTERVAL;
        this.scoreUpdateTimer = 0;
        this.scoreUpdateInterval = GameConfig.SCORE_UPDATE_INTERVAL;
        this.powerUpSpawnTimer = 0; // Added for time-based power-up spawning
        
        this.currentState = GameState.MENU;
        this._manageScreenVisibility();

        // Start the game loop. It will call itself recursively.
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    _manageScreenVisibility() {
        this.startScreen.style.display = (this.currentState === GameState.MENU) ? 'block' : 'none';
        this.gameScreen.style.display = (this.currentState === GameState.PLAYING) ? 'block' : 'none';
        this.gameEndScreen.style.display = (this.currentState === GameState.GAME_OVER) ? 'block' : 'none';
    }

    _resetGameParameters() {
        // Clear existing obstacles from the screen and array
        this.obstacle.forEach(obs => { 
            if (obs.element && obs.element.parentNode) {
                obs.element.remove();
            }
        });
        this.obstacle = [];

        // Remove old player element if it exists
        if (this.player && this.player.element && this.player.element.parentNode) {
            this.player.element.remove();
        }
        
        // Initialize player. The Player constructor adds its element to gameScreen.
        this.player = new Player(this.gameScreen, 20, 620, 180); 
        
        // Reset game parameters
        this.years = 0;
        // Player lives are initialized in the Player constructor using GameConfig.PLAYER_INITIAL_LIVES
        document.getElementById('years').innerHTML = this.years; // Update UI
        document.documentElement.style.setProperty('--liveBar', `${GameConfig.LIVE_BAR_FULL_PERCENTAGE}%`);

        this.lastTime = 0; // Reset lastTime for deltaTime calculation
        this.obstacleSpawnTimer = 0; // Reset timers
        this.scoreUpdateTimer = 0;
        this.powerUpSpawnTimer = 0; // Reset power-up spawn timer

        // Clear existing power-ups
        this.powerUps.forEach(p => p.remove());
        this.powerUps = [];

        // Reset player invincibility visual state if game is restarted mid-invincibility
        if (this.player && this.player.isInvincible) {
            this.player.isInvincible = false;
            if (this.player.flashIntervalId) { // Corrected to flashIntervalId
                 clearInterval(this.player.flashIntervalId);
                 this.player.flashIntervalId = null; 
            }
            if (this.player.element) { 
                this.player.element.style.opacity = '1';
            }
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

            this.powerUps.push(new PowerUp(
                this.gameScreen,
                // Start off-screen to the right, using GAME_POWERUP_OFFSCREEN_SPAWN_OFFSET for consistency
                this.gameScreen.clientWidth + GameConfig.GAME_POWERUP_OFFSCREEN_SPAWN_OFFSET, 
                // Random Y position, ensuring it's fully visible using configured offsets
                Math.random() * (this.gameScreen.clientHeight - GameConfig.GAME_POWERUP_RANDOM_Y_MAX_OFFSET) + GameConfig.GAME_POWERUP_RANDOM_Y_MIN_OFFSET
                // PowerUp constructor gets width, height, imgSrc from GameConfig
            ));
            // console.log("PowerUp spawned by timer"); // For debugging
        }

        // Move and check collisions for existing power-ups
        const nextPowerUps = [];
        this.powerUps.forEach(powerUp => {
            powerUp.move(); 
            if (this.player && this.player.didCollide(powerUp)) { // Ensure player exists before checking collision
                powerUp.remove();
                this.player.activateInvincibility(); 
            } else if (powerUp.left < 0 - powerUp.width) { 
                powerUp.remove();
            } else {
                nextPowerUps.push(powerUp);
            }
        });
        this.powerUps = nextPowerUps;
    }

    // Old update() method is removed as its logic is now in updateGameElements and handleCollisions.
    // Old yearsHacked() method is removed as its logic is now in updateScoreAndLives.

    gameOver() { // This method remains, called by updateScoreAndLives or gameLoop
        this.currentState = GameState.GAME_OVER;
        this._manageScreenVisibility();

        // Store score. Ensure player and player.name exist.
        if (this.player && typeof this.player.name !== 'undefined') { 
             this.storeData(this.player.name, this.years);
        } else {
            // Fallback name if player or player.name is not set
            this.storeData("TimeWarrior", this.years); 
        }
        this.outputScore(); // Display high scores on the game over screen
    }

    // outputScore and storeData methods remain largely the same.
    outputScore() {
        // Check if session storage has the data you want to display
        if (sessionStorage.getItem('userData')) {

            let highscoreList = document.getElementById('highscore')
            highscoreList.innerHTML="";

            // Parse the data from session storage
            const data = JSON.parse(sessionStorage.getItem('userData'));

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

    // Function to store data in session storage
    storeData(name, score) {
        // Check if session storage is supported by the browser
        if (typeof (Storage) !== 'undefined') {
            // Check if there's existing data in session storage
            let existingData = JSON.parse(sessionStorage.getItem('userData')) || [];

            // Create a new object with the provided Name and score
            const newData = { Name: name, Score: score };

            // Add the new data to the existing data array
            existingData.push(newData);

            existingData.sort((a,b) => {
                if( a.Score < b.Score) {
                    return 1
                } else {
                    return -1
                }
            })

            if (existingData.length > 5){
                existingData = existingData.slice(0, 5);
            }

            // Store the updated data back in session storage
            sessionStorage.setItem('userData', JSON.stringify(existingData));

            console.log('Data stored successfully');
        } else {
            console.log('Session storage is not supported by this browser.');
        }
    }
  
}