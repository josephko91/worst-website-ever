document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById("startButton");
  const submitButton = document.getElementById("submitButton");
  const message = document.getElementById("message");

  const nameInputs = Array.from(document.querySelectorAll('.name-input'));

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // initialize pickers for each name input
  nameInputs.forEach((input) => {
    const picker = input.parentElement.querySelector('.picker');


    // Focus handling: mark active on focus, remove on blur and set a short-lived
    // flag so a subsequent select change (which blurs the input) can still
    // append the chosen letter.
    input.addEventListener('focus', () => {
      input.classList.add('active');
      input.dataset.appendOnPick = '1';
    });
    input.addEventListener('blur', () => {
      input.classList.remove('active');
      // keep appendOnPick true for a short time so select change can occur
      setTimeout(() => { delete input.dataset.appendOnPick; }, 300);
    });

    // Click input focuses it (do not append on click)
    input.addEventListener('click', () => {
      input.focus();
    });

    // If picker is a select, populate it with A-Z options and append on change
    if (picker && picker.tagName === 'SELECT') {
      picker.innerHTML = letters.map(l => `<option value="${l}">${l}</option>`).join('');
      picker.selectedIndex = 0;
      picker.addEventListener('change', () => {
        // append only if the input was recently focused (user intended to type)
        if (input.dataset.appendOnPick === '1') {
          const letter = picker.value;
          input.value = (input.value || '') + letter;
          // reset picker back to first option to make repeated picks explicit
          picker.selectedIndex = 0;
          delete input.dataset.appendOnPick;
        } else {
          // otherwise focus the input so next change will append
          input.focus();
        }
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