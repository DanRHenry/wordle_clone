//todo:
/* 
Check words against a dictionary (or allow an option to do so)
*/

const gameBoard = document.querySelector("#gameBoard");
const wordLengthInput = document.getElementById("wordLengthInput");
const totalTriesInput = document.getElementById("totalTriesInput");
const submitBtn = document.getElementById("submitBtn");
const toggleAlphabetInput = document.getElementById("toggleAlphabet")

toggleAlphabetInput.addEventListener("change", toggleKeyboardLayout)

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
  if (e.key === "Enter") {
    handleSubmit();
    return;
  }

  if (e.key === "Backspace") {
    handleBackspace();
    return;
  }

  if (wordLengthInput.style.display !== "none") {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      totalTriesInput.stepUp();
      totalTriesInput.dispatchEvent(new Event("change"));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      totalTriesInput.stepDown();
      totalTriesInput.dispatchEvent(new Event("change"));
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();

      wordLengthInput.stepDown();
      wordLengthInput.dispatchEvent(new Event("change"));
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();

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

  function colorKeyboardSquares(color) {
    for (let row of keyboardRows) {
      for (let square of row.children) {
        if (square.innerText === letter) {
          if (!square.style.backgroundColor) {
            square.style.backgroundColor = color;
            return;
          }
          if (color === "green") {
            if (
              square.style.backgroundColor === "yellow" ||
              square.style.backgroundColor === "grey"
            ) {
              square.style.backgroundColor = color;
            }
            return;
          } else if (color === "yellow") {
            if (square.style.backgroundColor !== "green") {
              square.style.backgroundColor = color;
              return;
            } else if (color === "grey" && !square.style.backgroundColor) {
              square.style.backgroundColor = "grey";
            }
          }
        }
      }
    }
  }

  const gameBoardSquare = gameBoard.children[activeRow * wordLength + index];
  if (word[index] === letter && allPlayedLetters.includes(letter)) {
    gameBoardSquare.style.backgroundColor = "green";
    gameBoardSquare.innerText = letter;
    colorKeyboardSquares("green");
    allPlayedLetters.splice(allPlayedLetters.indexOf(letter), 1);
  } else if (word.includes(letter) && allPlayedLetters.includes(letter)) {
    gameBoardSquare.style.backgroundColor = "yellow";
    gameBoardSquare.innerText = letter;
    colorKeyboardSquares("yellow");
    allPlayedLetters.splice(allPlayedLetters.indexOf(letter), 1);
  } else {
    gameBoardSquare.style.backgroundColor = "grey";
    gameBoardSquare.innerText = letter;
    colorKeyboardSquares("grey");
  }
}

function handleGameOver() {
  enterStarterWordMessage.innerText = `Game Over\n${word}`;
  enterStarterWordMessage.style.visibility = "visible";
  submitBtn.removeEventListener("click", handleSubmit);
  window.removeEventListener("keydown", handleKeyEntry);
}

function clearWordDisplay() {
  for (let i = 0; i < wordDisplay.children.length; i++) {
    wordDisplay.children[i].innerText = "";
  }
}

function handleBackspace() {
  for (let i = Array.from(wordDisplay.children).length - 1; i >= 0; i--) {
    const wordSquare = wordDisplay.children[i];
    if (wordSquare.innerText) {
      wordSquare.innerText = "";
      break;
    }
  }
}

function toggleKeyboardLayout() {
  buildKeyboard(toggleAlphabetInput.checked)
}

const keyboardLayouts = {
  qwerty: Array.from("qwertyuiopasdfghjklzxcvbnm"),
  abcde: Array.from("abcdefghijklmnopqrstuvwxyz")
}

buildKeyboard(false)

keyboard.addEventListener("click", handleKeyboardClick);
function handleKeyboardClick(e) {
  if (e.target.id === "alphabet") {
    return;
  } else if (e.target.innerText === "Backspace") {
    handleBackspace();
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

function buildKeyboard(value) {
  document.getElementById("topRow").replaceChildren()
  document.getElementById("middleRow").replaceChildren()
  document.getElementById("bottomRow").replaceChildren()

  let keyboard;

  if (value === false) {
    keyboard = "qwerty"
  } else {
    keyboard = "abcde"
  }

  for (let i = 0; i < keyboardLayouts[keyboard].length; i++){
    const letter = document.createElement('div')
    letter.innerText = keyboardLayouts[keyboard][i]
    if (i < 10) {
      document.getElementById("topRow").append(letter)
      continue
    } 
    if (i <= 18 && i > 9){
      document.getElementById("middleRow").append(letter)
      continue
    }
    if (i >= 19) {
      document.getElementById("bottomRow").append(letter)
    }
  }
      const backspaceKey = document.createElement("div")
    backspaceKey.id = "backspace"
    backspaceKey.innerText = "Backspace"
    document.getElementById("bottomRow").append(backspaceKey)
}