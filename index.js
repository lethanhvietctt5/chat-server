const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { v4 } = require("uuid");

let users = [];

function join({ id, name }) {
  const user = { id, name };
  users.push(user);
  return users;
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function leave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
  return null;
}

const room_id = v4();

// User connect to Socket.IO Server
io.on("connection", (socket) => {
  // User join to room
  socket.on("join", ({ name }) => {
    users = join({ id: socket.id, name });

    socket.join(room_id);
    console.log(name, socket.id);

    // Send notification to other users
    socket.to(room_id).emit("message", {
      id: socket.id,
      name: name,
      message: `${name} has joined room chat`,
    });
  });

  // User send message to room
  socket.on("send_message", ({ id, message }) => {
    const name = users.find((user) => user.id === id);
    io.to(room_id).emit("message", { id, name, message });
  });

  // User disconnect to Socket.IO Server
  socket.on("disconnect", () => {
    const user = leave(socket.id);
    if (user) {
      // Send notification to other users
      socket.broadcast.to(room_id).emit("message", {
        id: null,
        name: null,
        message: `${user.name} has joined room chat`,
      });
    }

    if (socket.client.conn.server.clientsCount == 0) users = [];
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
