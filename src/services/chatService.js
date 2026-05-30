/*
 * chatService.js — API functions for the in-app messaging / chat feature.
 *
 * Real-time message delivery is handled by the WebSocket in ChatContext, but this
 * service covers the REST API side: loading conversation history, sending messages
 * via HTTP (as a fallback or initial send), and marking messages as read.
 */

import api from './api';

/*
 * getConversations — Retrieves the list of conversations for the current user.
 * Returns an empty array instead of throwing on failure so the chat UI degrades
 * gracefully rather than crashing when the server is unavailable.
 * @returns {Promise<Array>} List of conversation objects, or [] on error.
 */
export const getConversations = async () => {
  try {
    const response = await api.get('/chat/conversations/');
    // The api interceptor returns response.data, but some paths may return it nested again;
    // this fallback handles both shapes safely.
    return response.data || response;
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

/*
 * getMessages — Fetches the message history, optionally filtered to a conversation with one user.
 * @param {string|number} withUserId - The ID of the other participant; omit for all messages.
 * @returns {Promise<Array>} List of message objects.
 */
export const getMessages = async (withUserId) => {
  const params = {};
  if (withUserId) params.with_user_id = withUserId;
  const response = await api.get('/chat/messages/', { params });
  // Normalise the response shape in case the interceptor returns data at different depths.
  return response.data || response;
};

/*
 * sendMessage — Posts a new message to the server addressed to a specific user.
 * @param {string|number} receiverId - The ID of the user who should receive the message.
 * @param {string}        content    - The text body of the message.
 * @returns {Promise<object>} The saved message record returned by the server.
 */
export const sendMessage = async (receiverId, content) => {
  const response = await api.post('/chat/messages/', {
    receiver_id: receiverId,
    message_text: content,
  });
  return response;
};

/*
 * markAsRead — Marks all unread messages from a specific sender as read.
 * This tells the server (and other clients) that the current user has seen those messages.
 * @param {string|number} senderId - The ID of the user whose messages should be marked read.
 * @returns {Promise<object>} Server confirmation of the update.
 */
export const markAsRead = async (senderId) => {
  const response = await api.put('/chat/messages/read', {
    sender_id: senderId,
  });
  return response;
};

/*
 * createConversation — Placeholder function that returns a temporary local ID.
 * The real conversation is created server-side when the first message is sent;
 * this stub exists so calling code does not need to check for the feature's readiness.
 * @param {string|number} userId - The ID of the user to start a conversation with.
 * @returns {{ id: number }} A temporary object with a locally-generated ID.
 */
export const createConversation = async (userId) => {
  // Date.now() produces a unique millisecond timestamp used as a temporary local ID.
  return { id: Date.now() };
};
