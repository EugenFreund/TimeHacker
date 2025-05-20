import { GameConfig } from './config.js';

export default class PowerUp {
    constructor(gameScreen, left, top) { // Width, height, imgSrc are now from config
        this.gameScreen = gameScreen;
        this.left = left;
        this.top = top;
        this.width = GameConfig.POWERUP_WIDTH;
        this.height = GameConfig.POWERUP_HEIGHT;
        this.imgSrc = GameConfig.POWERUP_IMAGE_SRC;

        this.element = document.createElement('img');
        this.element.src = this.imgSrc;
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.zIndex = '10'; // Ensure it's visible

        this.gameScreen.appendChild(this.element);
    }

    move() {
        // Power-ups move left
        this.left -= GameConfig.POWERUP_MOVE_SPEED;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
    }

    remove() {
        if (this.element.parentNode) {
            this.element.remove();
        }
    }
}
