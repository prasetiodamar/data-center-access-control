import React from 'react';

export default function Modal({ 
  isOpen, 
  title, 
  onClose, 
  onSubmit, 
  children,
  submitText = 'Save',
  closeText = 'Cancel'
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            {closeText}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onSubmit}
          >
            {submitText}
          </button>
        </div>
      </div>
    </>
  );
}
