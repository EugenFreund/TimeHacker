import { GameConfig } from './config.js';

export default class Player {
  constructor(gameScreen, left, top, height) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.height = height;
    this.width = height * GameConfig.PLAYER_DEFAULT_WIDTH_FACTOR;
    this.lives = GameConfig.PLAYER_INITIAL_LIVES;
    this.element = document.createElement('img');

    this.element.src = "images/Player_KungFury.png"; // Player image can also be a config const

    this.element.style.position = 'absolute';
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.width = `${this.width}px`;

    this.gameScreen.appendChild(this.element);
    
    this.name = "";

    // Invincibility properties
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.invincibilityDuration = GameConfig.PLAYER_INVINCIBILITY_DURATION;
    this.flashIntervalId = null; // Renamed from flashInterval to avoid confusion with setInterval itself
  }

  activateInvincibility() {
    this.isInvincible = true;
    this.invincibilityTimer = this.invincibilityDuration;
    
    let isVisible = true;
    this.element.style.opacity = '1'; 
    if (this.flashIntervalId) {
      clearInterval(this.flashIntervalId);
    }
    this.flashIntervalId = setInterval(() => {
        isVisible = !isVisible;
        this.element.style.opacity = isVisible ? '0.5' : '1';
    }, GameConfig.PLAYER_FLASH_INTERVAL);

    // console.log("Invincibility Activated!"); // Optional: for debugging
  }

  updateInvincibility(deltaTime) { 
    if (this.isInvincible) {
        this.invincibilityTimer -= deltaTime;
        if (this.invincibilityTimer <= 0) {
            this.isInvincible = false;
            this.invincibilityTimer = 0;
            if (this.flashIntervalId) {
              clearInterval(this.flashIntervalId);
              this.flashIntervalId = null; 
            }
            this.element.style.opacity = '1'; 
            // console.log("Invincibility Deactivated!"); // Optional: for debugging
        }
    }
  }

  moveUp() {
    if (this.left < GameConfig.PLAYER_MAX_LEFT_MOVE_UP) {
      this.top -= GameConfig.PLAYER_MOVE_UP_TOP_DECREMENT;
      this.element.style.top = `${this.top}px`;
      this.left += GameConfig.PLAYER_MOVE_UP_LEFT_INCREMENT;
      this.element.style.left = `${this.left}px`;
      this.height -= GameConfig.PLAYER_MOVE_UP_HEIGHT_DECREMENT;
      this.element.style.height = `${this.height}px`;
      this.width = this.height * GameConfig.PLAYER_DEFAULT_WIDTH_FACTOR;
      this.element.style.width = `${this.width}px`;
      this.element.src = "images/Player_KungFury_moveUp.png"; // Could be config
    }
  }

  moveDown() {
    if (this.left > GameConfig.PLAYER_MIN_LEFT_MOVE_DOWN) {
      this.top += GameConfig.PLAYER_MOVE_DOWN_TOP_INCREMENT;
      this.element.style.top = `${this.top}px`;
      this.left -= GameConfig.PLAYER_MOVE_DOWN_LEFT_DECREMENT;
      this.element.style.left = `${this.left}px`;
      this.height += GameConfig.PLAYER_MOVE_DOWN_HEIGHT_INCREMENT;
      this.element.style.height = `${this.height}px`;
      this.width = this.height * GameConfig.PLAYER_DEFAULT_WIDTH_FACTOR;
      this.element.style.width = `${this.width}px`;
      this.element.src = "images/Player_KungFury_moveDown.png"; // Could be config
    }
  }

  stopMove() {
    this.element.src = "images/Player_KungFury.png"; // Could be config
  }

  didCollide(item) { 
    if (this.isInvincible && item.constructor.name !== 'PowerUp') { 
        return false;
    }
    
    const playerRect = this.element.getBoundingClientRect();
    const itemRect = item.element.getBoundingClientRect(); 

    if (
      playerRect.left < itemRect.right &&
      playerRect.right > itemRect.left &&
      playerRect.top < itemRect.bottom &&
      playerRect.bottom > itemRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
}