// ================================
// ADVANCED TIC TAC TOE ENGINE
// ================================

// DOM
const boxes = document.querySelectorAll(".box");
const modeDisplay = document.getElementById("mode");
const turnDisplay = document.getElementById("turns");
const difficultySelect = document.getElementsByName("difficulty");
const modes = document.getElementsByName("modes");
const p1Icon = document.getElementById("p1Icon");
const p2Icon = document.getElementById("p2Icon");
const pIcon = document.getElementById("pIcon");
const cIcon = document.getElementById("cIcon");
const avatarCon = document.getElementById("avatarContainer");
const difficultyMode = document.querySelectorAll(".diff");
const scores = document.querySelectorAll(".score");
const scoreIcon = document.querySelectorAll(".icon");
const gameOverElements = document.querySelectorAll(".game-over");
const winnerIcon = document.getElementById("icon");
const winnerText = document.getElementById("winner");
const playAgainBtn = document.getElementById("button");

// ================================
// GAME CONFIG
// ================================
const config = {
  difficulty: "easy",
  playerIcon: "🧑",
  computerIcon: "🤖",
  playerOneIcon: "🧑",
  playerTwoIcon: "👦🏻"
};

const computerIcons = ['🤖','👽','👾','💀','👻','👺','🎃'];
const icons = ['🧑','👧','👦','👸','🤴','👳‍♂️','👲','🧔','🧑🏻','👧🏻','👦🏻','👸🏻','🤴🏻','👳🏻‍♂️','👲🏻','🧔🏻','🧑🏾','👧🏾','👦🏾','👸🏾','🤴🏾','👳🏾‍♂️','👲🏾','🧔🏾','🧑🏼','👧🏼','👦🏼','👸🏼','🤴🏼','👳🏼‍♂️','👲🏼','🧔🏼'];


// ================================
// GAME STATE
// ================================
let state = {
  board: Array(9).fill(""),
  currentPlayer: "X",
  initialPlayer: false,
  running: false,
  vsComputer: false,
};

const X = "⨉";
const O = "◯";

let xwin = 0;
let owin = 0;
let draw = 0;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ================================
// RANDOM NUMBER
// ================================
function randNum(length){
  return Math.floor(Math.random() * length);
}

// ================================
// INITIALIZATION
// ================================
for (i=0; i<icons.length; i++) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.classList.add('avatar');
  btn.dataset.icon = btn.textContent = icons[i];
  avatarCon.append(btn);
}

const avatars = document.querySelectorAll(".avatar");
let playerTurnNum = 1;

modes.forEach(mode => {  
  mode.addEventListener("change", ()=> {
    state.vsComputer = mode.id === "pvc" ? true : false;
  });
});

avatars.forEach(btn => {
  btn.addEventListener("click", () => {
    avatars.forEach(b => {
      b.style.borderColor = '#fff5';
      b.style.background = null;
    });

    if(state.vsComputer){
      config.playerIcon = btn.dataset.icon;
      pIcon.textContent = btn.dataset.icon;      
      btn.style.borderColor = "#0f0";
      btn.style.backgroundColor = "#0f05";
  
      let num = randNum(computerIcons.length);
      config.computerIcon = computerIcons[num];
      cIcon.textContent = config.computerIcon;

    } else {
      switch (playerTurnNum) {
        case 1:
          config.playerOneIcon = btn.dataset.icon;
          p1Icon.textContent = btn.dataset.icon;
          btn.style.borderColor = "#0f0";
          btn.style.backgroundColor = "#0f05";
          playerTurnNum = 2;
          break;
        case 2:
          config.playerTwoIcon = btn.dataset.icon;
          p2Icon.textContent = btn.dataset.icon;
          playerTurnNum = 1;
          btn.style.borderColor = "#0ff";
          btn.style.backgroundColor = "#0ff5";
          break;
      }
    }
  });
});

difficultySelect.forEach(diff => {
  if(diff.checked){
    config.difficulty = diff.id;
  }
  diff.addEventListener("change", () => {
    config.difficulty = diff.id;
  });
});

// ================================
// START GAME
// ================================
function playGame() {  
  turnDisplay.style.background = state.currentPlayer === X ? "#0f0" : "#0ff";
  
  modeDisplay.textContent = state.vsComputer
  ? `${config.playerIcon}~${config.computerIcon}`
  : `${config.playerOneIcon}~${config.playerTwoIcon}`;
  
  scoreIcon.forEach((icon, index) => {
    if(state.vsComputer){
      icon.textContent = index === 0 ? config.playerIcon : config.computerIcon; 
      difficultyMode.forEach(el => {
        el.textContent = config.difficulty;
        el.style.display = 'block';
      });
    } else {
      icon.textContent = index === 0 ? config.playerOneIcon : config.playerTwoIcon; 
    }
  });

  xwin = 0;
  owin = 0;
  draw = 0;

  scores[0].textContent = xwin + owin + draw;
  scores[1].textContent = xwin;
  scores[2].textContent = owin;
  scores[3].textContent = draw;

  resetGame();
  state.running = true;
  state.initialPlayer = true;
}

// ================================
// BOX CLICK
// ================================
boxes.forEach((box, index) => {
  box.addEventListener("click", () => handleMove(index));
});

function handleMove(index) {
  if (!state.running || state.board[index] !== "") return;

  makeMove(index, state.currentPlayer);

  if (checkWinner()) return;
  if (checkDraw()) return;

  switchPlayer();

  if (state.vsComputer && state.currentPlayer === O) {
    setTimeout(computerMove, 700);
  }
}

// ================================
// MAKE MOVE
// ================================
function makeMove(index, player) {
  state.board[index] = player;
  boxes[index].textContent = player;
  boxes[index].disabled = true;
  boxes[index].style.background = state.currentPlayer === X ? '#0f0' : '#0ff';
}

