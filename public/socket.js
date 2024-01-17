const socket = io();

document.getElementById("nameForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("nameInput").value;
  socket.emit("submitName", name);
  document.getElementById("nameForm").style.display = "none";
  document.getElementById(
    "gameInfo"
  ).innerText = `Hello ${name}, waiting for an opponent...`;
});

socket.on("matchFound", (data) => {
  document.getElementById(
    "gameInfo"
  ).innerText = `Playing against ${data.opponentName}`;
});
