import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const messagesContainerRef = useRef(null);

  // Handle viewport height changes (keyboard appearance)
  useEffect(() => {
    const handleResize = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setContainerHeight(height);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport.removeEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="app-container" style={{ height: `${containerHeight}px` }}>
      {/* Fixed Header */}
      <div className="header">
        <span>Chat App</span>
      </div>

      {/* Scrollable Messages Area - messages start from bottom */}
      <div className="messages-area" ref={messagesContainerRef}>
        <div className="messages-list">
          {messages.map(msg => (
            <div key={msg.id} className={`message-wrapper ${msg.author === "You" ? "right" : "left"}`}>
              <div className={`message ${msg.author === "You" ? "me" : "bot"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Footer Input */}
      <div className="footer">
        <textarea
          className="input-box"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="send-button" onClick={sendMessage} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
