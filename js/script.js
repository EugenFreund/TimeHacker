window.addEventListener('load', () => {
  const startRadioButton = document.querySelector(".confirm");
  const restartButton = document.getElementById("restart-button");

  let game;
  game = new Game();

  function startGame(e) {

    console.log(e)
    e.preventDefault();

    var target = e.target,
      input = target.parentNode.previousElementSibling;

    input.checked = true;

    setTimeout(function () {
      if (input.value === 'yes') {
        console.log('start game')
        game.start();
      } else {
        abort();
      }
    }, 2500);




  }

  startRadioButton.addEventListener("click", startGame);

})

