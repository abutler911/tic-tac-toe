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
    if (gameId !== null) {
      socket.emit("cellClicked", { cellIndex, gameId });
    }
  });
});

socket.on("gameStateUpdate", (gameState) => {
  gameState.forEach((cell, index) => {
    document.querySelector(`[data-cell-index='${index}']`).textContent = cell;
  });
});

socket.on("gameOver", (data) => {
  alert(data.message);
});

document.getElementById("reset-button").addEventListener("click", () => {
  if (gameId !== null) {
    socket.emit("resetGame", { gameId });
  }
});

document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("chat-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (message) {
    socket.emit("chatMessage", {
      name: document.getElementById("nameInput").value,
      text: message,
    });
    input.value = "";
  }
}

function sanitizeString(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

socket.on("chatMessage", (data) => {
  const chatWindow = document.getElementById("chat-window");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "message",
    data.name === document.getElementById("nameInput").value
      ? "user-message"
      : "response"
  );
  const sanitizedMessage = sanitizeString(data.text);
  messageElement.innerText = `${data.name}: ${sanitizedMessage}`;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
