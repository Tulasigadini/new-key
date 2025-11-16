import React, { useState, useRef, useEffect } from "react";
import SimpleBar from "simplebar-react"; // Optional smooth scrollbar
import "simplebar-react/dist/simplebar.min.css";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Ref to track visual viewport height for keyboard detection
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onVisualViewportResize = () => {
      setVh(window.visualViewport ? window.visualViewport.height : window.innerHeight);

      // Scroll input into view when keyboard appears
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        setTimeout(() => {
          activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 250);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onVisualViewportResize);
    } else {
      // fallback for browsers without VisualViewport API
      window.addEventListener("resize", () => setVh(window.innerHeight));
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onVisualViewportResize);
      } else {
        window.removeEventListener("resize", () => setVh(window.innerHeight));
      }
    };
  }, []);

  // Scroll to bottom on messages update
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
    <div className="chat-container" style={{ height: vh }}>
      <header className="chat-header">Chat App</header>

      {/* Optional smooth custom scrollbar */}
      <SimpleBar className="chat-main" forceVisible="y" autoHide={false}>
        {messages.map((msg) => (
          <div key={msg.id} className={`bubble ${msg.author === "You" ? "me" : "bot"}`}>
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
          onFocus={() => {
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 300);
          }}
        />
        <button className="send-btn" onClick={sendMessage} disabled={!inputValue.trim()}>
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
