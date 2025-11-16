import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: "Bot", text: "Welcome to the chat!" },
  ]);
  const [input, setInput] = useState("");
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const messagesRef = useRef(null);

  // Aggressive scroll prevention - force scroll to 0 always
  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    
    // Force scroll to 0 immediately and continuously
    const forceScrollTop = () => {
      if (window.scrollY !== 0 || window.pageYOffset !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };

    // Run immediately
    forceScrollTop();

    // Set up continuous monitoring
    const scrollInterval = setInterval(forceScrollTop, 50);

    // Handle viewport changes
    const updateHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(height);
      forceScrollTop();
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', forceScrollTop);
    }
    
    // Multiple event listeners to catch all scroll attempts
    window.addEventListener('scroll', forceScrollTop, { passive: false, capture: true });
    document.addEventListener('scroll', forceScrollTop, { passive: false, capture: true });
    window.addEventListener('touchmove', forceScrollTop, { passive: false, capture: true });
    window.addEventListener('wheel', forceScrollTop, { passive: false, capture: true });

    return () => {
      clearInterval(scrollInterval);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', forceScrollTop);
      }
      window.removeEventListener('scroll', forceScrollTop);
      document.removeEventListener('scroll', forceScrollTop);
      window.removeEventListener('touchmove', forceScrollTop);
      window.removeEventListener('wheel', forceScrollTop);
      
      // Cleanup
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
    };
  }, []);

  // Scroll messages to bottom on new message
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
