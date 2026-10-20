import React from 'react';

export function QuitConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="quit-overlay" onClick={onCancel}>
      <div className="quit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quit-close" onClick={onCancel}>
          ✖️
        </button>
        <div className="quit-title">Voulez-vous quitter le jeu ?</div>
        <div className="quit-buttons">
          <button className="quit-btn quit-no" onClick={onCancel}>
            Non
          </button>
          <button className="quit-btn quit-yes" onClick={onConfirm}>
            Oui
          </button>
        </div>
      </div>
    </div>
  );
}
