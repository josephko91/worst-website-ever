document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById("startButton");
  const submitButton = document.getElementById("submitButton");
  const message = document.getElementById("message");

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

  // useless form submit
  submitButton.addEventListener("click", () => {
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