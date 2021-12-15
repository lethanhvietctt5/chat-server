const { clear_room } = require("../clear_room");
const EVENTS = require("../list_events");

function disconnect(io, socket, rooms, users) {
  socket.on(EVENTS.disconnect, () => {
    const user = users.find((each_user) => each_user.id === socket.id);
    if (user) {
      users = users.filter((each_user) => each_user.id !== socket.id);
    }
    clear_room(io, rooms, users);
  });
}

module.exports = { disconnect };
