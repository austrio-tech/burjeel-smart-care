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

export const sendMessage = async (conversationId, content) => {
  return { message_text: content, timestamp: new Date().toISOString() };
};

export const createConversation = async (userId) => {
  return { id: Date.now() };
};
