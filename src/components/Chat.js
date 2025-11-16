import React, { useState, useRef, useEffect } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { List } from "react-window";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const listRef = useRef(null);
  const footerRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    // scroll to last item
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1);
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim() === "") return;
    setMessages([
      ...messages,
      { id: messages.length + 1, author: "You", text: inputValue.trim() },
    ]);
    setInputValue("");
  };

  // Handle enter key to send message
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Estimate row height for messages (can be fine tuned)
  const rowHeight = 60;

  // Render each message row
  const Row = ({ index, style }) => {
    const msg = messages[index];
    return (
      <div
        style={{
          ...style,
          padding: "10px 20px",
          display: "flex",
          justifyContent: msg.author === "You" ? "flex-end" : "flex-start",
        }}
      >
        <div
          className={`bubble ${msg.author === "You" ? "me" : "bot"}`}
          style={{ maxWidth: "70%" }}
          role="article"
          aria-label={`${msg.author} message`}
        >
          {msg.text}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat App</header>

      {/* Auto size message list */}
      <div className="chat-main">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={messages.length}
              itemSize={rowHeight}
              width={width}
              ref={listRef}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>

      <footer className="chat-footer" ref={footerRef}>
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
          className="send-btn"
          onClick={sendMessage}
          disabled={!inputValue.trim()}
          aria-label="Send message"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default Chat;
