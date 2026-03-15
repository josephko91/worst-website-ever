document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById("startButton");
  const submitButton = document.getElementById("submitButton");
  const message = document.getElementById("message");

  const nameInputs = Array.from(document.querySelectorAll('.name-input'));

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // track last focus time per input so select changes can append reliably
  const lastFocusTime = new WeakMap();
  // track the input the user most recently interacted with
  let lastFocusedInput = null;

  // initialize pickers for each name input
  nameInputs.forEach((input) => {
    const picker = input.parentElement.querySelector('.picker');


    // Focus handling: record the focus timestamp and add/remove active class
    input.addEventListener('focus', () => {
      input.classList.add('active');
      lastFocusTime.set(input, Date.now());
      lastFocusedInput = input;
      console.debug('input focus', input.placeholder, Date.now());
    });
    input.addEventListener('blur', () => {
      input.classList.remove('active');
      console.debug('input blur', input.placeholder, Date.now());
    });

    // Also track mousedown so focus intent is recorded before select opens
    input.addEventListener('mousedown', () => { lastFocusedInput = input; });

    // Click input focuses it (do not append on click)
    input.addEventListener('click', () => {
      input.focus();
    });

    // If picker is a select, populate it with A-Z options and append on change
    if (picker && picker.tagName === 'SELECT') {
      const optionsHtml = ['<option value="" disabled selected>Choose</option>'].concat(letters.map(l => `<option value="${l}">${l}</option>`)).join('');
      picker.innerHTML = optionsHtml;
      picker.selectedIndex = 0;
      // If the user interacts with the select, mark intent on pointerdown
      picker.addEventListener('pointerdown', () => { lastFocusedInput = input; });
      picker.addEventListener('change', () => {
        const now = Date.now();
        const last = lastFocusTime.get(input) || 0;
        const intended = (lastFocusedInput === input);
        console.debug('picker change', input.placeholder, { now, last, diff: now - last, intended });
        // append when input was focused recently, currently focused, or explicitly intended
        if (document.activeElement === input || intended || (now - last) < 1000) {
          const letter = picker.value;
          if (letter) {
            input.value = (input.value || '') + letter;
          }
          // reset back to placeholder
          picker.selectedIndex = 0;
          lastFocusTime.set(input, Date.now());
          console.debug('appended', letter, 'to', input.placeholder, 'value now', input.value);
        } else {
          input.focus();
          console.debug('focused input instead of appending', input.placeholder);
        }
        // clear lastFocusedInput to avoid cross-input leaks
        lastFocusedInput = null;
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
    // reduce roaming area to half to make the chase gentler
    const roamX = Math.floor(maxX / 2);
    const roamY = Math.floor(maxY / 2);
    const x = Math.random() * roamX;
    const y = Math.random() * roamY;
    startButton.style.position = "absolute";
    startButton.style.left = x + "px";
    startButton.style.top = y + "px";
  });

  // clicking Start triggers a playful melting effect and a big happy face
  startButton.addEventListener('click', () => {
    document.body.classList.add('melting');
    const face = document.createElement('div');
    face.className = 'happy';
    face.textContent = '😊';
    document.body.appendChild(face);

    // create wax columns (candle-like) before smaller drips
    const waxCount = 10;
    let maxAnimMs = 0;
    const DURATION_MULT = 2.2; // slow factor for a long dissolve
    for (let i = 0; i < waxCount; i++) {
      const w = 40 + Math.round(Math.random() * 220);
      const h = Math.round(120 + Math.random() * 240);
      const left = Math.round(Math.random() * 100);
      const delayNum = Math.random() * 0.35;
      const durNum = 1.4 + Math.random() * 1.0;
      const durFinal = durNum * DURATION_MULT;
      const delay = delayNum.toFixed(2) + 's';
      const dur = durFinal.toFixed(2) + 's';
      const wax = document.createElement('div');
      wax.className = 'wax';
      wax.style.setProperty('--w', w + 'px');
      wax.style.setProperty('--h', h + 'px');
      wax.style.setProperty('--left', left + 'vw');
      wax.style.setProperty('--delay', delay);
      wax.style.setProperty('--dur', dur);
      document.body.appendChild(wax);
      const totalMs = (durFinal + delayNum) * 1000;
      if (totalMs > maxAnimMs) maxAnimMs = totalMs;
      setTimeout(() => { try { wax.remove(); } catch (e) {} }, totalMs + 300);
    }

    // create multiple drips with varied sizes and timings for a more realistic melt
    const dripCount = 9;
    for (let i = 0; i < dripCount; i++) {
      const d = document.createElement('div');
      d.className = 'drip';
      const w = 40 + Math.round(Math.random() * 160); // width px
      const h = Math.round(w * (1.0 + Math.random() * 1.4));
      const left = Math.round(Math.random() * 100); // percent
      const delayNum = Math.random() * 0.5;
      const durNum = 1.0 + Math.random() * 1.2;
      const durFinal = durNum * DURATION_MULT;
      const delay = delayNum.toFixed(2) + 's';
      const dur = durFinal.toFixed(2) + 's';
      d.style.setProperty('--w', w + 'px');
      d.style.setProperty('--h', h + 'px');
      d.style.setProperty('--delay', delay);
      d.style.setProperty('--dur', dur);
      d.style.left = left + 'vw';
      // stagger vertical start so they look like separate drips
      d.style.top = (-10 - Math.random() * 6) + 'vh';
      document.body.appendChild(d);
      const totalMs = (durFinal + delayNum) * 1000;
      if (totalMs > maxAnimMs) maxAnimMs = totalMs;
      // remove after animation finishes
      setTimeout(() => { try { d.remove(); } catch (e) {} }, totalMs + 200);
    }

    // after the primary melt animation, hide everything except the face and script/drips/wax
    const hideDelay = Math.max(4200, Math.ceil(maxAnimMs + 400));
    setTimeout(() => {
      Array.from(document.body.children).forEach((child) => {
        if (child === face) return;
        if (child.tagName && child.tagName.toLowerCase() === 'script') return;
        if (child.classList && (child.classList.contains('drip') || child.classList.contains('wax'))) return;
        try { child.style.display = 'none'; } catch (e) { /* ignore */ }
      });
      // ensure a clean white background and keep the face centered and visible
      document.body.style.background = 'white';
      document.body.style.overflow = 'hidden';
      face.style.position = 'fixed';
      face.style.left = '50%';
      face.style.top = '50%';
      face.style.transform = 'translate(-50%, -50%) scale(1)';
      face.style.zIndex = '10000';
    }, hideDelay);
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