const express = require("express");   
const app = express();
const http = require("http");     //Need http to build server with Socket.io
const cors = require("cors");
const { Server } = require("socket.io");   
app.use(cors());    //Cors is a library from node.js that helps detect and resolve bugs

const server = http.createServer(app);      //Create server by passing an express app

const io = new Server(server, {     //io is the connection that we will be establishing to server. 
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {     //Detects (listens for) connection events. When someone connects, we call the callback function to print user ID obtained from prop.
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {      //Listens for the "join_room" event emitted by socket object from front end.
    socket.join(data);      //Join room ID sent from front end as "data" prop. Socket.io automatically creates the room
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {     //Server listens for the message sent by the user.
    socket.to(data.room).emit("receive_message", data);     //Server then sends the message back to the other user.
  });

  socket.on("disconnect", () => {     //Listens for when someone disconnects from server
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {     //Listens for events on port 3001. When server runs, console outputs message, letting us know.
  console.log("SERVER RUNNING");
});
