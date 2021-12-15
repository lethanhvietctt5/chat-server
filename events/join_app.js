const { clear_room } = require("../clear_room");
const EVENTS = require("../list_events");

function join_app(io, socket, rooms, users) {
  socket.on(EVENTS.join_app, async ({ name }) => {
    const user = users.find((each_user) => each_user.id === socket.id);
    if (!user) {
      users.push({ id: socket.id, name });
    }
    clear_room(io, rooms, users);
  });
}

module.exports = { join_app };
