const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const EVENTS = require("./event");
const { invidual_message } = require("./events/invidual_message");
const { join_app } = require("./events/join_app");
const { join_room } = require("./events/join_room");
const { room_message } = require("./events/room_message");
const { disconnect } = require("./events/disconnect");

let rooms = [];
let users = [];

io.on(EVENTS.connection, (socket) => {
  for (let i = 0; i < rooms.length; i++) {
    if (
      io.sockets.adapter.rooms[rooms[i]] &&
      io.sockets.adapter.rooms[rooms[i]].length == 0
    ) {
      rooms.filter((room) => room !== rooms[i]);
      i--;
    }
  }

  [rooms, users] = join_app(io, socket, rooms, users);

  [rooms, users] = join_room(io, socket, rooms, users);

  room_message(io, socket, rooms, users);

  invidual_message(io, socket, rooms, users);

  [rooms, users] = disconnect(io, socket, rooms, users);
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
