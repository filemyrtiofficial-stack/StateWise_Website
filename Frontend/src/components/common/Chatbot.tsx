import React, { memo, useCallback } from 'react';

const ChatbotComponent: React.FC = () => {
  const handleChatClick = useCallback(() => {
    // Redirect to external chat URL
    window.open('https://chat.filemyrti.com/', '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <>
      {/* Chat with AI Button */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl z-40"
        aria-label="Chat with AI"
        title="Chat with AI"
      >
        Chat with AI
      </button>
    </>
  );
};

export const Chatbot = memo(ChatbotComponent);


