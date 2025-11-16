import React, { useState, useRef, useEffect } from "react";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="chat-page">
      <header className="header">Chat App</header>
      <main className="messages-container">
        {messages.map((msg) => (
          <div
            className={`message ${msg.author === "You" ? "me" : "bot"}`}
            key={msg.id}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
        <div style={{ height: "80px" }}></div> {/* Reserve space for input */}
      </main>
      <footer className="footer">
        <textarea
          className="input-message"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button onClick={sendMessage} disabled={!inputValue.trim()}>
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