// ================================
// SWITCH PLAYER
// ================================
function switchPlayer() {
  state.currentPlayer = state.currentPlayer === X ? O : X;

  let turn = state.currentPlayer === X ? true : false;
  turnDisplay.style.background = turn ? "#0f0" : "#0ff";
  
  if (state.vsComputer) {
    turnDisplay.textContent = turn ? "Your Turn" : "Thinking...";
  } else {
    turnDisplay.textContent = turn ? "Player 1 Turn" : "Player 2 Turn";
  }
}

// ================================
// COMPUTER AI
// ================================
function computerMove() {
  let move;

  if (config.difficulty === "easy") {
    move = randomMove();
  } else if (config.difficulty === "medium") {
    switch ((xwin + owin + draw) % 2) {
      case 1:
        move = minimax(state.board, O).index;
        break;   
      default:
        move = smartMove() ?? randomMove();
        break;
    }
  } else {
    switch ((xwin + owin + draw) % 10) {
      case 4:
        move = smartMove() ?? randomMove();
        break;   
      case 9:
        move = smartMove() ?? randomMove();
        break;   
      default:
        move = minimax(state.board, O).index;
        break;
    }
  }

  handleMove(move);
}

// EASY
function randomMove() {
  let empty = state.board
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  return empty[randNum(empty.length)];
}

// MEDIUM
function smartMove() {
  for (let pattern of winPatterns) {
    let [a,b,c] = pattern;
    let values = [state.board[a], state.board[b], state.board[c]];

    if (values.filter(v => v === O).length === 2 &&
        values.includes("")) {
      return pattern[values.indexOf("")];
    }
  }
  return null;
}

// HARD (MINIMAX)
function minimax(board, player) {
  let empty = board
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  if (checkWinnerStatic(board, X)) return { score: -10 };
  if (checkWinnerStatic(board, O)) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  let moves = [];

  for (let i of empty) {
    let move = {};
    move.index = i;
    board[i] = player;

    let result = minimax(board, player === O ? X : O);
    move.score = result.score;

    board[i] = "";
    moves.push(move);
  }

  let bestMove;

  if (player === O) {
    let bestScore = -Infinity;
    for (let m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  }

  return bestMove;
}

function checkWinnerStatic(board, player) {
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === player)
  );
}

// ================================
// WIN / DRAW
// ================================
function checkWinner() {
  if (checkWinnerStatic(state.board, state.currentPlayer)) {
    endGame(state.currentPlayer);
    return true;
  }
  return false;
}

function checkDraw() {
  if (!state.board.includes("")) {
    endGame(null);
    return true;
  }
  return false;
}

// ================================
// END GAME
// ================================
function endGame(winner) {
  state.running = false;

  boxes.forEach(b => b.disabled = true);

  setTimeout(() => {
    gameOverElements.forEach(el => el.style.display = "flex");
    scores.forEach(element => {
      element.style.display = 'block';
    });

    if(state.vsComputer){
      switch (winner) {
        case X:          
          scoreBoard(X, config.playerIcon, "You Won!", "#0f0");        
          break;
        case O:          
          scoreBoard(O, config.computerIcon, "Computer Won!", "#0ff");        
          break;          
        default:
          scoreBoard(null, "🤝", "Draw!", "#fff");  
          scores[4].style.display = 'none';
          scores[5].style.display = 'none';
          scores[6].style.display = 'none';
          scores[7].style.display = 'none';    
          break;
      }
    } else {
      switch (winner) {
        case X:          
          scoreBoard(X, config.playerOneIcon, "Player 1 Won!", "#0f0");
          break;
        case O:          
          scoreBoard(O, config.playerTwoIcon, "Player 2 Won!", "#0ff");        
          break;          
        default:
          scoreBoard(null, "🤝", "Draw!", "#fff");  
          scores[4].style.display = 'none';
          scores[5].style.display = 'none';
          scores[6].style.display = 'none';
          scores[7].style.display = 'none';       
          break;
      }
    }

    scores[0].textContent = xwin + owin + draw;
    scores[1].textContent = xwin;
    scores[2].textContent = owin;
    scores[3].textContent = draw;
    scores[4].textContent = xwin + owin + draw;
    scores[5].textContent = winner === X ? xwin : winner === O ? owin : 0;
    scores[6].textContent = draw;
    scores[7].textContent = (xwin + owin + draw) - ((winner === X ? xwin : winner === O ? owin : 0) + draw);

  }, 500);
}

// ================================
// RESET
// ================================
function resetGame() {
  state.board = Array(9).fill("");
  state.initialPlayer = state.initialPlayer ? false : true;
  state.currentPlayer = state.initialPlayer ? X : O;
  turnDisplay.textContent = state.currentPlayer === X ? 
    state.vsComputer ? "Your Turn" : "Player 1 Turn" : 
    state.vsComputer ? "Thinking..." : "Player 2 Turn";

  turnDisplay.style.background = state.currentPlayer === X ? "#0f0" : "#0ff";

  boxes.forEach(box => {
    box.textContent = "";
    box.disabled = false;
    box.style.background = null;
  });

  if (state.vsComputer && state.currentPlayer === O) {
    setTimeout(computerMove, 700);
  }

  gameOverElements.forEach(el => el.style.display = "none");
}

playAgainBtn.addEventListener("click", () => {
  resetGame();
  state.running = true;
});

// ================================
// SCORE BOARD
// ================================
function scoreBoard(winner, icon, text, color){
  winnerIcon.textContent = icon;
  winnerText.textContent = text;
  winnerText.style.backgroundColor = color;

  if(winner === X){
    xwin++;
  } else if(winner === O){
    owin++;
  } else {
    draw++;
  }
}