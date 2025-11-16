import React, { useState, useRef, useEffect } from "react";

const HEADER_HEIGHT = 60; // in pixels
const FOOTER_HEIGHT = 80; // height of input area

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages(prev => [...prev, { id: Date.now(), author: "You", text: input.trim() }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Fixed Header */}
      <div style={{
        height: HEADER_HEIGHT,
        background: "linear-gradient(90deg, #8166e3 60%, #e16ca5 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000
      }}>
        Chat Application
      </div>
      
      {/* Messages area */}
      <div style={{
        marginTop: HEADER_HEIGHT,
        marginBottom: FOOTER_HEIGHT,
        overflowY: "auto",
        flex: 1,
        padding: "10px",
        backgroundColor: "#f4f2fb",
        width: "100%"
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: "flex",
            justifyContent: msg.author === "You" ? "flex-end" : "flex-start",
            marginBottom: "12px"
          }}>
            <div style={{
              backgroundColor: msg.author === "You" ? "#8166e3" : "#e16ca5",
              color: "white",
              padding: "10px 16px",
              borderRadius: "18px",
              maxWidth: "70%",
              wordBreak: "break-word",
              display: "inline-block"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input footer */}
      <div style={{
        height: FOOTER_HEIGHT,
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        boxShadow: "0 -1px 4px rgba(0,0,0,0.1)",
        zIndex: 1000
      }}>
        <textarea
          style={{
            flex: 1,
            height: "50px",
            borderRadius: "20px",
            border: "1px solid #8166e3",
            padding: "10px 14px",
            fontSize: "1rem",
            resize: "none",
            outline: "none"
          }}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#8166e3",
            color: "white",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
          disabled={!input.trim()}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
