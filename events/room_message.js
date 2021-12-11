const EVENTS = require("../event");

function room_message(io, socket, rooms, users) {
  socket.on(EVENTS.send_message, ({ room_id, message }) => {
    const name = users.find((user) => user.id === socket.id);
    io.to(room_id).emit(EVENTS.recieve_message, { id, name, message });
  });
}

module.exports = { room_message };
