// ================================
// TIC TAC TOE - CLEAN VERSION
// ================================

const boxes = document.querySelectorAll(".box");
const modeDisplay = document.getElementById("mode");
const turnDisplay = document.getElementById("turns");

const gameOverElements = document.querySelectorAll(".game-over");
const winnerIcon = document.getElementById("icon");
const winnerText = document.getElementById("winner");
const playAgainBtn = document.querySelector(".gameover button");

const pvcRadio = document.getElementById("pvc");
const pvpRadio = document.getElementById("pvp");

// Symbols
const X = "⨉";
const O = "◯";

// Game State
let board = Array(9).fill("");
let currentPlayer = X;
let gameRunning = false;
let vsComputer = true;

// Winning Patterns
const winPatterns = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

// ================================
// START GAME
// ================================
function playGame() {
  vsComputer = pvcRadio.checked;
  modeDisplay.textContent = vsComputer ? "🧑~🤖" : "🧑~🧑🏽";

  resetGame();
  gameRunning = true;
}

// ================================
// HANDLE BOX CLICK
// ================================
boxes.forEach((box, index) => {
  box.addEventListener("click", () => handleMove(index));
});

function handleMove(index) {
  if (!gameRunning || board[index] !== "") return;

  makeMove(index, currentPlayer);

  if (checkWinner()) return;

  if (checkDraw()) return;

  switchPlayer();

  if (vsComputer && currentPlayer === O) {
    setTimeout(computerMove, 700);
  }
}

// ================================
// MAKE MOVE
// ================================
function makeMove(index, player) {
  board[index] = player;
  boxes[index].textContent = player;
  boxes[index].disabled = true;

  if (player === X) {
    boxes[index].style.background = "#0f0";
    boxes[index].style.color = "#111";
  } else {
    boxes[index].style.background = "#0ff";
    boxes[index].style.color = "#111";
  }
}

// ================================
// SWITCH PLAYER
// ================================
function switchPlayer() {
  currentPlayer = currentPlayer === X ? O : X;

  if (vsComputer) {
    turnDisplay.textContent =
      currentPlayer === X ? "Player's Turn" : "Computer's Turn";
  } else {
    turnDisplay.textContent =
      currentPlayer === X ? "Player 1 Turn" : "Player 2 Turn";
  }
}

// ================================
// COMPUTER MOVE (Simple Smart AI)
// ================================
function computerMove() {
  let emptyIndexes = board
    .map((val, i) => (val === "" ? i : null))
    .filter(val => val !== null);

  // Try to win first
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let values = [board[a], board[b], board[c]];

    if (values.filter(v => v === O).length === 2 &&
        values.includes("")) {
      let emptyIndex = pattern[values.indexOf("")];
      handleMove(emptyIndex);
      return;
    }
  }

  // Otherwise random
  let randomIndex =
    emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

  handleMove(randomIndex);
}

// ================================
// CHECK WINNER
// ================================
function checkWinner() {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      endGame(board[a]);
      return true;
    }
  }
  return false;
}

// ================================
// CHECK DRAW
// ================================
function checkDraw() {
  if (!board.includes("")) {
    endGame(null);
    return true;
  }
  return false;
}

// ================================
// END GAME
// ================================
function endGame(winner) {
  gameRunning = false;

  boxes.forEach(box => box.disabled = true);

  setTimeout(() => {
    gameOverElements.forEach(el => el.style.display = "flex");

    if (winner === X) {
      winnerIcon.textContent = "🧑";
      winnerText.textContent = vsComputer
        ? "Player Wins"
        : "Player 1 Wins";
    } else if (winner === O) {
      winnerIcon.textContent = vsComputer ? "🤖" : "🧑🏽";
      winnerText.textContent = vsComputer
        ? "Computer Wins"
        : "Player 2 Wins";
    } else {
      winnerIcon.textContent = "🤝";
      winnerText.textContent = "It's a Draw";
    }
  }, 500);
}

// ================================
// RESET GAME
// ================================
function resetGame() {
  board = Array(9).fill("");
  currentPlayer = X;
  turnDisplay.textContent = "Player's Turn";

  boxes.forEach(box => {
    box.textContent = "";
    box.disabled = false;
    box.style.background = "transparent";
  });

  gameOverElements.forEach(el => el.style.display = "none");
}

// ================================
// PLAY AGAIN BUTTON
// ================================
playAgainBtn.addEventListener("click", () => {
  resetGame();
  gameRunning = true;
});