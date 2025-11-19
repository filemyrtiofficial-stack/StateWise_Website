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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl z-[9999]"
        style={{ position: 'fixed', pointerEvents: 'auto' }}
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


