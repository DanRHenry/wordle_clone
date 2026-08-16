//todo:
/* 
Check words against a dictionary (or allow an option to do so)
*/

const gameBoard = document.querySelector("#gameBoard");
const wordLengthInput = document.getElementById("wordLengthInput");
const totalTriesInput = document.getElementById("totalTriesInput");
const submitBtn = document.getElementById("submitBtn");

const enterStarterWordMessage = document.getElementById(
  "enterStarterWordMessage",
);

const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("alphabet");

let word;
let wordLength = 3;
let totalTries = 10;
const allowedCharacters = /^[a-zA-Z]+$/;

let activeRow = 0;
let playedWords = [];
let disallowedKeys = [
  "Shift",
  "CapsLock",
  "Tab",
  "Control",
  "Alt",
  "PageUp",
  "PageDown",
  "Delete",
  "Insert",
  "End",
  "Home",
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
];

wordLengthInput.addEventListener("change", createGrids);
totalTriesInput.addEventListener("change", createGrids);

function createGrids() {
  submitBtn.removeEventListener("click", handleSubmit);
  wordLength = wordLengthInput.value;
  totalTries = totalTriesInput.value;

  let length = wordLengthInput.value;

  gameBoard.replaceChildren();
  wordDisplay.replaceChildren();
  gameBoard.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${totalTries}, 1fr)`;
  for (let i = 0; i < wordLength; i++) {
    const displaySquare = document.createElement("div");
    wordDisplay.append(displaySquare);
  }

  for (let i = 0; i < totalTries; i++) {
    for (let j = 0; j < wordLength; j++) {
      const square = document.createElement("div");
      square.innerText = "";
      gameBoard.append(square);
    }
  }
  submitBtn.addEventListener("click", handleSubmit);
}

createGrids();

window.addEventListener("keydown", handleKeyEntry);

function handleKeyEntry(e) {
  e.preventDefault();
  if (e.key === "Enter") {
    handleSubmit();
    return;
  }

  if (e.key === "Backspace") {
    for (let i = Array.from(wordDisplay.children).length - 1; i >= 0; i--) {
      const wordSquare = wordDisplay.children[i];
      if (wordSquare.innerText) {
        wordSquare.innerText = "";
        break;
      }
    }
    return;
  }

  if (wordLengthInput.style.display !== "none") {
    if (e.key === "ArrowDown") {
      totalTriesInput.stepUp();
      totalTriesInput.dispatchEvent(new Event("change"));
      return;
    }
    if (e.key === "ArrowUp") {
      totalTriesInput.stepDown();
      totalTriesInput.dispatchEvent(new Event("change"));
      return;
    }
    if (e.key === "ArrowLeft") {
      wordLengthInput.stepDown();
      wordLengthInput.dispatchEvent(new Event("change"));
      return;
    }
    if (e.key === "ArrowRight") {
      wordLengthInput.stepUp();
      wordLengthInput.dispatchEvent(new Event("change"));
      return;
    }
  }

  if (allowedCharacters.test(e.key) && !disallowedKeys.includes(e.key)) {
    for (let i = 0; i < Array.from(wordDisplay.children).length; i++) {
      const wordSquare = wordDisplay.children[i];
      if (wordSquare.innerText) {
        continue;
      } else {
        wordDisplay.children[i].innerText = e.key;
        break;
      }
    }
  }
}

function handleSubmit() {
  let submittedWord = "";

  for (let i = 0; i < Array.from(wordDisplay.children).length; i++) {
    const wordSquare = wordDisplay.children[i];
    if (wordSquare.innerText) {
      submittedWord += wordSquare.innerText;
    }
  }

  if (submittedWord.length === +wordLength) {
    if (!word) {
      word = submittedWord;
      enterStarterWordMessage.innerText = "Play!";
      setTimeout(() => {
        enterStarterWordMessage.style.visibility = "hidden";
      }, 2000);

      const wordLengthLabel = wordLengthInput.previousSibling.previousSibling;
      const totalTriesLengthLabel =
        totalTriesInput.previousSibling.previousSibling;

      wordLengthLabel.style.display = "none";
      totalTriesLengthLabel.style.display = "none";

      wordLengthInput.style.display = "none";
      totalTriesInput.style.display = "none";
      clearWordDisplay();
      return;
    }

    if (word === submittedWord) {
      enterStarterWordMessage.style.visibility = "visible";
      enterStarterWordMessage.innerText =
        "Congratulations! Refresh to play again.";
      submitBtn.removeEventListener("click", handleSubmit);
      window.removeEventListener("keydown", handleKeyEntry);
      let allPlayedLetters = Array.from(word);

      for (let i = 0; i < submittedWord.length; i++) {
        checkLettersAndColorGrid(submittedWord[i], i, allPlayedLetters);
        clearWordDisplay();
      }
      return;
    }

    if (playedWords.includes(submittedWord)) {
      enterStarterWordMessage.innerText = `You tried ${submittedWord} already!`;
      enterStarterWordMessage.style.visibility = "visible";

      setTimeout(() => {
        enterStarterWordMessage.style.visibility = "hidden";
      }, 1000);

      clearWordDisplay();
      return;
    }

    playedWords.push(submittedWord);

    let allPlayedLetters = Array.from(word);

    for (let i = 0; i < submittedWord.length; i++) {
      checkLettersAndColorGrid(submittedWord[i], i, allPlayedLetters);
      clearWordDisplay();
    }
    submittedWord = "";
    if (activeRow < totalTries - 1) {
      activeRow++;
    } else {
      handleGameOver();
    }
  }
}

function checkLettersAndColorGrid(letter, index, allPlayedLetters) {
  const keyboardRows = keyboard.children;
  for (let row of keyboardRows) {
    for (let square of row.children) {
      if (square.innerText === letter) {
        square.style.backgroundColor = "gray";
      }
    }
  }
  const gameBoardSquare = gameBoard.children[activeRow * wordLength + index];
  if (word[index] === letter && allPlayedLetters.includes(letter)) {
    gameBoardSquare.style.backgroundColor = "green";
    gameBoardSquare.innerText = letter;
    allPlayedLetters.splice(allPlayedLetters.indexOf(letter), 1);
  } else if (word.includes(letter) && allPlayedLetters.includes(letter)) {
    gameBoardSquare.style.backgroundColor = "yellow";
    gameBoardSquare.innerText = letter;
    allPlayedLetters.splice(allPlayedLetters.indexOf(letter), 1);
  } else {
    gameBoardSquare.style.backgroundColor = "grey";
    gameBoardSquare.innerText = letter;
  }
}

function handleGameOver() {
  enterStarterWordMessage.innerText = "Game Over";
  enterStarterWordMessage.style.visibility = "visible"
  submitBtn.removeEventListener("click", handleSubmit);
  window.removeEventListener("keydown", handleKeyEntry);
}

function clearWordDisplay() {
  for (let i = 0; i < wordDisplay.children.length; i++) {
    wordDisplay.children[i].innerText = "";
  }
}

keyboard.addEventListener("click", handleKeyboardClick);
function handleKeyboardClick(e) {
  if (e.target.id === "alphabet") {
    return;
  } else if (
    allowedCharacters.test(e.target.innerText) &&
    !disallowedKeys.includes(e.target.innerText)
  ) {
    for (let i = 0; i < Array.from(wordDisplay.children).length; i++) {
      const wordSquare = wordDisplay.children[i];
      if (wordSquare.innerText) {
        continue;
      } else {
        wordDisplay.children[i].innerText = e.target.innerText;
        break;
      }
    }
  }
}
