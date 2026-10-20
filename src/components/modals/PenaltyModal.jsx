import React, { useEffect } from 'react';

export function PenaltyModal({ isOpen, onClose, message }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="penalty-overlay" onClick={onClose}>
      <div className="penalty-modal" onClick={(e) => e.stopPropagation()}>
        <button className="penalty-close" onClick={onClose}>
          ✖️
        </button>
        <div className="penalty-skull">☠️</div>
        <div className="penalty-text">{message}</div>
      </div>
    </div>
  );
}
