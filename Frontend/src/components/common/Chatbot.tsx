import React, { memo, useCallback, useState } from 'react';
import { RTIDostModal } from './RTIDostModal';

const ChatbotComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChatClick = useCallback(() => {
    // Show RTI Dost modal first
    setIsModalOpen(true);
  }, []);

  const handleDraft = useCallback(() => {
    // Close modal and redirect to chat page
    setIsModalOpen(false);
    window.open('https://chat.filemyrti.com/', '_blank', 'noopener,noreferrer');
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      {/* Chat with AI Button */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl z-40"
        aria-label="Chat with AI"
        title="Chat with AI"
      >
        Chat with AI
      </button>

      {/* RTI Dost Modal */}
      <RTIDostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDraft={handleDraft}
      />
    </>
  );
};

export const Chatbot = memo(ChatbotComponent);


