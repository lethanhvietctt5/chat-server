const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const EVENTS = require("./list_events");
const { invidual_message } = require("./events/invidual_message");
const { join_app } = require("./events/join_app");
const { join_room } = require("./events/join_room");
const { room_message } = require("./events/room_message");
const { leave_room } = require("./events/leave_room");
const { disconnect } = require("./events/disconnect");

var rooms = [];
var users = [];

io.on(EVENTS.connection, (socket) => {
  for (let i = 0; i < rooms.length; i++) {
    if (
      io.sockets.adapter.rooms[rooms[i]] &&
      io.sockets.adapter.rooms[rooms[i]].length === 0
    ) {
      rooms.filter((room) => room !== rooms[i]);
      i--;
    }
  }

  join_app(io, socket, rooms, users);

  join_room(io, socket, rooms, users);

  leave_room(io, socket, rooms, users);

  room_message(io, socket, rooms, users);

  invidual_message(io, socket, rooms, users);

  disconnect(io, socket, rooms, users);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
