import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../../redux/roomSlice';
import { FiSend } from 'react-icons/fi';
import './Room.css';

const Chat = ({ socket, userName, id }) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const reduxMessages = useSelector((state) => state.room.messages);
  const isLoading = useSelector((state) => state.room.isLoading);
  const error = useSelector((state) => state.room.error);
  
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Chat component mounted');
    console.log('userName:', userName);
    console.log('roomId:', id);
    console.log('Redux messages:', reduxMessages);
  }, [userName, id, reduxMessages]);

  // Fetch initial messages
  useEffect(() => {
    if (id) {
      console.log('Fetching messages for room:', id);
      dispatch(fetchMessages({ roomId: id }));
    }
  }, [dispatch, id]);

  // Update local messages when Redux store changes
  useEffect(() => {
    console.log('Redux messages updated:', reduxMessages);
    if (reduxMessages && Array.isArray(reduxMessages)) {
      setLocalMessages(reduxMessages);
    }
  }, [reduxMessages]);

  const sendHandler = () => {
    if (message.trim()) {
      setIsSending(true);
      
      const messageData = {
        message: message.trim(),
        userName: userName,
        roomId: id
      };
      
      console.log('Sending message:', messageData);
      socket.emit("sendMessage", messageData);
      
      // Add message to local state immediately for better UX
      setLocalMessages(prev => [...prev, messageData]);
      setMessage("");
      
      setTimeout(() => {
        setIsSending(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendHandler();
    }
  };

  // Handle incoming messages
  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      console.log('Received message:', messageData);
      
      // Only add if not already in the list (to avoid duplicates)
      setLocalMessages(prev => {
        const isDuplicate = prev.some(
          msg => msg.userName === messageData.userName && 
                msg.message === messageData.message &&
                // Check if the message was received within the last 2 seconds
                Date.now() - (msg.timestamp || Date.now()) < 2000
        );
        
        if (!isDuplicate) {
          return [...prev, {...messageData, timestamp: Date.now()}];
        }
        return prev;
      });
    };

    if (socket) {
      console.log('Setting up socket listener for receiveMessage');
      socket.on("receiveMessage", handleReceiveMessage);
    }

    return () => {
      if (socket) {
        console.log('Cleaning up socket listener');
        socket.off("receiveMessage", handleReceiveMessage);
      }
    };
  }, [socket]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // If the chat is in a loading state
  if (isLoading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="chat-container">
        <div className="chat-error">
          <p>Error loading messages. Please try again.</p>
          <button 
            onClick={() => dispatch(fetchMessages({ roomId: id }))}
            className="btn primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {localMessages && localMessages.length > 0 ? (
          localMessages.map((msg, index) => (
            <div 
              key={index}
              className={`chat-message ${msg.userName === userName ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-sender">{msg.userName}</span>
              </div>
              <div className="message-content">
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          type="text"
          placeholder="Type your message..."
          className="message-input"
          disabled={isSending}
        />
        <button 
          onClick={sendHandler}
          className="send-button"
          disabled={!message.trim() || isSending}
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Chat;