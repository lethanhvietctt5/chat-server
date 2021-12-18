const { clear_room } = require("../clear_room");
const EVENTS = require("../list_events");

function join_room(io, socket, rooms, users) {
  socket.on(EVENTS.join_room, async ({ roomID, name }) => {
    if (roomID && rooms.indexOf(roomID) === -1) {
      rooms.push(roomID);
    }

    socket.join(roomID);
    clear_room(io, rooms, users);

    socket.to(roomID).emit(EVENTS.recieve_message, {
      id: socket.id,
      name,
      message: `${name} has joined room chat`,
      isNewUser: true,
    });

    socket.on(EVENTS.disconnect, async () => {
      socket.to(roomID).emit(EVENTS.recieve_message, {
        id: socket.id,
        name,
        message: `${name} has left the room`,
        isLeave: true,
      });

      const user = users.find((each_user) => each_user.id === socket.id);
      if (user) {
        users = users.filter((each_user) => each_user.id !== socket.id);
      }
      clear_room(io, rooms, users);
    });
  });
}

module.exports = { join_room };
