// Modal.js
import React from 'react';
import '../.././assets/styles/modal.css';

const Modal = ({ isOpen, onClose, onSubmit, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
