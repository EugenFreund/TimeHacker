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

        if( this.animatedId % 50 === 0) {
            this.obstacle.push(new Obstacle(
                this.gameScreen, 
                this.gameScreen.clientWidth + 240, // 240px out of the screen bc the 
                Math.random() * (this.gameScreen.clientHeight -150) + 200 , 
                150))
            console.log(this.obstacle)
        }
        this.animatedId = requestAnimationFrame(()=> this.gameLoop())
    }

    update() {
        this.obstacle.forEach( obstacle => {
            if( obstacle.left < 0 - obstacle.width){
                this.obstacle.shift();
            }
            obstacle.moveLeft();
            
        });
        console.log("running");
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