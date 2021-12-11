const EVENTS = require("../event");

function join_room(io, socket, rooms, users) {
  socket.on(EVENTS.join_room, ({ roomID, name }) => {
    if (roomID && rooms.indexOf(roomID) === -1) {
      rooms.push(roomID);
    }

    socket.join(roomID);

    socket.to(roomID).emit(EVENTS.recieve_message, {
      id: socket.id,
      name: name,
      message: `${name} has joined room chat`,
      isNewUser: true,
    });
  });

  return [rooms, users];
}

module.exports = { join_room };
