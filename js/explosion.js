import { GameConfig } from './config.js';

export default class Explosion {
    constructor(gameScreen, left, top) {
        this.element = document.createElement('img');

        this.element.src = "images/Colision_Explosion.gif"; // Could be a config constant
        this.element.style.position = 'absolute';
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
        this.element.style.height = `${GameConfig.EXPLOSION_HEIGHT}px`;
        this.element.style.width = `${GameConfig.EXPLOSION_WIDTH}px`;
        
        gameScreen.appendChild(this.element);
    
        setTimeout(() => {
           if (this.element.parentNode) { // Check if still in DOM
               this.element.remove();
           }
        }, GameConfig.EXPLOSION_DURATION);
    }
}