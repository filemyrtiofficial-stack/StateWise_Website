import React, { memo, useCallback } from 'react';

const ChatbotComponent: React.FC = () => {
  const handleChatClick = useCallback(() => {
    // Redirect to external chat URL
    window.open('https://chat.filemyrti.com/', '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <>
      {/* Chat Button - Redirects to external chat */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 active:bg-primary-800 transition-all duration-300 z-40 flex items-center justify-center hover:scale-110 active:scale-95"
        aria-label="Open chat support"
        title="Chat with us"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </>
  );
};

export const Chatbot = memo(ChatbotComponent);


