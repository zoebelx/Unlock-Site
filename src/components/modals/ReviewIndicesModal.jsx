import React, { useState } from 'react';
import { getIndiceLevelIndices } from '../../constants/indices';

export function ReviewIndicesModal({ isOpen, onClose, discoveredIndices }) {
  const [selectedNumber, setSelectedNumber] = useState(null);

  const getAvailableNumbers = () => {
    const available = [];
    for (let i = 1; i <= 12; i++) {
      available.push(i);
    }
    return available;
  };

  if (!isOpen) return null;

  return (
    <div className="review-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <button className="review-close" onClick={onClose}>
          ✖️
        </button>

        {!selectedNumber ? (
          <>
            <div className="review-title">Revoir les Indices</div>
            <div className="review-grid">
              {getAvailableNumbers().map((num) => (
                <button
                  key={num}
                  className="review-slot"
                  onClick={() => {
                    if (discoveredIndices[num]) {
                      setSelectedNumber(num);
                    }
                  }}
                  type="button"
                >
                  <span className="review-slot-number">
                    {discoveredIndices[num] ? num : '?'}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="review-detail-title">Indice n°{selectedNumber}</div>
            {getIndiceLevelIndices(selectedNumber) ? (
              <div className="review-detail-list">
                {getIndiceLevelIndices(selectedNumber).map((indice, idx) => (
                  <div key={idx} className="review-detail-item">
                    <span className="review-detail-label">Indice {idx + 1}:</span> {indice}
                  </div>
                ))}
              </div>
            ) : (
              <div className="review-detail-empty">Rien à signaler...</div>
            )}
            <button className="review-detail-back" onClick={() => setSelectedNumber(null)}>
              Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
}
