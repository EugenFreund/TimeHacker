class Game {
    // code to be added
    constructor() {
        this.startScreen = document.getElementById('game-intro');
        this.gameScreen = document.getElementById('game-screen');
        this.gameEndScreen = document.getElementById('game-end');
        // this.width = 1200;
        // this.height = 800;
        this.player = new Player(this.gameScreen,20, 620,180);
        this.obstacle = [];
        this.animatedId = 0;
        this.lives = 3
    }

    start() {
        this.startScreen.style.display = 'none';
        this.gameEndScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
        
        this.gameScreen.style.width =  "1200px"
        this.gameScreen.style.height = "800px"

        this.gameLoop()
        this.yearsHacked(1)
    }

    gameLoop () {
        this.update()

        if( this.animatedId % 100 === 0) {
            this.obstacle.push(new Obstacle(
                this.gameScreen, 
                this.gameScreen.clientWidth + 240, // 240px out of the screen bc the 
                Math.random() * (this.gameScreen.clientHeight -150) + 200 , 
                150))
        }
        this.animatedId = requestAnimationFrame(()=> this.gameLoop())
    }

    update() {
        const nextObstacles = [];
        this.obstacle.forEach( obstacle => {
            obstacle.moveLeft();
            if( this.player.didCollide(obstacle)) {
                new Explosion(
                    this.gameScreen, 
                    this.player.left + 
                    this.player.width, 
                    this.player.top - this.player.height /2);
                obstacle.element.remove();
                this.lives -= 1;
            } else if( obstacle.left < 0 - obstacle.width){
                obstacle.element.remove();
            } else {
                nextObstacles.push(obstacle)
            }
            
        });
        this.obstacle = nextObstacles;
    }

    yearsHacked(year) {
    
        let years = document.getElementById('years')
        let multiplier = year * .01;
    
        // if (years.innerHTML < 1000) {
        setTimeout( () => {
          years.innerHTML = year;
          this.yearsHacked(Math.floor(year + 1 + multiplier));
        }, 1000);
        // } else {
        //   page.className += ' uh-oh';
        //   setTimeout(abort, 3000);
        // }
    
      }
}