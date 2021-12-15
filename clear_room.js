const EVENTS = require("./list_events");

async function clear(io, room_id) {
  const clients = await io.in(room_id).fetchSockets();
  if (clients && clients.length === 0) return true;
  return false;
}

async function clear_room(io, rooms, users) {
  const emptyRoom = [];
  for (let i = 0; i < rooms.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const isEmpty = await clear(io, rooms[i]);
    if (isEmpty) {
      emptyRoom.push(rooms[i]);
    }
  }
  for (let i = 0; i < emptyRoom.length; i++) {
    rooms = rooms.filter((room) => room !== emptyRoom[i]);
  }

  if (io.engine.clientsCount === 0) users = [];

  const clients = await io.fetchSockets();

  const new_users = [];

  for (let i = 0; i < clients.length; i++) {
    const user = users.find((u) => u.id === clients[i].id);
    if (user) {
      new_users.push(user);
    }
  }

  users = new_users;

  io.emit(EVENTS.list_members, users);
  io.emit(EVENTS.list_rooms, rooms);

  return users;
}

module.exports = { clear_room };
