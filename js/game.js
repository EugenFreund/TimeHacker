class Game {
    // code to be added
    constructor() {
        this.startScreen = document.getElementById('game-intro');
        this.gameScreen = document.getElementById('game-screen');
        this.gameEndScreen = document.getElementById('game-end');
        // this.width = 1200;
        // this.height = 800;
        this.player = new Player(this.gameScreen,0,550,200);
        this.obstacle = [new Obstacle(
            this.gameScreen, 
            1200 + 200,
             550, 
             240
             )];
        // this.player = new Player(this.gameScreen,230,250,200)
    }

    start() {
        this.startScreen.style.display = 'none';
        this.gameEndScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
        
        this.gameScreen.style.width =  "100vw"
        this.gameScreen.style.height = "100vh"

        

        this.gameLoop()

        
    }

    gameLoop () {
        this.update()

        requestAnimationFrame(()=> this.gameLoop())
    }

    update() {
        this.obstacle.forEach( obstacle => {
            if( obstacle.left < 0 - obstacle.width){
                obstacle.left = 1200 + 200;
            }
            obstacle.moveLeft();
            
        });
        console.log("running");
    }
}