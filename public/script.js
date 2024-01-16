let currentPlayer = "X";
const gameState = Array(9).fill(null);
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", cellClicked, { once: true });
});
document.getElementById("reset-button").addEventListener("click", resetGame);

function resetGame() {
  gameState.fill(null);
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.removeEventListener("click", cellClicked);
    cell.addEventListener("click", cellClicked, { once: true });
  });
  currentPlayer = "X";
}

function cellClicked(e) {
  const cell = e.target;
  const cellIndex = cell.getAttribute("data-cell-index");

  if (gameState[cellIndex] || isGameOver()) {
    return;
  }

  gameState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    alert(`${currentPlayer} wins!`);
    return;
  }

  if (checkDraw()) {
    alert(`It's a draw!`);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWin(player) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return gameState[index] === player;
    });
  });
}

function checkDraw() {
  return gameState.every((cell) => cell);
}

function isGameOver() {
  return checkWin("X") || checkWin("O") || checkDraw();
}
