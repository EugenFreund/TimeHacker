window.addEventListener('load', () => {
  const startRadioButton = document.querySelector(".inner");
  const restartButton = document.querySelector(".arcade-button");

  let game =  new Game();

  function restartGame (){
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
})

