const express = require("express");   
const app = express();
const http = require("http");   //Need http to build server with Socket.io
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());   //Cors is a library from Socket.io that helps detect and resolve bugs

const server = http.createServer(app);    //Create server by passing an express app

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {   //Listens for events on port 3001. When server runs, console outputs message, letting us know.
  console.log("SERVER RUNNING");
});
