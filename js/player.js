class Player {
  constructor(gameScreen, left, top, height) {
    this.gameScreen = gameScreen
    this.left = left
    this.top = top
    this.height = height
    this.width = height * 2 / 3
    this.element = document.createElement('img')

    this.element.src = "images/Player_KungFury.png"

    this.element.style.position = 'absolute'
    this.element.style.left = `${this.left}px`
    this.element.style.top = `${this.top}px`
    this.element.style.height = `${this.height}px`
    this.element.style.width = `${this.width}px`

    this.gameScreen.appendChild(this.element)
  }

  moveUp() {
    if (this.left < 270) {
      this.top -= 10;
      this.element.style.top = `${this.top}px`;
      this.left += 8;
      this.element.style.left = `${this.left}px`;
      this.height -= 2;
      this.element.style.height = `${this.height}px`
      this.width = this.height * 2 / 3
      this.element.style.width = `${this.width}px`
      this.element.src = "images/Player_KungFury_moveUp.png";
    }
  }

  moveDown() {
    if (this.left > 20) {
      this.top += 10;
      this.element.style.top = `${this.top}px`;
      this.left -= 8;
      this.element.style.left = `${this.left}px`;
      this.height += 2;
      this.element.style.height = `${this.height}px`
      this.width = this.height * 2 / 3
      this.element.style.width = `${this.width}px`
      this.element.src = "images/Player_KungFury_moveDown.png";
    }
  }

  stopMove() {
    this.element.src = "images/Player_KungFury.png"
  }

  didCollide(obstacle) {
    const playerRect = this.element.getBoundingClientRect()
    const obstacleRect = obstacle.element.getBoundingClientRect()

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      return true
    } else {
      return false
    }
  }
}