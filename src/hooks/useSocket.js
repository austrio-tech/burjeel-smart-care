/*
 * useSocket.js — Custom hook for accessing the real-time chat/socket context.
 *
 * The ChatContext holds the WebSocket connection, message list, and send helpers.
 * This hook gives any component a clean, single-line way to tap into that context
 * without needing to import ChatContext directly everywhere.
 */

import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

/*
 * useSocket — Returns the ChatContext value (socket connection, messages, send function, etc.).
 * Throws a descriptive error if the hook is called outside a <ChatProvider> so developers
 * can quickly spot missing provider wrappers in the component tree.
 */
export function useSocket() {
  const context = useContext(ChatContext);
  // Guard against using this hook outside the ChatProvider wrapper.
  if (!context) {
    throw new Error('useSocket must be used within a ChatProvider');
  }
  return context;
}
