import React, { useState, useEffect, useRef } from "react";
import "../styles.css"; // Assuming styles.css is in src/

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome to the chat!", author: "Bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle keyboard resizing to scroll input into view
  useEffect(() => {
    const onResize = () => {
      if (window.visualViewport) {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
        ) {
          setTimeout(() => {
            activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
        }
      }
    };

    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim() === "") return;
    setMessages([...messages, { text: inputValue.trim(), author: "You" }]);
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
      <main className="chat-main">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`bubble ${msg.author === "You" ? "me" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      <footer className="chat-footer">
        <textarea
          rows={1}
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="chat-input"
          onFocus={() =>
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 300)
          }
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={inputValue.trim() === ""}
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
