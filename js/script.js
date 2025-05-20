import Game from './game.js';
import GameDialog from './gameDialog.js';
import { GameState } from './gameState.js'; // Import GameState
// import { GameConfig } from './config.js'; // GameConfig can be imported if needed for default values here

window.addEventListener('load', () => {
  const startConfirmLabel = document.querySelector(".confirm"); // Label for radio button group
  const restartButton = document.querySelector("#game-end .arcade-button"); // More specific selector
  const playerNameInput = document.querySelector('#player-name-input');
  const dialogElement = document.getElementById("intro-dialog");

  // Store player name temporarily until game.player is initialized
  let tempPlayerName = "TimeHacker"; // Default player name

  const dialogSections = [
    "Embark on a mission to change the course of history.",
    "Your task is to stop the danger posed by Hitler through a time travel adventure.",
    "Journey through time to thwart the dictator's dark plans and steer the fate of humanity.",
    "Time is your weapon, and history is your battlefield. Are you ready to save the future?",
    "When I code I always put on a hip sound. If you're not cool enough for it you can press m to turn it off.",
    "Ah one more thing, what's your name? I need it for the funer.. emmmm parade after your successful mission."
  ];

  let game = new Game(); // Game instance is created. Initial state is MENU.
  let gameDialog = new GameDialog(dialogSections, dialogElement, enterNameCallback); // Renamed 'dialog' to 'gameDialog' for clarity
  
  // Start the intro dialog sequence
  gameDialog.typeText();

  // Background audio setup
  const audio = new Audio('audio/Kung_Fury_sound.mp3'); // Path to audio file
  audio.loop = true; // Loop the audio

  // Callback function after dialog finishes and prompts for name
  function enterNameCallback() {
    if (audio.paused) { // Play audio when dialog prompts for name, if not already playing
        audio.play().catch(e => console.warn("Audio play failed:", e)); // Autoplay might be blocked
    }
    playerNameInput.classList.add('active');
    playerNameInput.focus();
    playerNameInput.addEventListener('keydown', handleNameInputKeydown);
  }

  // Handles player name input and proceeds to game confirmation
  function handleNameInputKeydown(event) {
    if (event.key === "Enter") {
      tempPlayerName = event.currentTarget.value || "TimeHacker"; // Store name, use default if empty
      playerNameInput.removeEventListener('keydown', handleNameInputKeydown); // Clean up listener
      playerNameInput.classList.remove('active');
      showGameConfirmation(); // Proceed to "Are you sure?"
    }
  }

  // Shows the "Are you sure you want to start?" confirmation
  function showGameConfirmation() {
    startConfirmLabel.classList.add('active');
    // Focus management could be added here if needed, e.g., focus the "Yes" button.
  }

  // Actually starts the game after confirmation
  function actualStartGame() {
    game.start(); // Initializes player, obstacles, sets state to PLAYING, manages screens
    if (game.player) { // Player should be initialized by game.start()
        game.player.name = tempPlayerName; // Set the stored player name
    }
  }

  // Event listener for the "confirm" label (delegates to radio button clicks)
  startConfirmLabel.addEventListener("click", (event) => {
    const targetLabel = event.target.closest('label'); // Get the label clicked
    if (!targetLabel) return;

    const radioId = targetLabel.htmlFor;
    const radioInput = document.getElementById(radioId);

    if (radioInput) {
        radioInput.checked = true; // Check the radio button

        if (radioId === 'warp') { // "Yes" option
                // If the player name input has a value, update tempPlayerName.
                // This covers cases where the user types a name but clicks "Yes" without pressing Enter.
                if (playerNameInput.value.trim() !== "") {
                    tempPlayerName = playerNameInput.value.trim();
            }
                // tempPlayerName will already have a default "TimeHacker" or the value from Enter key press.

            // Adding a slight delay as in the original script
            setTimeout(function () {
                actualStartGame();
            }, 2000); // Delay before starting the game
        } else if (radioId === 'nope') { // "No" option
            console.log("Game start aborted by user.");
            // Reloading the page is a simple way to "abort" and reset the intro
            setTimeout(function () {
                window.location.reload(); 
            }, 2000);
        }
    }
  });
  
  // Event listener for the restart button on the game over screen
  restartButton.addEventListener("click", () => {
    // The Game constructor handles setting the state to MENU and managing screen visibility.
    // No need to manually change screen displays here.
    
    // Clean up the old player element if it exists and is part of the game screen
    if (game.player && game.player.element && game.player.element.parentNode === game.gameScreen) {
        game.player.element.remove();
    }
    
    game = new Game(); // Re-initialize the entire game object. State is now MENU.
    
    // Restart the intro dialog sequence
    // Ensure player name input is reset for the new dialog flow
    playerNameInput.value = ""; // Clear previous name input
    tempPlayerName = "TimeHacker"; // Reset temporary name storage
    gameDialog = new GameDialog(dialogSections, dialogElement, enterNameCallback);
    gameDialog.typeText(); 
  });

  // Player movement keydown listener
  document.addEventListener('keydown', (event) => {
    // Only allow player movement if the game is in PLAYING state and player exists
    if (game.currentState === GameState.PLAYING && game.player) {
      if (event.key === "ArrowUp") {
        game.player.moveUp();
      } else if (event.key === "ArrowDown") {
        game.player.moveDown();
      }
    }
  });

  // Player movement keyup listener and audio toggle
  document.addEventListener('keyup', (event) => {
    // Stop player movement only if game is PLAYING and player exists
    if (game.currentState === GameState.PLAYING && game.player) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        game.player.stopMove();
      }
    }

    // Audio toggle with 'm' key, works regardless of game state
    if (event.key === "m") {
      if (audio.paused) {
        audio.play().catch(e => console.warn("Audio play failed:", e));
      } else {
        audio.pause();
      }
    }
  });
});
