const startButton = document.getElementById("startButton");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");

// button runs away
startButton.addEventListener("mouseover", () => {

const x = Math.random()*window.innerWidth;
const y = Math.random()*window.innerHeight;

startButton.style.position="absolute";
startButton.style.left=x+"px";
startButton.style.top=y+"px";

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

const r = responses[Math.floor(Math.random()*responses.length)];

message.innerText=r;

});