import React, { useState, useEffect, useRef } from 'react';
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

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesAreaRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  // Maintain scroll on keyboard open (mobile fix)
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport && messagesAreaRef.current) {
        const prevScroll = messagesAreaRef.current.scrollTop;
        requestAnimationFrame(() => {
          messagesAreaRef.current.scrollTop = prevScroll;
        });
      }
    };
    if (isMobile && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    }
  }, [isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <>
      <style jsx>{`
        @media (max-width: 360px) {
          .xs\\:p-1 { padding: 0.25rem; }
          .xs\\:p-2 { padding: 0.5rem; }
          .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
          .xs\\:min-h-10 { min-height: 2.5rem; }
          .xs\\:max-w-11\\/12 { max-width: 91.666667%; }
        }
        @media (max-height: 600px) {
          .short-screen \\:space-y-2 { @apply space-y-2; }
        }
      `}</style>
      <div className="flex h-dvh bg-gray-50 overflow-hidden">
        {/* Sidebar - Ultra-small screen tweaks */}
        <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out 
          ${showChat ? (isMobile ? '-translate-x-full' : 'w-80') : 'w-full sm:w-80'} 
          flex flex-col min-w-0 flex-shrink-0 z-40 xs:p-1`}>
          <div className="p-2 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0">
            <h2 className="text-base sm:text-xl font-bold truncate">Chats</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-1 sm:p-3 flex-shrink-0">
              <div className="relative mb-2 sm:mb-4">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white xs:text-xs"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-0.5 sm:space-y-1 p-1 sm:p-2 xs:space-y-1">
              {filteredUsers.length ? (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setShowChat(true);
                    }}
                    className={`p-2 xs:p-1 cursor-pointer hover:bg-gray-100 rounded-md sm:rounded-lg flex items-center justify-between transition-colors min-h-10 xs:min-h-10 touch-manipulation ${
                      selectedUser?.id === u.id ? 'bg-purple-50 border border-purple-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0 flex-1 xs:space-x-2">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base xs:w-6 xs:h-6">
                        {u.username[0]}
                      </div>
                      <div className="min-w-0 flex-1 xs:mr-1">
                        <p className="font-semibold text-gray-900 text-xs xs:text-xs truncate">{u.username}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-xs xs:text-[10px]">{lastMessages[u.id] || 'No messages yet'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-0.5 sm:space-x-2 flex-shrink-0 ml-1 xs:ml-0.5">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${userStatus[u.id]?.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {unreadCounts.user_unread_counts?.[u.id] > 0 && (
                        <span className="bg-red-500 text-white text-[10px] xs:text-[10px] px-1 py-0.5 rounded-full min-w-[18px] text-center sm:text-xs">
                          {unreadCounts.user_unread_counts[u.id] > 99 ? '99+' : unreadCounts.user_unread_counts[u.id]}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6 text-xs px-2 xs:text-xs"> {searchTerm ? 'No users found' : 'No chats yet'}</p>
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
              <div className="p-2 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center space-x-1 sm:space-x-3 flex-shrink-0 sticky top-0 z-10">
                {isMobile && (
                  <button 
                    onClick={() => setShowChat(false)} 
                    className="p-1.5 sm:p-3 min-w-[40px] min-h-[40px] rounded-full hover:bg-white/20 flex items-center justify-center xs:min-w-[36px] xs:min-h-[36px]"
                  >
                    <ArrowLeft size={16} className="sm:size-20 xs:size-14" />
                  </button>
                )}
                <div className="w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0 bg-white/20 rounded-full flex items-center justify-center text-sm sm:text-base xs:w-6 xs:h-6">
                  {selectedUser.username[0]}
                </div>
                <div className="min-w-0 flex-1 xs:mr-1">
                  <h3 className="font-bold text-sm sm:text-base truncate xs:text-xs">{selectedUser.username}</h3>
                  <p className="text-xs sm:text-sm opacity-90 truncate xs:text-[10px]">
                    {userStatus[selectedUser.id]?.is_online ? 'Online' : `Last seen ${formatLastSeen(userStatus[selectedUser.id]?.last_seen)}`}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesAreaRef} className="flex-1 overflow-y-auto p-1 sm:p-4 space-y-2 sm:space-y-4 bg-gray-50 min-h-0 short-screen:space-y-2 xs:p-2 xs:space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_username === user.username ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80vw] sm:max-w-xs lg:max-w-md p-1.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm flex-shrink-0 xs:max-w-[85vw] xs:p-2 ${
                        msg.sender_username === user.username
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                          : 'bg-white'
                      }`}
                    >
                      {msg.file_url ? (
                        <img
                          src={msg.file_url}
                          alt="Sent"
                          className="max-w-full max-h-32 sm:max-h-48 rounded cursor-pointer object-contain xs:max-h-28"
                          onClick={() => setFullImage(msg.file_url)}
                        />
                      ) : (
                        <p className="break-words text-xs leading-tight sm:leading-relaxed xs:text-[11px]">{msg.content}</p>
                      )}
                      <div className="flex justify-between items-end mt-0.5 sm:mt-1 text-[10px] sm:text-xs opacity-75 xs:mt-0.5">
                        <span className="truncate max-w-[35%] xs:max-w-[30%]">{formatTime(msg.timestamp)}</span>
                        {msg.sender_username === user.username && (
                          <span className="ml-0.5 flex-shrink-0 xs:ml-0.5">
                            {msg.is_read ? <CheckCheck size={12} className="sm:size-16 xs:size-11" /> : <Check size={12} className="sm:size-16 xs:size-11" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-1 sm:p-4 bg-white border-t flex-shrink-0 sticky bottom-0 z-10 xs:p-2">
                {imagePreview && (
                  <div className="flex items-center space-x-1 mb-1 p-1.5 bg-gray-100 rounded xs:space-x-1 xs:p-1.5 xs:mb-1">
                    <img src={imagePreview} alt="Preview" className="w-8 h-8 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0 xs:w-7 xs:h-7" />
                    <button 
                      onClick={() => { setSelectedFile(null); setImagePreview(null); }} 
                      className="ml-auto text-red-500 text-base font-bold p-0.5 min-w-[28px] min-h-[28px] xs:text-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-0.5 sm:space-x-2 xs:space-x-1">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="p-1.5 sm:p-3 min-w-[40px] min-h-[40px] text-gray-500 hover:text-purple-500 rounded-full flex items-center justify-center xs:min-w-[36px] xs:min-h-[36px] xs:p-1"
                  >
                    <Upload size={14} className="sm:size-20 xs:size-12" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-1.5 sm:p-3 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[36px] max-h-[80px] resize-none xs:p-1.5 xs:text-xs xs:min-h-[34px]"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() && !selectedFile}
                    className="p-1.5 sm:p-3 min-w-[40px] min-h-[40px] bg-purple-500 text-white rounded-full disabled:opacity-50 hover:bg-purple-600 disabled:cursor-not-allowed flex items-center justify-center xs:min-w-[36px] xs:min-h-[36px] xs:p-1"
                  >
                    <Send size={14} className="sm:size-20 xs:size-12" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4 xs:p-2">
              <div className="text-center">
                <User size={28} className="mx-auto mb-2 opacity-50 sm:size-48 xs:size-24" />
                <p className="text-xs sm:text-base xs:text-xs">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Full Image Modal */}
        {fullImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 xs:p-1"
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