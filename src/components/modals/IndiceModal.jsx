import React, { useState } from 'react';
import { NumericKeypad } from '../ui/NumericKeypad';
import { getIndiceLevelIndices } from '../../constants/indices';

export function IndiceModal({ isOpen, onClose, onIndiceFound }) {
  const [indiceInput, setIndiceInput] = useState('');
  const [indicesFound, setIndicesFound] = useState(null);

  const handleNumber = (num) => {
    if (indiceInput.length < 10) {
      setIndiceInput(indiceInput + num);
    }
  };

  const handleCancel = () => {
    setIndiceInput('');
    setIndicesFound(null);
  };

  const handleOk = () => {
    if (indiceInput.trim()) {
      const indiceNum = parseInt(indiceInput);
      const indices = getIndiceLevelIndices(indiceNum);

      if (indices) {
        setIndicesFound({
          number: indiceNum,
          indices: indices,
        });
        onIndiceFound?.(indiceNum, indices);
      } else {
        setIndicesFound({
          number: indiceNum,
          indices: null,
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="indice-overlay" onClick={onClose}>
      <div className="indice-modal" onClick={(e) => e.stopPropagation()}>
        <button className="indice-close" onClick={onClose}>
          ✖️
        </button>

        {!indicesFound ? (
          <NumericKeypad
            display={indiceInput || '0'}
            onNumber={handleNumber}
            onCancel={handleCancel}
            onOk={handleOk}
            keypadClass="indice-keypad"
            keyClass="indice-key"
            displayClass="indice-display"
          />
        ) : (
          <>
            <div className="indice-result-title">Indice n°{indicesFound.number}</div>

            {indicesFound.indices ? (
              <div className="indice-result-list">
                {indicesFound.indices.map((indice, idx) => (
                  <div key={idx} className="indice-result-item">
                    <span className="indice-result-label">Indice {idx + 1}:</span> {indice}
                  </div>
                ))}
              </div>
            ) : (
              <div className="indice-result-empty">Rien à signaler...</div>
            )}

            <button
              className="indice-result-close"
              onClick={() => {
                setIndicesFound(null);
                setIndiceInput('');
              }}
            >
              Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
}
