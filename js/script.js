window.addEventListener('load', () => {
  const startRadioButton = document.querySelector(".confirm");
  const restartButton = document.querySelector(".arcade-button");
  const playerNameInput = document.querySelector('#player-name-input');

  const dialogSections = [
    "Embark on a mission to change the course of history.",
    "Your task is to stop the danger posed by Hitler through a time travel adventure.",
    "Journey through time to thwart the dictator's dark plans and steer the fate of humanity.",
    "Time is your weapon, and history is your battlefield. Are you ready to save the future?",
    "When I code I always put on a hip sound. If you're not cool enough for it you can press m to turn it off.",
    "Ah one more thing, what's your name? I need it for the funer.. emmmm parade after your successful mission."
  ];

  let game = new Game();
  const dialogElement = document.getElementById("intro-dialog");

  let dialog = new GameDialog(dialogSections, dialogElement, enterName);
  dialog.typeText();

  var audio = new Audio('audio/Kung_Fury_sound.mp3');

  
  function enterName () {
    audio.play();
    playerNameInput.classList.add('active');
    document.getElementById("player-name-input").focus()
    playerNameInput.addEventListener('keydown', f = (event) => {
      if(event.key === "Enter"){
        game.player.name = event.currentTarget.value;
        playerNameInput.removeEventListener('keydown', f)
        playerNameInput.classList.remove('active');
        confirmeGame();
      }
    })
  }

  function confirmeGame () {
    startRadioButton.classList.add('active');
  }

  function restartGame() {
    game.player.element.remove()
    game = new Game();
    game.start();
  }

  function startGame(e) {

    let target = e.target
    let input = target.parentNode.previousElementSibling;

    input.checked = true;

    setTimeout(function () {
      if (input.value === 'yes') {
        game.start();
      } else {
        abort();
      }
    }, 2000);
  }

  startRadioButton.addEventListener("click", (event) => {
    if (event.target.parentNode.localName === "label") {
      startGame(event)
    }
  });

  restartButton.addEventListener("click", (event) => {
    restartGame();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp") {
      game.player.moveUp();
    } else if (event.key === "ArrowDown") {
      game.player.moveDown();
    }

  })

  document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      game.player.stopMove();
    }
  })

  document.addEventListener('keyup', (event) => {
    if (event.key === "m") {
      if(audio.paused === true){
        audio.play();
      }else {
        audio.pause();
      }
    }
  })

})

