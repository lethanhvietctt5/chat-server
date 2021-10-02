let users = [];

function join({ id, name }) {
  const user = { id, name };
  users.push(user);
  return users;
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function leave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
  return null;
}

module.export = {
  users,
  join,
  getUser,
  leave,
};
