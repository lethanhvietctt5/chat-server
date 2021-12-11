const EVENTS = require("../event");

function invidual_message(io, socket, rooms, users) {
  socket.on(EVENTS.send_invidual_message, ({ message, id_reciever }) => {
    io.to(id_reciever).emit(EVENTS.recieve_invidual_message, {
      id: socket.id,
      name: users.find((user) => user.id === socket.id).name,
      message,
    });
  });
}

module.exports = { invidual_message };
