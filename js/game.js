class Game {
    // code to be added
    constructor() {
        this.startScreen = document.getElementById('game-intro');
        this.gameScreen = document.getElementById('game-screen');
        this.gameEndScreen = document.getElementById('game-end');
        this.width = 1200;
        this.height = 800;
        this.player = new Player(this.gameScreen,0,550,220)
        // this.player = new Player(this.gameScreen,230,250,200)
    }

    start() {
        this.startScreen.style.display = 'none';
        this.gameEndScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';

        this.gameScreen.style.width =  `${this.width}px`
        this.gameScreen.style.height = `${this.height}px`

        this.gameLoop()

        
    }

    gameLoop () {
        this.update()

        requestAnimationFrame(()=> this.gameLoop())
    }

    update() {
        console.log("running");
    }
}