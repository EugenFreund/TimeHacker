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
        this.heightSrore = [];
        this.years = 3;
    }

    start() {
        this.startScreen.style.display = 'none';
        this.gameEndScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
        
        this.gameScreen.style.width =  "1200px"
        this.gameScreen.style.height = "800px"

        this.gameLoop()
    }

    gameLoop() {
        if(this.player.lives < 1 ) {
            this.gameOver();
        } else {
            this.update()

            if(this.animatedId % 10 === 0 ) {
                this.yearsHacked()
            }
    
            if (this.animatedId % 100 === 0) {
                this.obstacle.push(new Obstacle(
                    this.gameScreen,
                    this.gameScreen.clientWidth + 240, // 240px out of the screen bc the 
                    Math.random() * (this.gameScreen.clientHeight - 360) + 230,
                    150))
            }
            this.animatedId = requestAnimationFrame(() => this.gameLoop())
        }
    }

    update() {
        const nextObstacles = [];

        this.obstacle.forEach( obstacle => {
            obstacle.moveLeft();
            if(this.player.didCollide(obstacle)) {
                new Explosion(
                    this.gameScreen, 
                    obstacle.left, 
                    obstacle.top - obstacle.height /2);
                obstacle.element.remove();
                
                if(this.years > 100){
                    this.years -=100;
                } else {
                    this.years = 0;
                }
                this.player.lives -= 1;

            } else if( obstacle.left < 0 - obstacle.width){
                this.years += 100;
                obstacle.element.remove();
            } else {
                nextObstacles.push(obstacle)
            }
            
        });

        this.obstacle = nextObstacles;
    }

    yearsHacked() {
        let years = document.getElementById('years')
        years.innerHTML = this.years +=1;
    }

    gameOver() {
        this.startScreen.style.display = 'none';
        this.gameEndScreen.style.display = 'block';
        this.gameScreen.style.display = 'none';

        this.obstacle.forEach( obstacle => obstacle.element.remove())
        this.storeData('Eugen', 10);
        this.outputScore();
        
    }

    outputScore() {
        // Check if session storage has the data you want to display
        if (sessionStorage.getItem('userData')) {

            let highscoreList = document.getElementById('highscore')
            highscoreList.innerHTML="";

            // Parse the data from session storage
            const data = JSON.parse(sessionStorage.getItem('userData'));

            // Create an unordered list element
            const ul = document.createElement('ul');

            // Limit the number of items to 5
            const maxItems = Math.min(5, data.length);

            // Loop through the data and create list items
            for (let i = 0; i < maxItems; i++) {
                const li = document.createElement('li');
                // Access the 'Name' and 'Score' properties and set them as the list item's text
                li.textContent = `${data[i].Name} _____ ${data[i].Score} Years`;
                ul.appendChild(li); // Add the list item to the unordered list
            }

            // Add the unordered list to your HTML document
            
            highscoreList.appendChild(ul);
        }
    }

    // Function to store data in session storage
    storeData(name, score) {
        // Check if session storage is supported by the browser
        if (typeof (Storage) !== 'undefined') {
            // Check if there's existing data in session storage
            let existingData = JSON.parse(sessionStorage.getItem('userData')) || [];

            // Create a new object with the provided Name and score
            const newData = { Name: name, Score: score };

            // Add the new data to the existing data array
            existingData.push(newData);

            existingData.sort((a,b) => {
                if( a.Score < b.Score) {
                    return 1
                } else {
                    return -1
                }
            })

            if (existingData.length > 5){
                existingData = existingData.slice(0, 5);
            }

            // Store the updated data back in session storage
            sessionStorage.setItem('userData', JSON.stringify(existingData));

            console.log('Data stored successfully');
        } else {
            console.log('Session storage is not supported by this browser.');
        }
    }
  
}