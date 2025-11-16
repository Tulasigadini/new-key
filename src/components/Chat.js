import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Send, Check, CheckCheck, Upload, User, Search } from 'lucide-react';

const Chat = () => {
  // Mock user (bypasses login)
  const user = JSON.parse(localStorage.getItem('user')) || {
    token: 'demo-token',
    username: 'You',
    id: 1
  };

  const [users, setUsers] = useState([
    { id: 2, username: 'Alice', is_online: true, last_seen: new Date().toISOString() },
    { id: 3, username: 'Bob', is_online: false, last_seen: new Date(Date.now() - 3600000).toISOString() },
    { id: 4, username: 'Charlie', is_online: true, last_seen: new Date().toISOString() }
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [userStatus, setUserStatus] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({ user_unread_counts: {} });
  const [fullImage, setFullImage] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  // Fix for "Invalid Date" - proper date formatting
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const lastSeenTime = new Date(timestamp);
    if (isNaN(lastSeenTime.getTime())) return 'Invalid Date';
    const now = new Date();
    const diffMs = now - lastSeenTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return lastSeenTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    return lastSeenTime.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const msgTime = new Date(timestamp);
    if (isNaN(msgTime.getTime())) return 'Invalid Time';
    return msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Enhanced keyboard bounce fix with body lock
  useEffect(() => {
    const handleResize = useCallback(() => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        const keyboardVisible = heightDiff > 100;
        setIsKeyboardOpen(keyboardVisible);
        setKeyboardHeight(keyboardVisible ? heightDiff : 0);
        document.body.style.overflow = keyboardVisible ? 'hidden' : '';
        if (messagesAreaRef.current) {
          const currentScroll = messagesAreaRef.current.scrollTop;
          requestAnimationFrame(() => {
            messagesAreaRef.current.scrollTop = currentScroll;
          });
        }
      }
    }, []);

    if (isMobile) {
      window.visualViewport?.addEventListener('resize', handleResize);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
        document.body.style.overflow = '';
      };
    }
  }, [isMobile]);

  // Input focus handler
  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      if (messagesAreaRef.current) {
        messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
      }
    }, 150);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && messagesAreaRef.current) {
      messagesAreaRef.current.scrollTo({
        top: messagesAreaRef.current.scrollHeight,
        behavior: 'auto' // Instant on keyboard open
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mock data setup
  useEffect(() => {
    const filtered = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredUsers(filtered);
    const lastMsgs = {}, status = {}, unread = { user_unread_counts: {} };
    filtered.forEach(u => {
      lastMsgs[u.id] = 'Hey, how are you?'; // Mock last message
      status[u.id] = { 
        is_online: u.is_online, 
        last_seen: formatLastSeen(u.last_seen) 
      };
      unread.user_unread_counts[u.id] = Math.floor(Math.random() * 5);
    });
    setLastMessages(lastMsgs);
    setUserStatus(status);
    setUnreadCounts(unread);
  }, [searchTerm, users]);

  // Load mock messages
  useEffect(() => {
    if (selectedUser) {
      setMessages([
        { 
          id: 1, 
          content: 'Hello there!', 
          sender_username: selectedUser.username, 
          timestamp: new Date(Date.now() - 120000).toISOString(),
          is_delivered: true,
          is_read: false
        },
        { 
          id: 2, 
          content: 'How are you?', 
          sender_username: user.username, 
          timestamp: new Date(Date.now() - 60000).toISOString(),
          is_delivered: true,
          is_read: true
        },
        { 
          id: 3, 
          file_url: 'https://via.placeholder.com/200x150?text=Image', 
          file_type: 'image/jpeg',
          sender_username: selectedUser.username, 
          timestamp: new Date().toISOString(),
          is_delivered: true,
          is_read: false
        }
      ]);
    }
  }, [selectedUser, user]);

  const sendMessage = () => {
    if (!message.trim() && !selectedFile) return;
    const newMsg = {
      id: Date.now(),
      content: message.trim(),
      sender_username: user.username,
      timestamp: new Date().toISOString(),
      is_delivered: true,
      is_read: false
    };
    setMessages(prev => [...prev, newMsg]);
    setLastMessages(prev => ({ ...prev, [selectedUser.id]: message.trim() || 'Image' }));
    setMessage('');
    setSelectedFile(null);
    setImagePreview(null);
    scrollToBottom();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file?.size > 5 * 1024 * 1024) return alert('File too large (max 5MB)');
    setSelectedFile(file);
    if (file?.type.startsWith('image/')) setImagePreview(URL.createObjectURL(file));
  };

  return (
    <>
      <style>{`
        body { 
          overscroll-behavior: none; 
          -webkit-overflow-scrolling: touch; 
        }
        .messages-container::-webkit-scrollbar { width: 0; background: transparent; }
        .messages-container { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ height: isMobile ? '100dvh' : '100vh' }}>
        {/* Sidebar */}
        <div className={`bg-white shadow-lg transition-transform duration-300 ease-in-out flex flex-col min-w-0 flex-shrink-0 z-40
          ${showChat && isMobile ? 'fixed inset-y-0 left-0 w-80 transform -translate-x-full' : showChat ? 'w-80' : 'w-full'}`}>
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0">
            <h2 className="text-xl font-bold">Chats</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 flex-shrink-0">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 p-2">
              {filteredUsers.length ? (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setShowChat(true);
                    }}
                    className={`p-3 cursor-pointer hover:bg-gray-100 rounded-lg flex items-center justify-between transition-colors
                      ${selectedUser?.id === u.id ? 'bg-purple-50' : ''}`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {u.username[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{u.username}</p>
                        <p className="text-sm text-gray-500 truncate">{lastMessages[u.id] || 'No messages yet'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${userStatus[u.id]?.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {unreadCounts.user_unread_counts?.[u.id] > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCounts.user_unread_counts[u.id] > 99 ? '99+' : unreadCounts.user_unread_counts[u.id]}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">{searchTerm ? 'No users found' : 'No chats yet'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar close */}
        {showChat && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setShowChat(false)}
          />
        )}

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 overflow-hidden relative z-10
          ${!showChat && isMobile ? 'hidden' : ''}`}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center space-x-3 flex-shrink-0 sticky top-0 z-20">
                <button 
                  onClick={() => setShowChat(false)} 
                  className="p-2 rounded-full hover:bg-white/20 flex items-center justify-center md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedUser.username[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold truncate">{selectedUser.username}</h3>
                  <p className="text-sm opacity-90 truncate">
                    {userStatus[selectedUser.id]?.is_online ? 'Online' : `Last seen ${userStatus[selectedUser.id]?.last_seen || 'Unknown'}`}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={messagesAreaRef} 
                className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0 flex flex-col"
                style={{ paddingBottom: `${keyboardHeight + 20}px` }}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_username === user.username ? 'justify-end mb-2' : 'justify-start mb-2'}`}>
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                        msg.sender_username === user.username
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                          : 'bg-white'
                      }`}
                    >
                      {msg.file_url ? (
                        <img
                          src={msg.file_url}
                          alt="Sent"
                          className="max-w-full max-h-48 rounded-lg cursor-pointer mb-2"
                          onClick={() => setFullImage(msg.file_url)}
                        />
                      ) : (
                        <p className="break-words whitespace-pre-wrap mb-2">{msg.content}</p>
                      )}
                      <div className="flex justify-between items-center text-xs opacity-75">
                        <span>{formatTime(msg.timestamp)}</span>
                        {msg.sender_username === user.username && (
                          <span className="ml-2">
                            {msg.is_read ? <CheckCheck size={16} /> : <Check size={16} />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Fixed on mobile */}
              <div className={`bg-white border-t flex-shrink-0 z-30 transition-transform duration-300 ${isKeyboardOpen ? 'shadow-2xl' : ''}`}
                   style={{ 
                     transform: `translateY(-${keyboardHeight}px)`, 
                     position: isMobile ? 'fixed' : 'relative', 
                     bottom: 0, 
                     left: 0, 
                     right: 0, 
                     width: isMobile ? '100%' : 'auto' 
                   }}>
                <div className="p-4">
                  {imagePreview && (
                    <div className="flex items-center space-x-2 mb-3 p-3 bg-gray-100 rounded-lg">
                      <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded object-cover" />
                      <button onClick={() => { setSelectedFile(null); setImagePreview(null); }} className="ml-auto text-red-500 text-2xl">×</button>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="p-3 text-gray-500 hover:text-purple-500 rounded-full"
                    >
                      <Upload size={20} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      onFocus={handleInputFocus}
                      placeholder="Type a message..."
                      className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() && !selectedFile}
                      className="p-3 bg-purple-500 text-white rounded-full disabled:opacity-50 hover:bg-purple-600 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <User size={64} className="mx-auto mb-4 opacity-50" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Full Image Modal */}
        {fullImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setFullImage(null)}
          >
            <img src={fullImage} alt="Full" className="max-w-full max-h-full rounded-lg" />
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;