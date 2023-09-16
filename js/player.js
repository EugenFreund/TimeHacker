class Player {
    constructor(gameScreen, left, top, height) {
      this.gameScreen = gameScreen
      this.left = left
      this.top = top
      this.height = height
      this.width = height * 2/3
      this.directionX = 0
      this.directionY = 0
      this.element = document.createElement('img')
  
      this.element.src = "../images/Player_KungFury.png"
  
      this.element.style.position = 'absolute'
      this.element.style.left = `${this.left}px`
      this.element.style.top = `${this.top}px`
      this.element.style.height = `${this.height}px`
      this.element.style.width = `${this.width}px`
  
      this.gameScreen.appendChild(this.element)
    } 
  }