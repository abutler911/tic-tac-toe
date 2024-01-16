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

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Server up on port ${port}...`));
