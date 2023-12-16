import React, { useEffect, useState } from 'react'
import { fetchMessages } from '../../redux/roomSlice';
import { useDispatch, useSelector } from 'react-redux';

const Chat = ({socket,chat,userName,id}) => {

    const dispatch = useDispatch()

    const prevMessages = useSelector((state) => state.room.messages);

    const [message, setMessage] = useState();
    const [messages, setMessages] = useState(prevMessages);

    const sendHandler = () => {
        if (message) {
          socket.emit("sendMessage", { message, name: userName, roomId: id });
          setMessage("");
        }
      };

      useEffect(() => {
        dispatch(fetchMessages({roomId:id}));
      },[dispatch])

      useEffect(() => {
        socket.on("recieveMessage", ({ message, name }) => {
            setMessages((messages) => [...messages, { message, userName: name }]);
            // dispatch(fetchMessages({roomId:id}));
          });

          return () => {
            socket.off("recieveMessage");
          };
      },[socket,dispatch,id])

  return (
    <div style={{ display: chat ? "" : "none" }} className="room_chat">
        <div className="chat_msg">
          {messages &&
            messages.map((msg) => (
              <div  className={msg.userName === userName ?"msg sameMsg":"msg"} >
                <h1>{msg.userName}</h1>
                <p>{msg.message}</p>
              </div>
            ))}
        </div>
        <div className="msg_input">
          <input    
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
          />
          <button onClick={() => sendHandler()}>Send</button>
        </div>
      </div>
  )
}

export default Chat
