import "./App.css";
import io from "socket.io-client";  
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");     //Connect front end to back end

function App() {
  const [username, setUsername] = useState("");     //State that sets and mutates name
  const [room, setRoom] = useState("");     //State that sets and mutates room
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {    
    if (username !== "" && room !== "") {       //Condition that allows user to join a room
      socket.emit("join_room", room);     //Emit "join_room" event to back end
      setShowChat(true);
    }
  };

  return (                  /*This portion determines whether to show the home screen or the chat screen content*/ 
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">       { /*Initial container that user sees, containing input fields that accept name and room ID*/ }
          <h3>Join A Chat</h3>   
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {            { /*Access the updated data from the changed input field content and set the username*/ }
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>       { /*Listens for click and alerts back end about user's attempt to establish connection to room*/ }
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
