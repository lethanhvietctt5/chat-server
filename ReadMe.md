# Socket.IO Server
Server has been deployed to https://server-chat-js.herokuapp.com/
## Khởi tạo Server
Tạo SocketIO Server thông qua việc sử dụng thư viện [Socket.io](https://socket.io/), [Express](https://expressjs.com/) và một HTTP Server
Cài đặt các package cần thiết <br />
```
npm i express socket.io uuid 
```
Cài đặt Sever
```javascript
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  // Some events and communication
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```
## Một số thao tác với Event
### 1. Lắng nghe Event
```javascript
// Listen when user join to room
socket.on("join", ({ name }) => {
  // Something ...
});

// Listen when user send message to room
socket.on("send_message", ({ id, message }) => {
  // Something ...
});

// Listen when user disconnect to Socket.IO Server
socket.on("disconnect", () => {
  // Something ...
});
```

### 2. Loại bỏ Event Listener
```javascript
const listener = (...args) => {
  console.log(args);
}
socket.on("event", listener);

// Remove Event "event"
socket.off("event", listener);

// Remove all events
socket.removeAllListeners();
```

### 3. Emit event
```javascript
// server-side
io.on("connection", (socket) => {
  socket.on("message", (mess) => {
    console.log(mess); // print message
  });
});

// client-side
socket.emit("message", {mess: "Hello world"});
```

### 4. Broadcast event
```javascript
// Send message to all members except sender
io.on("connection", (socket) => {
  socket.broadcast.emit("message", "Send to all member except sender");
});
```
