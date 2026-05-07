import { useState, useEffect, useContext } from 'react';
import { FiSend, FiSmile, FiPaperclip } from 'react-icons/fi';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { AlertContext } from '../contexts/AlertContext';
import * as chatService from '../services/chatService';
import * as authService from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useContext(AlertContext);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [messagesData, allUsersData] = await Promise.all([
          chatService.getMessages(),
          authService.getUsers()
        ]);
        setMessages(messagesData);
        
        const chatUsers = allUsersData
          .filter(u => u.user_id !== user?.user_id)
          .map(u => {
            const userMessages = messagesData.filter(m => m.sender_id === u.user_id || m.receiver_id === u.user_id);
            const latestMessage = userMessages[userMessages.length - 1];
            const unreadCount = userMessages.filter(m => m.sender_id === u.user_id && m.receiver_id === user?.user_id && !m.is_read).length;
            
            return {
              id: u.user_id,
              name: u.username,
              role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
              status: u.account_status === 'active' ? 'online' : 'offline',
              avatar: u.username.charAt(0).toUpperCase(),
              latestTimestamp: latestMessage ? new Date(latestMessage.timestamp).getTime() : 0,
              unreadCount: unreadCount
            };
          })
          .sort((a, b) => b.latestTimestamp - a.latestTimestamp);
        
        setUsers(chatUsers);
      } catch (err) {
        console.error('Error fetching messages:', err);
        showError('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError, user]);

  useEffect(() => {
    if (!selectedUser && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const markRead = async () => {
        const unreadForSelected = messages.filter(m => m.sender_id === selectedUser.id && m.receiver_id === user?.user_id && !m.is_read);
        if (unreadForSelected.length > 0) {
          try {
            await chatService.markAsRead(selectedUser.id);
            setMessages(prev => prev.map(m => 
              (m.sender_id === selectedUser.id && m.receiver_id === user?.user_id) ? { ...m, is_read: true } : m
            ));
            setUsers(prev => prev.map(u => 
              u.id === selectedUser.id ? { ...u, unreadCount: 0 } : u
            ));
          } catch (error) {
            console.error("Failed to mark read:", error);
          }
        }
      };
      markRead();
    }
  }, [selectedUser, messages, user?.user_id]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser) {
      try {
        const response = await chatService.sendMessage(selectedUser.id, message.trim());
        const newMessage = response.data || response;
        
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        
        setUsers(prev => {
          const updatedUsers = prev.map(u => 
            u.id === selectedUser.id ? { ...u, latestTimestamp: Date.now() } : u
          );
          return updatedUsers.sort((a, b) => b.latestTimestamp - a.latestTimestamp);
        });
      } catch (err) {
        showError('Failed to send message');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Live Chat</h1>
        <p className="text-secondary-600">Connect with healthcare professionals</p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
        <Card className="md:col-span-1 overflow-y-auto flex-shrink-0 h-64 md:h-auto">
          <h2 className="text-lg font-bold text-secondary-900 mb-4">Conversations</h2>
          <div className="space-y-3">
            {users.map((usr) => (
              <button
                key={usr.id}
                onClick={() => setSelectedUser(usr)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${selectedUser?.id === usr.id ? 'bg-primary-100 border border-primary-300' : 'hover:bg-secondary-100'}
                `}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {usr.avatar}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      usr.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-secondary-900">{usr.name}</p>
                    {usr.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {usr.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary-500">{usr.role}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="md:col-span-3 flex flex-col flex-1 min-h-0">
          {selectedUser ? (
            <>
              <div className="pb-4 border-b border-secondary-200 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-secondary-900">{selectedUser.name}</h3>
                    <p className="text-xs text-secondary-500 flex items-center gap-2">
                      <span className={selectedUser.status === 'online' ? 'text-green-500' : 'text-gray-400'}>●</span>
                      {selectedUser.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.message_id}
                    className={`flex ${msg.sender_id === user?.user_id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-xs px-4 py-2 rounded-lg
                        ${msg.sender_id === user?.user_id
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-secondary-100 text-secondary-900 rounded-bl-none'
                        }
                      `}
                    >
                      <p className={`text-sm ${msg.sender_id === user?.user_id ? 'text-white' : 'text-secondary-900'}`}>{msg.message_text}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user?.user_id ? 'text-primary-100' : 'text-secondary-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                  <FiPaperclip size={20} className="text-secondary-600" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                  <FiSmile size={20} className="text-secondary-600" />
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendMessage}
                  icon={FiSend}
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-secondary-500">Select a conversation to start</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
