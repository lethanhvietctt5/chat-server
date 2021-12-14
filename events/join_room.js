const EVENTS = require("../list_events");

function join_room(io, socket, rooms, users) {
  socket.on(EVENTS.join_room, ({ roomID, name }) => {
    if (roomID && rooms.indexOf(roomID) === -1) {
      rooms.push(roomID);
    }

    socket.join(roomID);
    io.emit(EVENTS.list_members, users);
    io.emit(EVENTS.list_rooms, rooms);

    socket.to(roomID).emit(EVENTS.recieve_message, {
      id: socket.id,
      name,
      message: `${name} has joined room chat`,
      isNewUser: true,
    });

    socket.on(EVENTS.disconnect, () => {
      socket.to(roomID).emit(EVENTS.recieve_message, {
        id: socket.id,
        name,
        message: `${name} has left room chat`,
        isNewUser: false,
      });

      const user = users.find((each_user) => each_user.id === socket.id);
      if (user) {
        users = users.filter((each_user) => each_user.id !== socket.id);
      }
      if (socket.client.conn.server.clientsCount === 0) users = [];
      io.emit(EVENTS.list_members, users);
      io.emit(EVENTS.list_rooms, rooms);
    });
  });

  return [rooms, users];
}

module.exports = { join_room };
