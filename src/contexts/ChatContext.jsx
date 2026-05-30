/**
 * ChatContext.jsx — Global real-time chat state for the application.
 * This context manages the WebSocket connection, conversation list, message
 * history, and typing indicators. Any component that needs to send or display
 * messages can consume this context instead of managing the socket itself.
 */
import { createContext, useReducer, useCallback, useEffect, useRef } from 'react';
import * as chatService from '../services/chatService';

// Create the context object that ChatProvider will populate.
export const ChatContext = createContext();

/**
 * initialState describes the full shape of chat state before any data is loaded.
 * isConnected tracks whether the WebSocket link to the server is live.
 * typingUsers holds the list of users currently typing in the active conversation.
 */
const initialState = {
  messages: [],
  conversations: [],
  currentConversation: null,
  isConnected: false,
  loading: false,
  error: null,
  typingUsers: [],
};

/**
 * chatReducer handles all state changes for the chat system.
 * Each action type maps to a specific event such as a new message arriving
 * or the WebSocket connection status changing.
 */
function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      // Toggle the loading flag; payload is true (loading) or false (done).
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      // Store an error message string, or null to clear a previous error.
      return { ...state, error: action.payload };
    case 'SET_CONNECTED':
      // payload is a boolean reflecting the current WebSocket connection status.
      return { ...state, isConnected: action.payload };
    case 'SET_CONVERSATIONS':
      // Replace the full conversations list (e.g. after fetching from the API).
      return { ...state, conversations: action.payload };
    case 'ADD_MESSAGE':
      // Append a single new message to the end of the messages array.
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_MESSAGES':
      // Replace the entire message list (e.g. when opening a different conversation).
      return { ...state, messages: action.payload };
    case 'SET_CURRENT_CONVERSATION':
      // Track which conversation the user is currently viewing by its id.
      return { ...state, currentConversation: action.payload };
    case 'UPDATE_TYPING_USERS':
      // Overwrite the typing users array with the latest list from the server.
      return { ...state, typingUsers: action.payload };
    case 'CLEAR_MESSAGES':
      // Empty the messages array when leaving a conversation.
      return { ...state, messages: [] };
    default:
      return state;
  }
}

/**
 * ChatProvider wraps the app and makes all chat state and actions available
 * to every component through ChatContext.
 */
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  /**
   * useRef stores the WebSocket instance without causing a re-render when it
   * changes. We need the socket to persist across renders but updating it
   * should not trigger React to redraw the component tree.
   */
  const socketRef = useRef(null);

  /**
   * On mount, open the WebSocket connection to the server and register event
   * listeners for incoming messages, typing events, and connection changes.
   * The cleanup function (returned from useEffect) disconnects the socket when
   * the ChatProvider is removed from the screen (e.g. on logout).
   */
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // chatService.connectWebSocket() returns a socket.io-compatible socket object.
        socketRef.current = await chatService.connectWebSocket();
        dispatch({ type: 'SET_CONNECTED', payload: true });

        // .on() registers a listener for a named event emitted by the server.
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

    // Cleanup: close the socket when the component unmounts to avoid memory leaks.
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  /**
   * loadConversations fetches the list of all chat threads the logged-in user
   * belongs to and stores them in state so the sidebar can display them.
   */
  const loadConversations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const conversations = await chatService.getConversations();
      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
      // Clear any previous error now that the fetch succeeded.
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      // Always turn off the loading flag, even if an error occurred.
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * loadMessages fetches the full message history for a specific conversation
   * and marks that conversation as the one currently being viewed.
   */
  const loadMessages = useCallback(async (conversationId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const messages = await chatService.getMessages(conversationId);
      // Replace the message list with the history for this conversation.
      dispatch({ type: 'SET_MESSAGES', payload: messages });
      // Track which conversation is open so new incoming messages go to the right thread.
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversationId });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * sendMessage posts a new message to the API, adds it to the local state
   * immediately, and notifies the server via WebSocket that the user has stopped
   * typing (so the typing indicator disappears for other participants).
   */
  const sendMessage = useCallback(async (conversationId, content) => {
    try {
      const message = await chatService.sendMessage(conversationId, content);
      dispatch({ type: 'ADD_MESSAGE', payload: message });

      // .emit() sends a custom event to the server over the WebSocket connection.
      // Emit typing stopped
      if (socketRef.current) {
        socketRef.current.emit('stop_typing', { conversationId });
      }

      return message;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      // Re-throw so the calling component can handle it (e.g. show an inline error).
      throw error;
    }
  }, []);

  /**
   * notifyTyping sends a "typing" event to the server over the WebSocket so
   * other participants can see the "User is typing..." indicator in real time.
   * This is called while the user is actively typing in the message input.
   */
  const notifyTyping = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { conversationId });
    }
  }, []);

  /**
   * startConversation creates a new chat thread between the logged-in user and
   * the given userId, then immediately opens that conversation.
   */
  const startConversation = useCallback(async (userId) => {
    try {
      const conversation = await chatService.createConversation(userId);
      // Mark the newly created conversation as the active one.
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation.id });
      return conversation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  // clearMessages empties the message list, typically called when closing a conversation
  // to prevent old messages from flashing briefly when a new conversation is opened.
  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  return (
    /*
     * Spread all state fields (...state) and expose every action function through
     * the context value. Components consume this by calling useContext(ChatContext)
     * or a custom useChatContext() hook, then destructure only what they need.
     */
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
