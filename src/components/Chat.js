import React, { useState, useRef, useEffect } from "react";
import "./../styles.css"; // reference your global style

const Chat = () => {
  const [messages, setMessages] = useState([{ text: "Welcome!", author: "Bot" }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input.trim(), author: "You" }]);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat App</header>
      <main className="chat-main">
        {messages.map((msg, i) => (
          <div className={`bubble ${msg.author === "You" ? "me" : "bot"}`} key={i}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </main>
      <footer className="chat-footer">
        <textarea
          rows={1}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onFocus={() => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 300)}
        />
        <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
          Send
        </button>
      </footer>
    </div>
  );
};
export default Chat;
