const EVENTS = require("../list_events");

function disconnect(io, socket, rooms, users) {
  let new_users = [];
  socket.on(EVENTS.disconnect, () => {
    const user = users.find((each_user) => each_user.id === socket.id);
    if (user) {
      users = users.filter((each_user) => each_user.id !== socket.id);
    }
    if (socket.client.conn.server.clientsCount === 0) users = [];

    new_users = users;
  });

  users = new_users;
  return [rooms, users];
}

module.exports = { disconnect };
