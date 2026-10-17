# ⌨️ Typing Speed Test

A browser typing speed test built with HTML, CSS, and vanilla JavaScript — my second web project. A random sentence appears, you type it, and the app measures your speed and accuracy live, character by character. No frameworks, no libraries.

## What It Does

- Shows a **random sentence** from an 8-sentence bank (never the same one twice in a row)
- Characters light up **green** as you type them correctly, **red** when wrong
- A **live timer** starts on your first keystroke — not on page load
- The counter tracks your progress (`23 / 81 characters`) as you type
- On finish: your **WPM** and **accuracy %** in gold
- The **Try Again** button resets everything and serves a fresh sentence

## How to Play

Open `index.html` in any browser and just start typing.

| Element | Behavior |
|---|---|
| Sentence | Randomly picked each round |
| Typing box | Type the sentence exactly as shown |
| Green characters | Correct so far |
| Red characters | Wrong — backspace to fix |
| Timer | Starts on first keystroke, freezes on finish |
| Try Again button | Appears after a round ends |

## Scoring

| Metric | How it's calculated |
|---|---|
| Time | `Date.now()` difference between first keystroke and finish |
| WPM | `(characters / 5) ÷ (seconds / 60)` — industry standard, spaces count |
| Accuracy | `correct characters ÷ total characters × 100` |

Example: an 81-character sentence finished in 20 seconds with 3 mistakes
→ `(81/5) / (20/60)` = **48.6 WPM**, `(78/81) × 100` = **96% accurate**.

## Concepts Demonstrated

- The `input` event vs `keydown` (what the text *is* vs which key was pressed)
- String indexing and char-by-char comparison (`typed[i] === targetText[i]`)
- Timestamps: `Date.now()` subtraction for precise elapsed time
- `setInterval` for the live clock, `clearInterval` to stop it (snake-game redux)
- State variables and reset logic (`startRound()` restores every piece of state)
- `do...while` reject-and-reroll for random-but-never-repeating picks
- `innerHTML` vs `innerText` — injecting colored `<span>`s vs writing plain text
- Input escaping (`&lt;` / `&gt;`) when displaying user-typed text
- The classic textarea/pre-wrap whitespace traps, found and fixed
- Separating HTML (structure), CSS (looks), and JS (behavior)

## Planned Improvements

- [ ] High score and history saved in `localStorage`
- [ ] Difficulty modes (short/medium/long sentences)
- [ ] Countdown timer mode (60-second challenge)
- [ ] Line-by-line display for long sentences
- [ ] Highlight the current cursor position

## Files

- `index.html` — page structure
- `style.css` — colors, layout, and the hidden-until-finish button
- `script.js` — the complete game logic, commented
- `.gitignore` — editor and local files

## Built With

HTML, CSS, and JavaScript — written as my second web project, built from five
small steps, tested and debugged one feature at a time.

## Author

**Akash Bhat** — [github.com/AkashBGBhat](https://github.com/AkashBGBhat)
