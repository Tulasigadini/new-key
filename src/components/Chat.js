import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [currentView, setCurrentView] = useState("userList"); // 'userList' or 'chat'
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const appContainerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Mock users data with online status
  const [users] = useState([
    { id: 1, name: "Alice Johnson", online: true, lastMessage: "Hey there!", time: "2m ago" },
    { id: 2, name: "Bob Smith", online: false, lastMessage: "See you tomorrow", time: "1h ago" },
    { id: 3, name: "Carol White", online: true, lastMessage: "Thanks!", time: "5m ago" },
    { id: 4, name: "David Brown", online: true, lastMessage: "Got it", time: "10m ago" },
    { id: 5, name: "Emma Davis", online: false, lastMessage: "Sounds good", time: "3h ago" },
  ]);

  // Initialize messages for each user
  useEffect(() => {
    const initialMessages = {};
    users.forEach(user => {
      initialMessages[user.id] = [
        { id: 1, author: "Bot", text: `Chat started with ${user.name}` }
      ];
    });
    setMessages(initialMessages);
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  }, [currentView]);

  useEffect(() => {
    if (messagesContainerRef.current && selectedUser) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, selectedUser]);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;
    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [
        ...(prev[selectedUser.id] || []),
        { id: Date.now(), author: "You", text: input.trim() }
      ]
    }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = (user) => {
    setSelectedUser(user);
    setCurrentView("chat");
    setMenuOpen(false);
  };

  const goBackToUserList = () => {
    setCurrentView("userList");
    setSelectedUser(null);
  };

  // User List View
  if (currentView === "userList") {
    return (
      <div className="app-container" ref={appContainerRef}>
        {/* Header with icons */}
        <div className="header">
          <button 
            className="icon-button hamburger-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="header-title">Chat App</span>
          <div className="header-icons">
            <button className="icon-button" aria-label="Friend requests">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="badge">3</span>
            </button>
            <button className="icon-button" aria-label="Settings">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6M3.93 3.93l4.24 4.24m5.66 5.66l4.24 4.24M1 12h6m6 0h6M3.93 20.07l4.24-4.24m5.66-5.66l4.24-4.24" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Hamburger Menu */}
        {menuOpen && (
          <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
            <div className="menu-panel" onClick={e => e.stopPropagation()}>
              <div className="menu-header">
                <h3>Menu</h3>
                <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>
              </div>
              <ul className="menu-list">
                <li onClick={() => setMenuOpen(false)}>Profile</li>
                <li onClick={() => setMenuOpen(false)}>Friend Requests</li>
                <li onClick={() => setMenuOpen(false)}>Settings</li>
                <li onClick={() => setMenuOpen(false)}>Help & Support</li>
                <li onClick={() => setMenuOpen(false)}>Logout</li>
              </ul>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Users List */}
        <div className="users-list-container">
          {filteredUsers.length === 0 ? (
            <div className="no-results">No users found</div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="user-item" onClick={() => openChat(user)}>
                <div className="user-avatar-container">
                  <div className="user-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <span className={`status-dot ${user.online ? 'online' : 'offline'}`}></span>
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-last-message">{user.lastMessage}</div>
                </div>
                <div className="user-time">{user.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="app-container" ref={appContainerRef}>
      {/* Chat Header */}
      <div className="header chat-header">
        <button className="icon-button back-btn" onClick={goBackToUserList} aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="chat-header-info">
          <div className="chat-user-avatar-small">
            {selectedUser?.name.charAt(0)}
          </div>
          <div>
            <div className="chat-user-name">{selectedUser?.name}</div>
            <div className="chat-user-status">
              {selectedUser?.online ? "Online" : "Offline"}
            </div>
          </div>
        </div>
        <button className="icon-button" aria-label="More options">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="12" cy="5" r="1" fill="currentColor"/>
            <circle cx="12" cy="19" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="messages-area" ref={messagesContainerRef}>
        <div className="messages-list">
          {(messages[selectedUser?.id] || []).map(msg => (
            <div key={msg.id} className={`message-wrapper ${msg.author === "You" ? "right" : "left"}`}>
              <div className={`message ${msg.author === "You" ? "me" : "bot"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Input */}
      <div className="footer">
        <textarea
          ref={inputRef}
          className="input-box"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="send-button" onClick={sendMessage} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
