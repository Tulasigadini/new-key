import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll function to scroll to bottom (latest messages at bottom)
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Handle viewport resize for keyboard appearance smoothly
  useEffect(() => {
    const onViewportResize = () => {
      // Scroll input into view to prevent hiding behind keyboard
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        scrollToBottom();
      }, 300);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportResize);
    } else {
      window.addEventListener("resize", onViewportResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onViewportResize);
      } else {
        window.removeEventListener("resize", onViewportResize);
      }
    };
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, author: "You", text: inputValue.trim() },
    ]);
    setInputValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat App</header>

      <div className="chat-main" ref={messagesContainerRef}>
        {/* Display messages in normal column order but container is flex-column-reverse */}
        {messages.map((msg) => (
          <div key={msg.id} className={`bubble ${msg.author === "You" ? "me" : "bot"}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <footer className="chat-footer">
        <textarea
          rows={1}
          placeholder="Type a message..."
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
        <button className="send-btn" onClick={sendMessage} disabled={!inputValue.trim()}>
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
