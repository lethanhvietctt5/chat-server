const EVENTS = require("../event");

function disconnect(io, socket, rooms, users) {
  let new_users = [];
  socket.on(EVENTS.disconnect, () => {
    let user = users.find((user) => user.id === socket.id);
    if (user) {
      io.emit(EVENTS.recieve_message, {
        id: null,
        name: null,
        isLeave: true,
        message: `${user.name} has leave room chat`,
      });

      users = users.filter((user) => user.id !== socket.id);
    }
    if (socket.client.conn.server.clientsCount == 0) users = [];

    new_users = users;
  });

  users = new_users;

  return [rooms, users];
}

module.exports = { disconnect };