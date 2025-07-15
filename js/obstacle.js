import { GameConfig } from './config.js';

export default class Obstacle {
    constructor(gameScreen, left, top, height) {
        this.gameScreen = gameScreen;
        this.left = left;
        this.top = top;
        // Use provided height, or default from config if not provided (though current Game.js always provides it)
        this.height = height || GameConfig.OBSTACLE_DEFAULT_HEIGHT; 
        // Assuming obstacle width is same as height, unless specified otherwise in config
        this.width = this.height; 
        this.element = document.createElement('img');

        this.element.src = "images/Obstacle_Robo_Future.png"; // Could be a config constant

        this.element.style.position = 'absolute';
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.width = `${this.width}px`;

        this.gameScreen.appendChild(this.element);
    }

    moveLeft() {
        this.left -= GameConfig.OBSTACLE_MOVE_SPEED;
        this.element.style.left = `${this.left}px`;
    }
}