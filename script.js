// ================= SETUP =================
// Grab the six elements the game talks to.
const sentence = document.getElementById("sentence");
const typingBox = document.getElementById("typingBox");
const counter = document.getElementById("counter");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");
const tryAgainBtn = document.getElementById("tryAgainBtn");

// ================= SENTENCE BANK =================
// Single source of truth for all rounds. The paragraph is display-only.
const SENTENCES = [
  "The quick brown fox jumps over the lazy dog near the riverbank every morning.",
  "Typing quickly is a skill that improves steadily with practice every single day.",
  "Computers are fast, but programmers still need to think slowly and carefully.",
  "Small consistent habits build better results than rare bursts of intense effort.",
  "A programmer writes code that a computer can read and a human can understand.",
  "The best way to learn something new is to build something small with it today.",
  "Rain tapped gently on the window while the city slowly woke up outside.",
  "Every bug you find and fix makes the next one easier to see and understand."
];

// "let" not "const" — these change every round.
let targetText = "";
let targetLength = 0;
let lastIndex = -1;   // which sentence was served last (-1 = none yet).
                      // Survives BETWEEN rounds — that is its whole job.

// ================= PICK A RANDOM SENTENCE =================
// Reject-and-reroll: never serve the same sentence twice in a row,
// same muscle as snake-game's food spawner (never spawn under the snake).
function pickSentence() {
  let index;

  do {
    index = Math.floor(Math.random() * SENTENCES.length);
  } while (index === lastIndex);

  lastIndex = index;

  targetText = SENTENCES[index];
  targetLength = targetText.length;

  // Plain text (innerText, not innerHTML) — renderHighlight paints it.
  sentence.innerText = targetText;
}

// ================= ROUND STATE =================
// The reset checklist: startRound() must restore EVERY item here.
// Miss one and you get a stale-state bug in round 2+.
let startTime = null;       // null = timer not started this round
let timerInterval = null;   // setInterval ID, needed to stop the clock
let finished = false;       // locks the round once completed

// ================= RESET / START =================
// Called on page load AND on every Try Again click.
function startRound() {
  clearInterval(timerInterval);   // kill any ticking clock first
  startTime = null;
  finished = false;

  pickSentence();   // fresh sentence every round

  typingBox.value = "";
  typingBox.disabled = false;
  counter.innerText = "0 / " + targetLength + " characters";
  timerDisplay.innerText = "0.0s";
  resultDisplay.innerText = "";
  tryAgainBtn.style.display = "none";

  renderHighlight();
  typingBox.focus();   // cursor straight into the box
}

// ================= LIVE HIGHLIGHTING =================
// Compare typed text to the target character by character and paint
// each one: grey = not reached, green = correct, red = wrong.
function renderHighlight() {
  const typed = typingBox.value;
  let html = "";

  for (let i = 0; i < targetLength; i++) {
    let color;
    if (typed[i] === undefined)          { color = "#888"; }
    else if (typed[i] === targetText[i]) { color = "#4caf50"; }
    else                                 { color = "#f44336"; }
    html += '<span style="color: ' + color + ';">' + targetText[i] + '</span>';
  }

  // Anything typed beyond the sentence: show it red after the end.
  if (typed.length > targetLength) {
    const extra = typed.slice(targetLength);
    // Escape < and > so they display as characters, not tags.
    const safe = extra.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html += '<span style="color: #f44336;">' + safe + '</span>';
  }

  sentence.innerHTML = html;
}

// ================= FINISH + SCORE =================
function finishRound() {
  finished = true;
  clearInterval(timerInterval);

  // Real measurement = two timestamps subtracted. The live ticking
  // display was only cosmetic; this is the official number.
  const elapsedSec = (Date.now() - startTime) / 1000;
  timerDisplay.innerText = elapsedSec.toFixed(1) + "s";

  // Count correct (green) characters.
  const typed = typingBox.value;
  let correct = 0;
  for (let i = 0; i < targetLength; i++) {
    if (typed[i] === targetText[i]) {
      correct++;
    }
  }

  // WPM: (chars / 5) per minute. Industry standard, spaces included.
  const wpm = (targetLength / 5) / (elapsedSec / 60);

  // Accuracy: correct chars as a % of the whole sentence.
  const accuracy = (correct / targetLength) * 100;

  resultDisplay.innerText =
    wpm.toFixed(1) + " WPM — " + accuracy.toFixed(0) + "% accurate";

  typingBox.disabled = true;
  tryAgainBtn.style.display = "inline-block";
}

// ================= MAIN INPUT HANDLER =================
// "input" fires on every change: typing, deleting, pasting —
// unlike keydown it also catches cut and autocorrect.
typingBox.addEventListener("input", function() {
  if (finished) return;

  const typedSoFar = typingBox.value;
  counter.innerText = typedSoFar.length + " / " + targetLength + " characters";
  renderHighlight();

  // Start the clock on the FIRST keystroke only.
  if (startTime === null && typedSoFar.length > 0) {
    startTime = Date.now();
    timerInterval = setInterval(function() {
      timerDisplay.innerText = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
    }, 100);
  }

  // Overshoot allowed: finish when the full sentence is reached.
  if (typedSoFar.length >= targetLength) {
    finishRound();
  }
});

// Kick off round #1 (page load = an invisible Try Again click).
startRound();
