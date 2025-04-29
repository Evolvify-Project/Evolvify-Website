import React, { useState, useRef } from 'react';
import { Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, isVoice?: boolean) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Anything..."
          className="w-full px-4 py-3 pr-10 rounded-full border-2 border-gray-200 focus:outline-none focus:border-blue-400"
          disabled={isRecording}
        />
        <button
          type="button"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Mic 
            size={20} 
            className={isRecording ? 'text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>
      <button
        type="submit"
        disabled={!message.trim() || isRecording}
        className="p-3 rounded-full bg-blue-400 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </form>
  );
};