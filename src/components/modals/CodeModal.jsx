import React, { useState } from 'react';
import { NumericKeypad } from '../ui/NumericKeypad';
import { getCodeInfo } from '../../constants/codes';

export function CodeModal({ isOpen, onClose, onCodeResult }) {
  const [codeInput, setCodeInput] = useState('');
  const [codeResult, setCodeResult] = useState(null);

  const handleNumber = (num) => {
    if (codeInput.length < 4) {
      setCodeInput(codeInput + num);
    }
  };

  const handleCancel = () => {
    setCodeInput('');
    setCodeResult(null);
  };

  const handleOk = () => {
    if (codeInput.length < 4) {
      setCodeResult({ type: 'short' });
      return;
    }

    const codeInfo = getCodeInfo(codeInput);
    if (codeInfo) {
      const result = {
        type: 'success',
        code: codeInput,
        info: codeInfo.info,
      };
      setCodeResult(result);
      onCodeResult?.(result);
      return;
    }

    onCodeResult?.({ type: 'wrong' });
    setCodeResult({ type: 'wrong' });
  };

  const resetResult = () => {
    setCodeResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="code-overlay" onClick={onClose}>
      <div className="code-modal" onClick={(e) => e.stopPropagation()}>
        <button className="code-close" onClick={onClose}>
          ✖️
        </button>

        {!codeResult ? (
          <NumericKeypad
            display={codeInput || '0000'}
            onNumber={handleNumber}
            onCancel={handleCancel}
            onOk={handleOk}
            keypadClass="code-keypad"
            keyClass="code-key"
            displayClass="code-display"
          />
        ) : codeResult.type === 'short' ? (
          <>
            <div className="code-error-title">Veuillez entrer 4 chiffres.</div>
            <button className="code-result-close" onClick={resetResult}>
              Retour
            </button>
          </>
        ) : codeResult.type === 'wrong' ? (
          <>
            <div className="code-skull">☠️</div>
            <div className="code-error-title">Code Faux</div>
            <div className="code-error-text">Vous perdez 2 minutes.</div>
            <button className="code-result-close" onClick={resetResult}>
              Retour
            </button>
          </>
        ) : (
          <>
            <div className="code-success-title">Code n°{codeResult.code}</div>
            <div className="code-success-text">{codeResult.info}</div>
            <button className="code-result-close" onClick={resetResult}>
              Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
}
