const EVENTS = require("../list_events");

function leave_room(io, socket, rooms, users) {
  socket.on(EVENTS.leave_room, ({ room_id }) => {
    if (room_id && rooms.indexOf(room_id) !== -1) {
      socket.leave(room_id);
      const { name } = users.find((user) => user.id === socket.id);
      io.to(room_id).emit(EVENTS.recieve_message, {
        id: socket.id,
        name,
        message: `${name} left the room`,
        isLeave: true,
      });
    }
  });
}

module.exports = { leave_room };
