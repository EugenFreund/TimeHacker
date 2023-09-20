class Explosion {
    constructor(gameScreen, left, top) {
        this.element = document.createElement('img')

        this.element.src = "images/Colision_Explosion.gif"
        this.element.style.position = 'absolute'
        //this.explosion.style.left = `${playerRect.right}px`
        //this.explosion.style.top = `${playerRect.top}px`
        this.element.style.left = `${left}px`
        this.element.style.top = `${top}px`
        this.element.style.height = "250px"
        this.element.style.width = "250px"
        
        gameScreen.appendChild(this.element)
    
        setTimeout(() => {
           this.element.remove()
        }, 1000)
    }
}