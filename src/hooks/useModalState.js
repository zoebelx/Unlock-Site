import { useState } from 'react';

export function useModalState() {
  const [showIndice, setShowIndice] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showMachine, setShowMachine] = useState(false);
  const [showReviewIndices, setShowReviewIndices] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const openModal = (modalName) => {
    switch (modalName) {
      case 'indice':
        setShowIndice(true);
        break;
      case 'code':
        setShowCode(true);
        break;
      case 'machine':
        setShowMachine(true);
        break;
      case 'review':
        setShowReviewIndices(true);
        break;
      case 'penalty':
        setShowPenalty(true);
        break;
      case 'quit':
        setShowQuitConfirm(true);
        break;
      default:
        break;
    }
  };

  const closeModal = (modalName) => {
    switch (modalName) {
      case 'indice':
        setShowIndice(false);
        break;
      case 'code':
        setShowCode(false);
        break;
      case 'machine':
        setShowMachine(false);
        break;
      case 'review':
        setShowReviewIndices(false);
        break;
      case 'penalty':
        setShowPenalty(false);
        break;
      case 'quit':
        setShowQuitConfirm(false);
        break;
      default:
        break;
    }
  };

  return {
    showIndice,
    showCode,
    showMachine,
    showReviewIndices,
    showPenalty,
    showQuitConfirm,
    openModal,
    closeModal,
  };
}
