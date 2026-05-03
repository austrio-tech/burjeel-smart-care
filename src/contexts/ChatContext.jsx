import { createContext, useReducer, useCallback, useEffect, useRef } from 'react';
import * as chatService from '../services/chatService';

export const ChatContext = createContext();

const initialState = {
  messages: [],
  conversations: [],
  currentConversation: null,
  isConnected: false,
  loading: false,
  error: null,
  typingUsers: [],
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload };
    case 'UPDATE_TYPING_USERS':
      return { ...state, typingUsers: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const socketRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        socketRef.current = await chatService.connectWebSocket();
        dispatch({ type: 'SET_CONNECTED', payload: true });

        // Listen for incoming messages
        socketRef.current.on('message', (message) => {
          dispatch({ type: 'ADD_MESSAGE', payload: message });
        });

        // Listen for typing indicators
        socketRef.current.on('user_typing', (typingUsers) => {
          dispatch({ type: 'UPDATE_TYPING_USERS', payload: typingUsers });
        });

        // Handle disconnection
        socketRef.current.on('disconnect', () => {
          dispatch({ type: 'SET_CONNECTED', payload: false });
        });

        // Handle reconnection
        socketRef.current.on('connect', () => {
          dispatch({ type: 'SET_CONNECTED', payload: true });
        });
      } catch (error) {
        console.error('WebSocket connection error:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const loadConversations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const conversations = await chatService.getConversations();
      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const messages = await chatService.getMessages(conversationId);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversationId });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const sendMessage = useCallback(async (conversationId, content) => {
    try {
      const message = await chatService.sendMessage(conversationId, content);
      dispatch({ type: 'ADD_MESSAGE', payload: message });

      // Emit typing stopped
      if (socketRef.current) {
        socketRef.current.emit('stop_typing', { conversationId });
      }

      return message;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const notifyTyping = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { conversationId });
    }
  }, []);

  const startConversation = useCallback(async (userId) => {
    try {
      const conversation = await chatService.createConversation(userId);
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation.id });
      return conversation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        loadConversations,
        loadMessages,
        sendMessage,
        notifyTyping,
        startConversation,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
