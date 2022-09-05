import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");   
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {     //Async to wait for message to be sent
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);     //Lets back end know that message data has been sent
      setMessageList((list) => [...list, messageData]);     //Allows user that sent the message to see their own message
      setCurrentMessage("");      //Clears message text field
    }
  };

  useEffect(() => {     //Front end listens to events in server, more specifically when back end emits message from front end. useEffect renders the list of messages that both users see.
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);      //Update message list state
    });
  }, [socket]);

  return (
    <div className="chat-window">     //Chat UI component
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">     //Where messages are displayed
        <ScrollToBottom className="message-container">      //Auto scrolls to bottom for user
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}     //Determines which CSS id to use. If you sent the message, the message should be on the left and green.
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">      //Displays who sent the message and the time that the message was sent.
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">     //Where user writes the messages
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);      //Sets current message
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();     //Send messages using "Enter" key
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>      //Send message button
      </div>
    </div>
  );
}

export default Chat;
