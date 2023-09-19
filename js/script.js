window.addEventListener('load', () => {
  const startRadioButton = document.querySelector(".confirm");
  const restartButton = document.getElementById("restart-button");

  let game;
  game = new Game();

  function startGame(e) {

    var target = e.target,
      input = target.parentNode.previousElementSibling;

    // input.checked = true;

    setTimeout(function () {
      if (input.value === 'yes') {
        console.log('start game')
        game.start();
      } else {
        abort();
      }
    }, 200);
  }

  startRadioButton.addEventListener("click", startGame);

  document.addEventListener('keydown', (event) => {
    if(event.key === "ArrowUp") {
      game.player.moveUp();
    } else if (event.key === "ArrowDown") {
      game.player.moveDown();
    } 

  })

  document.addEventListener('keyup', (event) => {
    if(event.key === "ArrowUp" || event.key === "ArrowDown") {
      game.player.stopMove();
    }
  })

})

