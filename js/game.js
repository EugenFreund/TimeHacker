class Game {
    // code to be added
    constructor() {
        this.startScreen = document.getElementById('game-intro');
        this.gameScreen = document.getElementById('game-screen');
        this.gameEndScreen = document.getElementById('game-end');
    }

    start() {
        this.startScreen.style.display = 'none';
        this.gameEndScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';

        this.gameScreen.style.width = "1200px";
        this.gameScreen.style.height = "800px";

        this.gameLoop()
    }

    gameLoop () {
        this.update()

        requestAnimationFrame(()=> this.gameLoop())
    }

    update() {
        console.log("running")
    }
}