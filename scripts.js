document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById("startButton");
  const submitButton = document.getElementById("submitButton");
  const message = document.getElementById("message");

  const nameInputs = Array.from(document.querySelectorAll('.name-input'));

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // initialize pickers for each name input
  nameInputs.forEach((input) => {
    const picker = input.parentElement.querySelector('.picker');

    // If picker is a select, populate it with A-Z options
    if (picker && picker.tagName === 'SELECT') {
      picker.innerHTML = letters.map(l => `<option value="${l}">${l}</option>`).join('');
      picker.selectedIndex = 0;
    }

    // Click input to append selected letter (from select or fallback)
    input.addEventListener('click', () => {
      let letter = letters[0];
      if (picker && picker.tagName === 'SELECT') letter = picker.value;
      else letter = letters[parseInt(input.dataset.letterIndex || '0', 10)];
      input.value = (input.value || '') + letter;
    });

    // Click picker to insert as well (use change/click)
    if (picker && picker.tagName === 'SELECT') {
      picker.addEventListener('click', () => {
        const letter = picker.value;
        input.value = (input.value || '') + letter;
      });
    }

    // Right-click (contextmenu) to delete last character
    input.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      input.value = (input.value || '').slice(0, -1);
    });
  });

  if (!startButton || !submitButton || !message) {
    console.error('Missing element(s):', { startButton, submitButton, message });
    return;
  }

  // button runs away (keeps mostly on-screen)
  startButton.addEventListener("mouseover", () => {
    const maxX = Math.max(0, window.innerWidth - startButton.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - startButton.offsetHeight);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    startButton.style.position = "absolute";
    startButton.style.left = x + "px";
    startButton.style.top = y + "px";
  });

  // useless form submit: shuffle letters in name fields and show a response
  submitButton.addEventListener("click", () => {
    // shuffle each name input's letters
    nameInputs.forEach((input) => {
      const val = (input.value || '');
      if (val.length <= 1) return;
      const arr = val.split('');
      // Fisher-Yates
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      input.value = arr.join('');
    });

    const responses = [
      "Form rejected",
      "Please try again later",
      "Error: Unknown success",
      "Submission accepted but ignored",
      "You forgot something important"
    ];
    const r = responses[Math.floor(Math.random() * responses.length)];
    message.innerText = r;
  });
});