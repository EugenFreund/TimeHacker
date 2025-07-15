export class GameDialog {
  constructor(dialogSections, dialogElement, callback) {
    this.dialogElement = dialogElement;
    this.dialogSections = dialogSections;
    this.currentSectionIndex = 0;
    this.currentTextIndex = 0;
    this.dialogBoxElement = document.createElement('div');

    this.dialogBoxElement.classList.add('dialog-box');

    this.dialogText = document.createElement('p');
    this.dialogText.classList.add('dialog-text');

    this.continueText = document.createElement('p');
    this.continueText.innerText = 'Press Enter to Continue';
    this.continueText.classList.add('continue-text', 'hidden');

    this.dialogBoxElement.appendChild(this.dialogText);
    this.dialogBoxElement.appendChild(this.continueText);

    this.dialogElement.appendChild(this.dialogBoxElement);

    this.callback = callback;
  }

  typeText() {
    if (
      this.currentTextIndex <
      this.dialogSections[this.currentSectionIndex].length
    ) {
      this.dialogText.textContent += this.dialogSections[
        this.currentSectionIndex
      ].charAt(this.currentTextIndex);
      this.currentTextIndex++;
      // this.typeText();
      setTimeout(() => this.typeText(), 50);
    } else {
      this.continueText.classList.remove('hidden');
      document.addEventListener(
        'keydown',
        event => this.handleKeyPress(event),
        { once: true }
      );
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.continueText.classList.add('hidden');
      this.currentTextIndex = 0;
      this.dialogText.textContent = '';
      this.currentSectionIndex++;

      if (this.currentSectionIndex < this.dialogSections.length) {
        this.typeText();
      } else {
        this.dialogBoxElement.remove();
        this.callback();
      }
    }
  }
}
