// BasicModal.jsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-transparent backdrop-blur-sm transition-opacity z-40"
        onClick={onClose}
      ></div>
      {/* Modal content */}
      <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
              <div className="mt-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
