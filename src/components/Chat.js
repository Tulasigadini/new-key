import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");
  const appContainerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const updateViewport = () => {
    if (!appContainerRef.current) return;
    const vv = window.visualViewport || { height: window.innerHeight, offsetTop: 0, offsetLeft: 0 };
    const height = vv.height;
    const top = vv.offsetTop;
    const left = vv.offsetLeft;
    appContainerRef.current.style.height = `${height}px`;
    appContainerRef.current.style.top = `${top}px`;
    // Horizontal adjustment if needed (rare for keyboard); here we keep centering on layout as approximation
    // If offsetLeft is significant, you could adjust left/margin, but typically 0 for vertical keyboard
  };

  // Handle viewport changes and prevent scroll
  useEffect(() => {
    updateViewport(); // Initial setup

    const handleVResize = updateViewport;
    const handleVScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      updateViewport();
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleVResize);
      window.visualViewport.addEventListener("scroll", handleVScroll);
    }

    const handleResize = updateViewport;
    const handleScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: false });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleVResize);
        window.visualViewport.removeEventListener("scroll", handleVScroll);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent input focus from scrolling page
  useEffect(() => {
    const preventInputScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      updateViewport();
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
    <div className="app-container" ref={appContainerRef}>
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