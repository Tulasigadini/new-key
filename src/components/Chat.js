import React, { useState, useRef, useEffect } from "react";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim() === "") return;
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

      <main className="chat-main" ref={messagesContainerRef} tabIndex={-1}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bubble ${msg.author === "You" ? "me" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </main>

      <footer className="chat-footer">
        <textarea
          rows={1}
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Chat message input"
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim()}
          className="send-btn"
          aria-label="Send message"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
