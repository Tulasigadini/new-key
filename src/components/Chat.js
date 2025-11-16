import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesRef = useRef(null);

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setViewportHeight(vh);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim() === "") return;
    setMessages(prev => [...prev, {id: prev.length + 1, author: "You", text: inputValue.trim()}]);
    setInputValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container" style={{height: viewportHeight}}>
      <header className="chat-header">Chat App</header>
      <main className="chat-main" ref={messagesRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`bubble ${msg.author === "You" ? "me" : "bot"}`}>
            {msg.text}
          </div>
        ))}
      </main>
      <footer className="chat-footer">
        <textarea
          rows={1}
          className="chat-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
        />
        <button className="send-btn" onClick={sendMessage} disabled={!inputValue.trim()}>
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
