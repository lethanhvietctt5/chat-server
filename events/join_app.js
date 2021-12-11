const EVENTS = require("../event");

function join_app(io, socket, rooms, users) {
  socket.on(EVENTS.join_app, ({ name }) => {
    const user = users.find((user) => user.id === socket.id);
    if (!user) {
      users.push({ id: socket.id, name });
    }
    io.emit(EVENTS.list_members, users);
    io.emit(EVENTS.list_rooms, rooms);
  });

  return [rooms, users];
}

module.exports = { join_app };
