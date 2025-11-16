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
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [lastMessages, setLastMessages] = useState({
    2: 'Hey, how are you?',
    3: 'See you later!',
    4: 'Image shared'
  });
  const [userStatus, setUserStatus] = useState({
    2: { is_online: true, last_seen: 'Just now' },
    3: { is_online: false, last_seen: '1 hour ago' },
    4: { is_online: true, last_seen: 'Just now' }
  });
  const [unreadCounts, setUnreadCounts] = useState({ user_unread_counts: { 2: 3, 4: 1 } });
  const [fullImage, setFullImage] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);
  const inputRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  // Enhanced keyboard bounce fix
  useEffect(() => {
    const handleResize = useCallback(() => {
      if (window.visualViewport) {
        const newHeight = window.visualViewport.height;
        setKeyboardHeight(window.innerHeight - newHeight);
        if (messagesAreaRef.current) {
          // Prevent bounce by locking scroll
          window.scrollTo(0, 0);
          // Restore scroll position
          const currentScroll = messagesAreaRef.current.scrollTop;
          requestAnimationFrame(() => {
            messagesAreaRef.current.scrollTop = currentScroll + (window.visualViewport.offsetTop || 0);
          });
        }
      }
    }, []);

    if (isMobile) {
      window.visualViewport?.addEventListener('resize', handleResize);
      window.visualViewport?.addEventListener('scroll', handleResize);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
        window.visualViewport?.removeEventListener('scroll', handleResize);
      };
    }
  }, [isMobile]);

  // Handle input focus to prevent bounce
  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (messagesAreaRef.current) {
        messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && messagesAreaRef.current) {
      messagesAreaRef.current.scrollTo({
        top: messagesAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mock fetch users
  useEffect(() => {
    setFilteredUsers(users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, users]);

  // Mock load messages on select
  useEffect(() => {
    if (selectedUser) {
      setMessages([
        { id: 1, content: 'Hello there!', sender_username: selectedUser.username, timestamp: new Date().toISOString() },
        { id: 2, content: 'How are you?', sender_username: user.username, timestamp: new Date(Date.now() - 60000).toISOString(), is_read: true },
        { id: 3, file_url: 'https://via.placeholder.com/200x150?text=Image', file_type: 'image/jpeg', sender_username: selectedUser.username, timestamp: new Date(Date.now() - 120000).toISOString() }
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
      is_read: false
    };
    setMessages(prev => [...prev, newMsg]);
    setLastMessages(prev => ({ ...prev, [selectedUser.id]: message.trim() || 'Image' }));
    setMessage('');
    if (selectedFile) {
      setSelectedFile(null);
      setImagePreview(null);
    }
    scrollToBottom();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file?.size > 5 * 1024 * 1024) return alert('File too large (max 5MB)');
    setSelectedFile(file);
    if (file?.type.startsWith('image/')) setImagePreview(URL.createObjectURL(file));
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatLastSeen = (ts) => {
    const diff = (new Date() - new Date(ts)) / (1000 * 60 * 60);
    return diff < 24 ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(ts).toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ height: '100dvh' }}> {/* Fallback to 100vh */}
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out 
        ${showChat ? (isMobile ? '-translate-x-full' : 'w-80') : 'w-full sm:w-80'} 
        flex flex-col min-w-0 flex-shrink-0 z-40`}>
        <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold truncate">Chats</h2>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 sm:p-3 flex-shrink-0">
            <div className="relative mb-3 sm:mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 sm:pl-10 sm:pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 p-1 sm:p-2">
            {filteredUsers.length ? (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setShowChat(true);
                  }}
                  className={`p-3 cursor-pointer hover:bg-gray-100 rounded-lg flex items-center justify-between transition-colors min-h-[52px] touch-manipulation ${
                    selectedUser?.id === u.id ? 'bg-purple-50 border border-purple-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {u.username[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{u.username}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">{lastMessages[u.id] || 'No messages yet'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${userStatus[u.id]?.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {unreadCounts.user_unread_counts?.[u.id] > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {unreadCounts.user_unread_counts[u.id] > 99 ? '99+' : unreadCounts.user_unread_counts[u.id]}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 text-sm px-4">{searchTerm ? 'No users found' : 'No chats yet'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0 overflow-hidden 
        ${!showChat && isMobile ? 'hidden' : ''}`}>
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-2 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center space-x-2 sm:space-x-3 flex-shrink-0 sticky top-0 z-10">
              {isMobile && (
                <button 
                  onClick={() => setShowChat(false)} 
                  className="p-2 sm:p-3 min-w-[44px] min-h-[44px] rounded-full hover:bg-white/20 flex items-center justify-center"
                >
                  <ArrowLeft size={18} className="sm:size-20" />
                </button>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-white/20 rounded-full flex items-center justify-center">
                {selectedUser.username[0]}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-base truncate">{selectedUser.username}</h3>
                <p className="text-xs sm:text-sm opacity-90 truncate">
                  {userStatus[selectedUser.id]?.is_online ? 'Online' : `Last seen ${formatLastSeen(userStatus[selectedUser.id]?.last_seen)}`}
                </p>
              </div>
            </div>

            {/* Messages - Use gap instead of space-y to avoid overlaps */}
            <div 
              ref={messagesAreaRef} 
              className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50 min-h-0 flex flex-col gap-2 sm:gap-4"
              style={{ paddingBottom: `${Math.max(keyboardHeight, 0)}px` }} // Adjust for keyboard
            >
              {messages.map((msg) => (
                <div key={`${msg.id}-${msg.timestamp}`} className={`flex ${msg.sender_username === user.username ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75vw] sm:max-w-xs lg:max-w-md p-2 sm:p-3 rounded-2xl shadow-sm flex-shrink-0 ${
                      msg.sender_username === user.username
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white order-1'
                        : 'bg-white order-0'
                    }`}
                  >
                    {msg.file_url ? (
                      <img
                        src={msg.file_url}
                        alt="Sent"
                        className="max-w-full max-h-48 rounded-lg cursor-pointer object-contain"
                        onClick={() => setFullImage(msg.file_url)}
                      />
                    ) : (
                      <p className="break-words text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <div className="flex justify-between items-end mt-1 text-xs opacity-75 pt-1">
                      <span className="truncate">{formatTime(msg.timestamp)}</span>
                      {msg.sender_username === user.username && (
                        <span className="ml-1 flex-shrink-0">
                          {msg.is_read ? <CheckCheck size={14} className="sm:size-16" /> : <Check size={14} className="sm:size-16" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className="flex-shrink-0 h-0" />
            </div>

            {/* Input - Fixed position on mobile */}
            <div className={`bg-white border-t flex-shrink-0 z-20 transition-transform duration-300 ${keyboardHeight > 0 ? 'translate-y-0' : ''}`} 
                 style={{ transform: `translateY(-${keyboardHeight}px)`, position: isMobile ? 'fixed' : 'relative', bottom: 0, left: 0, right: 0, width: isMobile ? '100%' : 'auto' }}>
              <div className="p-2 sm:p-4">
                {imagePreview && (
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-100 rounded-lg">
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                    <button 
                      onClick={() => { setSelectedFile(null); setImagePreview(null); }} 
                      className="ml-auto text-red-500 text-lg font-bold p-1 min-w-[32px] min-h-[32px]"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-end space-x-2"> {/* items-end for baseline align */}
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="p-2 sm:p-3 min-w-[44px] min-h-[44px] text-gray-500 hover:text-purple-500 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Upload size={16} className="sm:size-20" />
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
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    onFocus={handleInputFocus}
                    placeholder="Type a message..."
                    className="flex-1 p-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px] max-h-[100px] resize-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() && !selectedFile}
                    className="p-3 min-w-[44px] min-h-[44px] bg-purple-500 text-white rounded-full disabled:opacity-50 hover:bg-purple-600 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                  >
                    <Send size={16} className="sm:size-20" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
            <div className="text-center">
              <User size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-base">Select a chat to start messaging</p>
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
  );
};

export default Chat;