import React, { useRef, useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

export interface InputMessageProps {
  onSendMessage: (text: string) => void;
  onAttachFile: (file: File) => void;
  disabled?: boolean;
}

export const InputMessage: React.FC<InputMessageProps> = ({ onSendMessage, onAttachFile, disabled = false }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachFile(file);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-t border-gray-200">
      <button 
        type="button" 
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-[#3c606b] hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
      >
        <Paperclip size={20}/>
      </button>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={disabled}
        placeholder="Type a message..."
        className="flex-1 bg-[#f7f7f7] text-[#3c606b] px-4 py-2 rounded-full outline-none focus:ring-1 focus:ring-[#3c606b] disabled:opacity-50"
      />
      
      <button 
        type="button" 
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="p-2 bg-[#56bd64] text-white hover:bg-[#37e64f] rounded-full transition-colors disabled:opacity-50"
      >
        <Send size={18}/>
      </button>
    </div>
  );
};
