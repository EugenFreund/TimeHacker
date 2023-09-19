class Obstacle {
    constructor(gameScreen, left, top, height) {
        this.gameScreen = gameScreen
        this.left = left
        this.top = top
        this.height = height
        this.width = height
        this.element = document.createElement('img')
    
        this.element.src = "images/Obstacle_Robo_Future.png"
    
        this.element.style.position = 'absolute'
        this.element.style.left = `${this.left}px`
        this.element.style.top = `${this.top}px`
        this.element.style.height = `${this.height}px`
        this.element.style.width = `${this.width}px`
    
        this.gameScreen.appendChild(this.element)
    }

    moveLeft() {
        this.left -= 9;
        this.element.style.left = `${this.left}px`;
      }
}