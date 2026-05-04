import React from 'react';

export interface ChatBubbleProps {
  sent: boolean;
  text?: string;
  imageUrl?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ sent, text, imageUrl }) => {
  return (
    <div className={`flex w-full my-2 ${sent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${sent ? 'bg-[#56bd64] text-white rounded-br-none' : 'bg-[#f7f7f7] text-[#3c606b] rounded-bl-none border border-[#3c606b]/10'}`}>
        {imageUrl && (
          <img src={imageUrl} alt="Chat attachment" className="w-full rounded-lg mb-2 object-cover max-h-48" />
        )}
        {text && <p className="text-sm whitespace-pre-wrap">{text}</p>}
      </div>
    </div>
  );
};
