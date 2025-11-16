import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const messagesRef = useRef(null);

  // Lock viewport height and prevent any scrolling
  useEffect(() => {
    // Immediately lock scroll on mount
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    const updateHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(height);
      
      // Force scroll to 0 on any height change
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    };

    // Update on visual viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
    }
    
    // Prevent all scroll attempts
    const preventScroll = (e) => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('scroll', preventScroll, { passive: false });
    document.addEventListener('touchmove', (e) => {
      if (!messagesRef.current?.contains(e.target)) {
        e.preventDefault();
      }
    }, { passive: false });

    updateHeight();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
      }
      window.removeEventListener('scroll', preventScroll);
    };
  }, []);

  // Scroll messages to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
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
    <div className="chat-wrapper" style={{ height: `${viewportHeight}px` }}>
      <div className="chat-header">Chat App</div>
      
      <div className="chat-messages" ref={messagesRef}>
        <div className="messages-spacer"></div>
        {messages.map(msg => (
          <div key={msg.id} className={`msg ${msg.author === "You" ? "me" : "bot"}`}>
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}
      </div>
      
      <div className="chat-input-area">
        <textarea
          className="input"
          placeholder="Type message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button 
          className="btn-send" 
          onClick={sendMessage} 
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
