import React, { useState, useRef, useEffect } from "react";

const RandomChat = () => {
  const [connectionState, setConnectionState] = useState("disconnected"); // 'disconnected', 'searching', 'connected'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const appContainerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const updateViewport = () => {
    if (!appContainerRef.current) return;
    const vv = window.visualViewport || { height: window.innerHeight, offsetTop: 0 };
    const height = vv.height;
    const top = vv.offsetTop;
    appContainerRef.current.style.height = `${height}px`;
    appContainerRef.current.style.top = `${top}px`;
  };

  useEffect(() => {
    updateViewport();

    const handleVResize = updateViewport;
    const handleVScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      updateViewport();
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleVResize);
      window.visualViewport.addEventListener("scroll", handleVScroll);
    }

    const handleResize = updateViewport;
    const handleScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: false });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleVResize);
        window.visualViewport.removeEventListener("scroll", handleVScroll);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const preventInputScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      updateViewport();
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("focus", preventInputScroll);
      inputElement.addEventListener("click", preventInputScroll);

      return () => {
        inputElement.removeEventListener("focus", preventInputScroll);
        inputElement.removeEventListener("click", preventInputScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startChat = () => {
    setConnectionState("searching");
    setMessages([{ id: Date.now(), author: "System", text: "Searching for a stranger..." }]);
    
    // Simulate finding a stranger after 2 seconds
    setTimeout(() => {
      setConnectionState("connected");
      setMessages(prev => [
        ...prev,
        { id: Date.now(), author: "System", text: "You're now connected to a stranger. Say hi!" }
      ]);
    }, 2000);
  };

  const endChat = () => {
    setConnectionState("disconnected");
    setMessages(prev => [
      ...prev,
      { id: Date.now(), author: "System", text: "You have disconnected from the stranger." }
    ]);
  };

  const newChat = () => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), author: "System", text: "Finding a new stranger..." }
    ]);
    setConnectionState("searching");

    // Simulate finding a new stranger
    setTimeout(() => {
      setConnectionState("connected");
      setMessages(prev => [
        ...prev,
        { id: Date.now(), author: "System", text: "You're now connected to a new stranger. Say hi!" }
      ]);
    }, 2000);
  };

  const sendMessage = () => {
    if (!input.trim() || connectionState !== "connected") return;
    
    setMessages(prev => [...prev, { id: Date.now(), author: "You", text: input.trim() }]);
    setInput("");

    // Simulate stranger response after 1-3 seconds
    setTimeout(() => {
      const responses = [
        "Hello!",
        "How are you?",
        "That's interesting!",
        "Tell me more",
        "Nice to meet you",
        "What do you like to do?",
        "I see",
        "That's cool!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, author: "Stranger", text: randomResponse }
      ]);
    }, Math.random() * 2000 + 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        /* App container - absolutely no scroll */
        .random-chat-container {
          display: flex;
          flex-direction: column;
          max-width: 480px;
          margin: 0 auto;
          background: white;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          overflow: hidden;
          overscroll-behavior: none;
        }

        /* Fixed header */
        .random-chat-header {
          height: 60px;
          background: linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          flex-shrink: 0;
          z-index: 100;
          position: relative;
        }

        .connection-indicator {
          position: absolute;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.disconnected {
          background: #999;
          animation: none;
        }

        .status-dot.searching {
          background: #ffd93d;
        }

        .status-dot.connected {
          background: #6bcf7f;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Start Chat Section */
        .start-chat-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: #f9f9f9;
        }

        .start-chat-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
        }

        .start-chat-icon svg {
          width: 60px;
          height: 60px;
          color: white;
        }

        .start-chat-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 12px;
        }

        .start-chat-description {
          font-size: 1rem;
          color: #666;
          text-align: center;
          margin-bottom: 32px;
          max-width: 300px;
          line-height: 1.5;
        }

        .start-button {
          padding: 16px 48px;
          border-radius: 30px;
          border: none;
          background: linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }

        .start-button:active {
          transform: translateY(0);
        }

        /* Messages area - ONLY scrollable element */
        .random-messages-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background: #f9f9f9;
          -webkit-overflow-scrolling: touch;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overscroll-behavior: contain;
          position: relative;
        }

        /* Messages list */
        .random-messages-list {
          display: flex;
          flex-direction: column;
          padding: 16px;
          min-height: min-content;
        }

        /* Message wrapper */
        .random-message-wrapper {
          display: flex;
          margin-bottom: 12px;
        }

        .random-message-wrapper.left {
          justify-content: flex-start;
        }

        .random-message-wrapper.right {
          justify-content: flex-end;
        }

        .random-message-wrapper.center {
          justify-content: center;
        }

        /* Message bubble */
        .random-message {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 1rem;
          word-wrap: break-word;
        }

        .random-message.stranger {
          background: #e0e0e0;
          color: #333;
        }

        .random-message.me {
          background: #ff6b6b;
          color: white;
        }

        .random-message.system {
          background: #fff3cd;
          color: #856404;
          font-size: 0.9rem;
          max-width: 80%;
          text-align: center;
          border: 1px solid #ffeaa7;
        }

        /* Action Bar - separate bar for buttons */
        .action-bar {
          height: 60px;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          background: #f5f5f5;
          border-top: 1px solid #ddd;
          flex-shrink: 0;
          z-index: 100;
          box-sizing: border-box;
        }

        .action-button {
          padding: 10px 20px;
          border-radius: 20px;
          border: none;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-button:active {
          transform: scale(0.95);
        }

        .action-button.new-chat {
          background: #4caf50;
          color: white;
        }

        .action-button.new-chat:hover {
          background: #45a049;
        }

        .action-button.end-chat {
          background: #f44336;
          color: white;
        }

        .action-button.end-chat:hover {
          background: #da190b;
        }

        .action-button:disabled {
          background: #ccc;
          color: #888;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Fixed footer - no extra space */
        .random-footer {
          height: 70px;
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px 16px;
          background: white;
          border-top: 1px solid #ddd;
          flex-shrink: 0;
          z-index: 100;
          box-sizing: border-box;
        }

        /* Input box - prevent zoom and scroll */
        .random-input-box {
          flex: 1;
          padding: 12px 16px;
          border-radius: 20px;
          border: 1px solid #ff6b6b;
          font-size: 16px;
          resize: none;
          outline: none;
          font-family: inherit;
          overflow-y: hidden;
          box-sizing: border-box;
        }

        .random-input-box:disabled {
          background: #f5f5f5;
          color: #999;
          border-color: #ddd;
        }

        /* Send button */
        .random-send-button {
          padding: 10px 20px;
          border-radius: 20px;
          border: none;
          background: #ff6b6b;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .random-send-button:hover {
          background: #ee5a6f;
        }

        .random-send-button:disabled {
          background: #ffb3ba;
          cursor: not-allowed;
        }

        /* Loading animation */
        .searching-animation {
          display: flex;
          gap: 8px;
          justify-content: center;
          padding: 20px;
        }

        .searching-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff6b6b;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .searching-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .searching-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          }
          40% { 
            transform: scale(1);
          }
        }
      `}</style>

      <div className="random-chat-container" ref={appContainerRef}>
        {/* Fixed Header */}
        <div className="random-chat-header">
          <span>Random Chat</span>
          <div className="connection-indicator">
            <span className={`status-dot ${connectionState}`}></span>
            <span>
              {connectionState === "disconnected" && "Offline"}
              {connectionState === "searching" && "Searching..."}
              {connectionState === "connected" && "Connected"}
            </span>
          </div>
        </div>

        {/* Start Chat Screen */}
        {connectionState === "disconnected" && messages.length === 0 && (
          <div className="start-chat-section">
            <div className="start-chat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="start-chat-title">Random Chat</h1>
            <p className="start-chat-description">
              Connect with strangers around the world. Start chatting anonymously now!
            </p>
            <button className="start-button" onClick={startChat}>
              Start Chat
            </button>
          </div>
        )}

        {/* Messages Area */}
        {(connectionState !== "disconnected" || messages.length > 0) && (
          <>
            <div className="random-messages-area" ref={messagesContainerRef}>
              <div className="random-messages-list">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`random-message-wrapper ${
                      msg.author === "You" ? "right" : 
                      msg.author === "System" ? "center" : "left"
                    }`}
                  >
                    <div className={`random-message ${
                      msg.author === "You" ? "me" : 
                      msg.author === "System" ? "system" : "stranger"
                    }`}>
                      {msg.author === "Stranger" && <strong>Stranger: </strong>}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {connectionState === "searching" && (
                  <div className="searching-animation">
                    <div className="searching-dot"></div>
                    <div className="searching-dot"></div>
                    <div className="searching-dot"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar - Separate bar for New Chat and End Chat buttons */}
            <div className="action-bar">
              <button 
                className="action-button new-chat" 
                onClick={newChat}
                disabled={connectionState === "searching"}
              >
                New Chat
              </button>
              <button 
                className="action-button end-chat" 
                onClick={endChat}
                disabled={connectionState === "disconnected"}
              >
                End Chat
              </button>
            </div>

            {/* Footer Input */}
            <div className="random-footer">
              <textarea
                ref={inputRef}
                className="random-input-box"
                placeholder={
                  connectionState === "connected" 
                    ? "Type a message..." 
                    : connectionState === "searching"
                    ? "Searching for stranger..."
                    : "Connect to start chatting..."
                }
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={connectionState !== "connected"}
              />
              <button 
                className="random-send-button" 
                onClick={sendMessage} 
                disabled={!input.trim() || connectionState !== "connected"}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RandomChat;
