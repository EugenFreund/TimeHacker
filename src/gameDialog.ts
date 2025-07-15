export class GameDialog {
  constructor(dialogSections, dialogElement, callback) {
    this.dialogElement = dialogElement;
    this.dialogSections = dialogSections;
    this.currentSectionIndex = 0;
    this.currentTextIndex = 0;
    this.isTyping = false;
    this.timeoutId = null;
    this.dialogBoxElement = document.createElement('div');

    this.dialogBoxElement.classList.add('dialog-box');

    this.dialogText = document.createElement('p');
    this.dialogText.classList.add('dialog-text');

    this.continueText = document.createElement('p');
    this.continueText.innerText = 'Press Enter to Continue or Speed Up';
    this.continueText.classList.add('continue-text', 'hidden');

    this.dialogBoxElement.appendChild(this.dialogText);
    this.dialogBoxElement.appendChild(this.continueText);

    this.dialogElement.appendChild(this.dialogBoxElement);

    this.callback = callback;

    // Add event listener for speed printing during typing
    this.boundHandleSpeedPrint = this.handleSpeedPrint.bind(this);
    document.addEventListener('keydown', this.boundHandleSpeedPrint);
  }

  typeText() {
    this.isTyping = true;
    this.continueText.classList.remove('hidden'); // Show hint from start

    if (
      this.currentTextIndex <
      this.dialogSections[this.currentSectionIndex].length
    ) {
      this.dialogText.textContent += this.dialogSections[
        this.currentSectionIndex
      ].charAt(this.currentTextIndex);
      this.currentTextIndex++;

      // Store timeout ID so we can cancel it for speed printing
      this.timeoutId = setTimeout(() => this.typeText(), 50);
    } else {
      this.completeCurrentSection();
    }
  }

  completeCurrentSection() {
    this.isTyping = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Ensure full text is displayed
    this.dialogText.textContent = this.dialogSections[this.currentSectionIndex];
    this.currentTextIndex =
      this.dialogSections[this.currentSectionIndex].length;

    // Update continue text for completed section
    this.continueText.innerText = 'Press Enter to Continue';

    // Wait for Enter to continue to next section
    document.addEventListener('keydown', event => this.handleKeyPress(event), {
      once: true,
    });
  }

  handleSpeedPrint(event) {
    // Only handle Enter key during typing
    if (event.key === 'Enter' && this.isTyping) {
      event.preventDefault();
      this.completeCurrentSection();
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.continueText.classList.add('hidden');
      this.currentTextIndex = 0;
      this.dialogText.textContent = '';
      this.currentSectionIndex++;

      if (this.currentSectionIndex < this.dialogSections.length) {
        // Reset continue text for next section
        this.continueText.innerText = 'Press Enter to Continue or Speed Up';
        this.typeText();
      } else {
        this.cleanup();
        this.dialogBoxElement.remove();
        this.callback();
      }
    }
  }

  cleanup() {
    // Remove event listener to prevent memory leaks
    document.removeEventListener('keydown', this.boundHandleSpeedPrint);

    // Clear any pending timeouts
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
