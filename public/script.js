document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", () => {
    // Handle cell click event
    // Placeholder logic - to be replaced with actual game logic
    if (!cell.textContent && socket.connected) {
      cell.textContent = "X"; // Example: Set 'X' or 'O' based on the current player
      // Emit the move to the server
      socket.emit("playerMove", {
        cellIndex: cell.getAttribute("data-cell-index"),
      });
    }
  });
});
