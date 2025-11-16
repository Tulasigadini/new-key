import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Handle viewport height changes WITHOUT allowing scroll
  useEffect(() => {
    const handleResize = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setContainerHeight(height);
      
      // Prevent any scroll that might have happened
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", () => window.scrollTo(0, 0));
    }
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", () => window.scrollTo(0, 0), { passive: false });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent input focus from scrolling page
  useEffect(() => {
    const preventInputScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("focus", preventInputScroll);
      inputElement.addEventListener("click", preventInputScroll);
      
      return () => {
        inputElement.removeEventListener("focus", preventInputScroll);
        inputElement.removeEventListener("click", preventInputScroll);
      };
    }
  }, []);

  // Scroll messages to bottom on new message
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

      {/* Scrollable Messages Area */}
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
          ref={inputRef}
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
