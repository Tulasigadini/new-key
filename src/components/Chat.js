import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");
  const messagesRef = useRef(null);
  const containerRef = useRef(null);

  // Adjust chat main bottom padding dynamically to keyboard height
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      const visualViewportHeight = window.visualViewport?.height || vh;
      if (containerRef.current) {
        // Set bottom padding based on viewport difference (keyboard height)
        const paddingBottom = vh - visualViewportHeight;
        containerRef.current.style.paddingBottom = `${paddingBottom + 80}px`; // 80px is footer height
      }
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { id: messages.length + 1, author: "You", text: input.trim() }]);
    setInput("");
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

      <main className="chat-main" ref={messagesRef} aria-live="polite" aria-relevant="additions">
        <div ref={containerRef} className="messages-container">
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
        </div>
      </main>

      <footer className="chat-footer">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Chat message input"
        />
        <button onClick={sendMessage} disabled={!input.trim()} className="send-btn" aria-label="Send message">
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
