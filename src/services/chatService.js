import api from './api';

export const getMessages = async (withUserId) => {
  const params = {};
  if (withUserId) params.with_user_id = withUserId;
  const response = await api.get('/chat/messages/', { params });
  return response;
};

export const connectWebSocket = async () => {
  console.warn('WebSocket not fully implemented yet');
  return {
    on: () => {},
    emit: () => {},
    disconnect: () => {},
  };
};

export const getConversations = async () => {
  return [];
};

export const sendMessage = async (receiverId, content) => {
  const response = await api.post('/chat/messages/', {
    receiver_id: receiverId,
    message_text: content
  });
  return response;
};

export const markAsRead = async (senderId) => {
  const response = await api.put('/chat/messages/read', {
    sender_id: senderId
  });
  return response;
};

export const createConversation = async (userId) => {
  return { id: Date.now() };
};
