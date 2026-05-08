import { useState, useEffect, useContext } from 'react';
import { FiSend, FiSmile, FiPaperclip } from 'react-icons/fi';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { AlertContext } from '../contexts/AlertContext';
import * as chatService from '../services/chatService';
import { useAuth } from '../hooks/useAuth';

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useContext(AlertContext);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await chatService.getConversations();
        setConversations(data);
        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        showError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [showError, user]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation) {
      try {
        const otherUser = selectedConversation.other_participant;
        const response = await chatService.sendMessage(otherUser.user_id, message.trim());
        const newMessage = response.data || response;
        
        // Update conversations with new message
        setConversations(prev => prev.map(conv => {
          if (conv.other_participant.user_id === otherUser.user_id) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              last_message_time: newMessage.timestamp
            };
          }
          return conv;
        }));
        
        // Re-sort by last message time
        setConversations(prev => [...prev].sort((a, b) => 
          new Date(b.last_message_time) - new Date(a.last_message_time)
        ));
        
        setMessage('');
        
        // Update selected conversation
        setSelectedConversation(prev => {
          if (prev && prev.other_participant.user_id === otherUser.user_id) {
            return {
              ...prev,
              messages: [...prev.messages, newMessage],
              last_message_time: newMessage.timestamp
            };
          }
          return prev;
        });
      } catch (err) {
        showError('Failed to send message');
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Live Chat</h1>
        <p className="text-secondary-600">Connect with healthcare professionals</p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-y-auto flex-shrink-0 h-64 md:h-auto">
          <h2 className="text-lg font-bold text-secondary-900 mb-4">All Users</h2>
          <div className="space-y-3">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const otherUser = conv.other_participant;
                const hasMessages = conv.messages && conv.messages.length > 0;
                return (
                  <button
                    key={otherUser.user_id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg transition-colors
                      ${selectedConversation?.other_participant.user_id === otherUser.user_id 
                        ? 'bg-primary-100 border border-primary-300' 
                        : 'hover:bg-secondary-100'
                      }
                    `}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {otherUser.username.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          otherUser.account_status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-secondary-900">{otherUser.username}</p>
                        {conv.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary-500">
                        {otherUser.role}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-secondary-500 text-sm">No users available</p>
            )}
          </div>
        </Card>

        {/* Chat Box */}
        <Card className="md:col-span-3 flex flex-col flex-1 min-h-0">
          {selectedConversation ? (
            <>
              <div className="pb-4 border-b border-secondary-200 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-secondary-900">{selectedConversation.other_participant.username}</h3>
                    <p className="text-xs text-secondary-500 flex items-center gap-2">
                      <span className={selectedConversation.other_participant.account_status === 'active' ? 'text-green-500' : 'text-gray-400'}>●</span>
                      {selectedConversation.other_participant.account_status === 'active' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
                {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((msg, idx) => (
                    <div
                      key={msg.message_id || idx}
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
                        <p className={`text-sm ${msg.sender_id === user?.user_id ? 'text-white' : 'text-secondary-900'}`}>
                          {msg.message_text}
                        </p>
                        <p className={`text-xs mt-1 ${msg.sender_id === user?.user_id ? 'text-primary-100' : 'text-secondary-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-secondary-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
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
