let gameId = null;

socket.on("matchFound", (data) => {
  gameId = data.gameId;
  document.getElementById(
    "gameInfo"
  ).innerText = `Playing against ${data.opponentName}`;
});

document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", function () {
    const cellIndex = this.getAttribute("data-cell-index");
    console.log(`Cell ${cellIndex} clicked.`);
    if (gameId !== null) {
      socket.emit("cellClicked", { cellIndex, gameId });
    } else {
      console.error("Game not started or gameId not set.");
    }
  });
});

socket.on("gameStateUpdate", (gameState) => {
  updateUI(gameState);
});

socket.on("gameOver", (data) => {
  alert(data.message);
});

function updateUI(gameState) {
  gameState.forEach((cell, index) => {
    const cellElement = document.querySelector(`[data-cell-index='${index}']`);
    cellElement.textContent = cell;
  });
}

document.getElementById("reset-button").addEventListener("click", () => {
  if (gameId !== null) {
    socket.emit("resetGame", { gameId });
  } else {
    console.error("Game not started or gameId not set.");
  }
});
