import React, { useState, useEffect, useRef } from "react";
import SimpleBar from "simplebar-react"; // optional for smooth scrolling
import "simplebar-react/dist/simplebar.min.css";
import "../styles.css";

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    return () => {
      window.removeEventListener("resize", setViewportHeight);
    };
  }, []);

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
    <div className="chat-container">
      <header className="chat-header">Chat App</header>
      <SimpleBar className="chat-main" forceVisible="y" autoHide={false}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bubble ${msg.author === "You" ? "me" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </SimpleBar>
      <footer className="chat-footer">
        <textarea
          rows={1}
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() =>
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 300)
          }
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!inputValue.trim()}
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
