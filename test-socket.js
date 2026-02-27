const io = require("socket.io-client");

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("✅ Conectado:", socket.id);

  socket.emit("join_room", {
    roomId: "c5a9295e-0849-4455-a0ca-afa43bb44deb",
    userId: "64d655fd-e334-449f-adfa-757a0f0b0dbd"
  });
});

socket.on("user_joined", (data) => {
  console.log("👤 Usuario agregado:", data);
});

socket.on("user_left", (data) => {
  console.log("👤 Usuario salió:", data);
});

socket.on("error", (err) => {
  console.log("❌ Error:", err);
});