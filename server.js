const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Tic Tac Toe Server Running");
});

let waitingPlayer = null;
const games = new Map();

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

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("submitName", (name) => {
    socket.playerName = name;
    if (!waitingPlayer) {
      waitingPlayer = socket;
      console.log(`${name} is waiting for an opponent.`);
    } else {
      const gameState = Array(9).fill(null);
      const gameId = "game_" + socket.id;

      games.set(gameId, {
        players: [waitingPlayer, socket],
        gameState,
        currentPlayer: waitingPlayer,
      });

      waitingPlayer.emit("matchFound", { opponentName: name, gameId });
      socket.emit("matchFound", {
        opponentName: waitingPlayer.playerName,
        gameId,
      });

      waitingPlayer = null;
    }
  });

  socket.on("cellClicked", (data) => {
    console.log(`Cell ${data.cellIndex} clicked by ${socket.playerName}.`);
    const game = games.get(data.gameId);
    if (!game || game.gameState[data.cellIndex] !== null) return;

    const playerIndex = game.players.indexOf(socket);
    if (game.currentPlayer !== socket) return;

    game.gameState[data.cellIndex] = playerIndex === 0 ? "X" : "O";

    if (checkWin(game.gameState, playerIndex === 0 ? "X" : "O")) {
      endGame(game, `${socket.playerName} wins!`);
      return;
    }

    if (checkDraw(game.gameState)) {
      endGame(game, `It's a draw!`);
      return;
    }

    game.currentPlayer = game.players[(playerIndex + 1) % 2];
    broadcastGameState(game);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

function checkWin(gameState, player) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return gameState[index] === player;
    });
  });
}

function checkDraw(gameState) {
  return gameState.every((cell) => cell !== null);
}

function endGame(game, message) {
  game.players.forEach((player) =>
    player.emit("gameOver", { gameState: game.gameState, message })
  );
  games.delete(game.id);
}

function broadcastGameState(game) {
  game.players.forEach((player) =>
    player.emit("gameStateUpdate", game.gameState)
  );
}

server.listen(port, () => console.log(`Server up on port ${port}...`));
