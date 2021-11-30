const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let rooms = [];
let users = [];

io.on("connection", (socket) => {
  //
  // TODO: Check for empty rooms
  for (let i = 0; i < rooms.length; i++) {
    if (
      io.sockets.adapter.rooms[rooms[i]] &&
      io.sockets.adapter.rooms[rooms[i]].length == 0
    ) {
      rooms.filter((room) => room !== rooms[i]);
      i--;
    }
  }

  // TODO: Send list of available rooms to new client
  io.to(socket.id).emit("rooms", rooms);

  // TODO: User join to room
  socket.on("join", ({ roomID, name }) => {
    if (roomID && rooms.indexOf(roomID) === -1) {
      rooms.push(roomID);
    }

    socket.join(roomID);
    users.push({ id: socket.id, name });

    // TODO: Send notification to other users
    socket.to(roomID).emit("message", {
      id: socket.id,
      name: name,
      message: `${name} has joined room chat`,
      isNewUser: true,
    });
  });

  // TODO: User send message to room
  socket.on("send_message", ({ room_id, message }) => {
    const name = users.find((user) => user.id === socket.id);
    io.to(room_id).emit("message", { id, name, message });
  });

  // TODO: User send message to others
  socket.on("invidial_message", ({ message, id_reciever }) => {
    io.to(id_reciever).emit("message", {
      id: socket.id,
      name: users.find((user) => user.id === socket.id).name,
      message,
    });
  });

  // TODO: User disconnect to Socket.IO Server
  socket.on("disconnect", () => {
    if (users.find((user) => user.id === socket.id).length > 0) {
      // Send notification to other users
      socket.broadcast.to(room_id).emit("message", {
        id: null,
        name: null,
        isLeave: true,
        message: `${user.name} has joined room chat`,
      });

      users = users.filter((user) => user.id !== socket.id);
    }
    if (socket.client.conn.server.clientsCount == 0) users = [];
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
