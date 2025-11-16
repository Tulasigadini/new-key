import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

function useViewportHeight() {
  const [vhValue, setVhValue] = useState(window.innerHeight || 0);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setVhValue(window.innerHeight);
    };
    setVh();

    window.addEventListener("resize", setVh);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setVh);
    }

    return () => {
      window.removeEventListener("resize", setVh);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", setVh);
      }
    };
  }, []);

  return vhValue;
}

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom on new message
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

  useViewportHeight();

  return (
    <div className="chat-container">
      <header className="chat-header">Chat App</header>

      <main className="chat-main" aria-live="polite" aria-relevant="additions">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bubble ${msg.author === "You" ? "me" : "bot"}`}
            role="article"
            aria-label={`${msg.author} message`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-footer">
        <textarea
          rows={1}
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Chat input"
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
