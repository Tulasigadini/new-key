import React, { useState } from "react";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Hello! How can I help?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), author: "You", text: input.trim() }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      <header className="header">My Chat App</header>
      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.author === "You" ? "me" : "bot"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <textarea
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button disabled={!input.trim()} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
