// js/config.js
export const GameConfig = {
    // Player Constants
    PLAYER_INITIAL_LIVES: 3,
    PLAYER_INVINCIBILITY_DURATION: 5000, // ms
    PLAYER_FLASH_INTERVAL: 200, // ms for invincibility flashing
    // Player Movement Constants (from Player.js)
    PLAYER_MOVE_UP_TOP_DECREMENT: 10,
    PLAYER_MOVE_UP_LEFT_INCREMENT: 8,
    PLAYER_MOVE_UP_HEIGHT_DECREMENT: 2,
    PLAYER_MOVE_DOWN_TOP_INCREMENT: 10,
    PLAYER_MOVE_DOWN_LEFT_DECREMENT: 8,
    PLAYER_MOVE_DOWN_HEIGHT_INCREMENT: 2,
    PLAYER_MAX_LEFT_MOVE_UP: 270, // Boundary for moving up (player.left < 270)
    PLAYER_MIN_LEFT_MOVE_DOWN: 20,   // Boundary for moving down (player.left > 20)
    PLAYER_DEFAULT_WIDTH_FACTOR: 2 / 3, // height * (2/3) for width

    // Obstacle Constants
    OBSTACLE_SPAWN_INTERVAL: 1500, // ms
    OBSTACLE_MOVE_SPEED: 9, // pixels per update call (effective speed depends on FPS or usage with deltaTime)
    OBSTACLE_DEFAULT_HEIGHT: 150, // pixels
    // OBSTACLE_DEFAULT_WIDTH: 150, // Assuming square obstacles if not defined by height factor like player

    // PowerUp Constants
    // POWERUP_SPAWN_CHANCE: 0.005, // Chance per game loop if frame-based (REPLACED by time-based interval)
    POWERUP_SPAWN_INTERVAL: 7000, // ms, e.g., spawn a power-up every 7 seconds
    POWERUP_MOVE_SPEED: 5, // pixels per update call
    POWERUP_WIDTH: 30, 
    POWERUP_HEIGHT: 30,
    POWERUP_IMAGE_SRC: 'images/favicon.ico', // Placeholder image

    // Score Constants
    SCORE_UPDATE_INTERVAL: 100, // ms, for periodic score increase
    SCORE_INCREMENT_PER_INTERVAL: 1, // points (years) per interval
    SCORE_PENALTY_OBSTACLE_COLLISION: 100, // points deducted
    SCORE_REWARD_OBSTACLE_PASSED: 100, // points for obstacle successfully passed

    // Game Constants
    GAME_WIDTH: 1200, // pixels
    GAME_HEIGHT: 800, // pixels
    GAME_OBSTACLE_OFFSCREEN_SPAWN_OFFSET: 240, // How far off screen obstacles spawn
    GAME_POWERUP_OFFSCREEN_SPAWN_OFFSET: 60, // How far off screen powerups spawn
    GAME_OBSTACLE_RANDOM_Y_MAX_OFFSET: 360, // Max Y offset for obstacle spawning (gameScreen.clientHeight - THIS_VALUE)
    GAME_OBSTACLE_RANDOM_Y_MIN_OFFSET: 230, // Min Y offset for obstacle spawning
    GAME_POWERUP_RANDOM_Y_MAX_OFFSET: 150, // Max Y offset for powerup spawning
    GAME_POWERUP_RANDOM_Y_MIN_OFFSET: 75,   // Min Y offset for powerup spawning


    // Explosion Constants
    EXPLOSION_DURATION: 1000, // ms
    EXPLOSION_WIDTH: 250, // px
    EXPLOSION_HEIGHT: 250, // px

    // UI related
    LIVE_BAR_FULL_PERCENTAGE: 100, // For resetting live bar
};
