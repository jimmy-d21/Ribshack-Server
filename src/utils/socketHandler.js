export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`Client connected:`, socket.id);

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected:`, socket.id, "reason:", reason);
    });
    socket.on("error", (err) => {
      console.log(`Client error:`, err);
    });
  });
}
