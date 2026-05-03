import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext';

export function useSocket() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useSocket must be used within a ChatProvider');
  }
  return context;
}
