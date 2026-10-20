import React, { useEffect, useRef, useState } from 'react';
import './GameScreen.css';
import { getIndiceLevelIndices } from '../../constants/indices';
import { getCodeInfo } from '../../constants/codes';
import { getMachineInfo } from '../../constants/machines';
import sherlockTheme from '../../assets/the-game-is-on.mp3';

const ICONS = {
  settings: 'https://img.icons8.com/ios/100/4a3319/services.png',
  close: 'https://img.icons8.com/ios/100/4a3319/multiply.png',
  indice: 'https://img.icons8.com/ios/100/4a3319/search--v1.png',
  code: 'https://img.icons8.com/ios-filled/100/4a3319/lock.png',
  machine: 'https://img.icons8.com/ios/100/4a3319/settings.png',
  review: 'https://img.icons8.com/ios/100/4a3319/compass.png',
  penalty: 'https://img.icons8.com/ios/100/4a3319/skull.png',
  play: 'https://img.icons8.com/ios/100/4a3319/play--v1.png',
  pause: 'https://img.icons8.com/ios/100/4a3319/pause--v1.png',
};

function IconImage({ src, alt, className = '' }) {
  return <img src={src} alt={alt} className={`game-icon ${className}`.trim()} />;
}

export function GameScreen({ adventure, onQuit }) {
  const REVIEW_PAGE_SIZE = 4;
  const MACHINE_FOSSIL_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const MACHINE_COLOR_CONFIG = [
    { key: 'blue', label: 'Bleu', swatchClass: 'is-blue' },
    { key: 'green', label: 'Vert', swatchClass: 'is-green' },
    { key: 'red', label: 'Rouge', swatchClass: 'is-red' },
    { key: 'lightGreen', label: 'Vert clair', swatchClass: 'is-light-green' },
  ];
  const [timeLeft, setTimeLeft] = useState(adventure.defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [showPenalty, setShowPenalty] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState('');
  const [penaltyMessageShown, setPenaltyMessageShown] = useState(false);
  const [showIndice, setShowIndice] = useState(false);
  const [indiceInput, setIndiceInput] = useState('');
  const [indicesFound, setIndicesFound] = useState(null);
  const [indiceVisibleCount, setIndiceVisibleCount] = useState(1);
  const [selectedIndiceIndex, setSelectedIndiceIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeResult, setCodeResult] = useState(null);
  const [showMachine, setShowMachine] = useState(false);
  const [machineInput, setMachineInput] = useState('');
  const [machineStage, setMachineStage] = useState('input');
  const [machineData, setMachineData] = useState(null);
  const [machineProgress, setMachineProgress] = useState(0);
  const [machineColorValues, setMachineColorValues] = useState({
    blue: 1,
    green: 1,
    red: 1,
    lightGreen: 1,
  });
  const [machineFossilSelections, setMachineFossilSelections] = useState([]);
  const [machineError, setMachineError] = useState('');
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showReviewIndices, setShowReviewIndices] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewSelectedNumber, setReviewSelectedNumber] = useState(null);
  const [, setReviewVisibleCount] = useState(1);
  const [reviewSelectedIndex, setReviewSelectedIndex] = useState(0);
  const [discoveredIndices, setDiscoveredIndices] = useState({});
  const [discoveredOrder, setDiscoveredOrder] = useState([]);
  const backgroundMusicRef = useRef(null);

  const gameButtonsLocked = !isRunning;
  const reviewedNumbers = discoveredOrder.filter((number) => discoveredIndices[number]);
  const reviewPageCount = Math.max(1, Math.ceil(reviewedNumbers.length / REVIEW_PAGE_SIZE));
  const safeReviewPage = Math.min(reviewPage, reviewPageCount - 1);
  const reviewPageNumbers = reviewedNumbers.slice(
    safeReviewPage * REVIEW_PAGE_SIZE,
    safeReviewPage * REVIEW_PAGE_SIZE + REVIEW_PAGE_SIZE,
  );
  const reviewSelectedData = reviewSelectedNumber ? discoveredIndices[reviewSelectedNumber] : null;
  const reviewSelectedIndices = reviewSelectedData?.indices || [];
  const reviewUnlockedCount = reviewSelectedData?.unlockedCount || 0;
  const visibleReviewIndices = reviewSelectedIndices.slice(0, reviewUnlockedCount);
  const currentIndiceData = indicesFound?.number ? discoveredIndices[indicesFound.number] : null;
  const currentIndiceUnlockedCount = currentIndiceData?.unlockedCount || indiceVisibleCount;

  useEffect(() => {
    if (!isRunning || finalResult) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, finalResult]);

  useEffect(() => {
    if (!isRunning || finalResult) {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
      return undefined;
    }

    if (!backgroundMusicRef.current) {
      const audio = new Audio(sherlockTheme);
      audio.loop = true;
      audio.volume = 0.45;
      backgroundMusicRef.current = audio;
    }

    backgroundMusicRef.current.play().catch(() => {});

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
    };
  }, [isRunning, finalResult]);

  useEffect(() => {
    if (showPenalty) {
      const timer = setTimeout(() => {
        setShowPenalty(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPenalty]);

  const formatTime = (seconds) => {
    const sign = seconds < 0 ? '-' : '';
    const absoluteSeconds = Math.abs(seconds);
    const m = Math.floor(absoluteSeconds / 60).toString().padStart(2, '0');
    const s = (absoluteSeconds % 60).toString().padStart(2, '0');
    return `${sign}${m}:${s}`;
  };

  const applyTimePenalty = () => {
    setTimeLeft((prev) => prev - 60);
  };

  const handleAction = (actionType) => {
    switch (actionType) {
      case 'indice':
        setShowIndice(true);
        break;
      case 'code':
        setShowCode(true);
        break;
      case 'machine':
        setShowMachine(true);
        break;
      case 'revoir':
        setShowReviewIndices(true);
        break;
      case 'penalty':
        applyTimePenalty();
        if (!penaltyMessageShown) {
          setPenaltyMessage('Vous perdez 1 minute');
          setShowPenalty(true);
          setPenaltyMessageShown(true);
        }
        break;
      default:
        break;
    }
  };

  const handleIndiceNumber = (num) => {
    if (indiceInput.length < 10) {
      setIndiceInput(indiceInput + num);
    }
  };

  const handleIndiceCancel = () => {
    setIndiceInput('');
    setIndicesFound(null);
    setIndiceVisibleCount(1);
    setSelectedIndiceIndex(0);
  };

  const unlockIndiceCount = (indiceNum, indices, count) => {
    setDiscoveredIndices((prev) => {
      const previousCount = prev[indiceNum]?.unlockedCount || 0;
      return {
        ...prev,
        [indiceNum]: {
          indices,
          unlockedCount: Math.min(indices.length, Math.max(previousCount, count)),
        },
      };
    });
  };

  const handleIndiceOk = () => {
    if (!indiceInput.trim()) return;

    const indiceNum = parseInt(indiceInput, 10);
    const indices = getIndiceLevelIndices(indiceNum);

    if (indices) {
      setIndicesFound({
        number: indiceNum,
        indices,
      });
      setIndiceVisibleCount(1);
      setSelectedIndiceIndex(0);
      unlockIndiceCount(indiceNum, indices, 1);
      setDiscoveredOrder((prev) => (prev.includes(indiceNum) ? prev : [...prev, indiceNum]));
      return;
    }

    setIndicesFound({
      number: indiceNum,
      indices: null,
    });
  };

  const handleCodeNumber = (num) => {
    if (codeInput.length < 4) {
      setCodeInput(codeInput + num);
    }
  };

  const handleCodeCancel = () => {
    setCodeInput('');
    setCodeResult(null);
  };

  const handleCodeOk = () => {
    if (codeInput.length < 4) {
      setCodeResult({ type: 'short' });
      return;
    }

    const codeInfo = getCodeInfo(codeInput);
    if (codeInfo) {
      if (codeInput === '5446') {
        setFinalResult({
          info: codeInfo.info,
          elapsedSeconds: adventure.defaultTime - timeLeft,
        });
        setIsRunning(false);
        setShowCode(false);
        setCodeInput('');
        setCodeResult(null);
        return;
      }

      setCodeResult({
        type: 'success',
        code: codeInput,
        info: codeInfo.info,
      });
      return;
    }

    applyTimePenalty();
    setCodeResult({ type: 'wrong' });
  };

  const closeCodeModal = () => {
    setShowCode(false);
    setCodeInput('');
    setCodeResult(null);
  };

  const closeIndiceModal = () => {
    setShowIndice(false);
    setIndicesFound(null);
    setIndiceInput('');
    setIndiceVisibleCount(1);
    setSelectedIndiceIndex(0);
  };

  const closeReviewIndicesModal = () => {
    setShowReviewIndices(false);
    setReviewPage(0);
    setReviewSelectedNumber(null);
    setReviewVisibleCount(1);
    setReviewSelectedIndex(0);
  };

  const handleMachineNumber = (num) => {
    if (machineInput.length < 12) {
      setMachineInput(machineInput + num);
    }
  };

  const handleMachineCancel = () => {
    setMachineInput('');
    setMachineStage('input');
    setMachineData(null);
    setMachineProgress(0);
    setMachineColorValues({
      blue: 1,
      green: 1,
      red: 1,
      lightGreen: 1,
    });
    setMachineFossilSelections([]);
    setMachineError('');
  };

  const closeMachineModal = () => {
    setShowMachine(false);
    setMachineInput('');
    setMachineStage('input');
    setMachineData(null);
    setMachineProgress(0);
    setMachineColorValues({
      blue: 1,
      green: 1,
      red: 1,
      lightGreen: 1,
    });
    setMachineFossilSelections([]);
    setMachineError('');
  };

  const handleMachineOk = () => {
    const data = getMachineInfo(machineInput);
    if (!data) {
      setMachineError('');
      setMachineStage('notfound');
      return;
    }

    setMachineData(data);
    setMachineProgress(0);
    setMachineError('');
    setMachineColorValues({
      blue: 1,
      green: 1,
      red: 1,
      lightGreen: 1,
    });
    setMachineFossilSelections([]);
    setMachineStage(
      data.type === 'colors' ? 'colors' : data.type === 'fossils' ? 'fossils' : 'game',
    );
  };

  const handleMachineSequenceClick = (value) => {
    if (!machineData) return;

    const expectedValue = machineData.order[machineProgress];
    if (value === expectedValue) {
      const nextProgress = machineProgress + 1;
      if (nextProgress >= machineData.order.length) {
        setMachineStage('success');
      }
      setMachineProgress(nextProgress);
      return;
    }

    applyTimePenalty();
    setMachineError('Mauvaise sequence. Vous perdez 1 minute.');
    setMachineProgress(0);
  };

  const updateMachineColorValue = (colorKey, delta) => {
    setMachineColorValues((prev) => ({
      ...prev,
      [colorKey]: Math.min(9, Math.max(1, prev[colorKey] + delta)),
    }));
    setMachineError('');
  };

  const handleMachineColorValidate = () => {
    if (!machineData?.values) return;

    const isCorrect = Object.entries(machineData.values).every(
      ([key, expected]) => machineColorValues[key] === expected,
    );

    if (isCorrect) {
      setMachineStage('success');
      setMachineError('');
      return;
    }

    applyTimePenalty();
    setMachineError('Les valeurs ne correspondent pas. Vous perdez 1 minute.');
  };

  const toggleMachineFossilSelection = (cellId) => {
    if (!machineData?.maxSelections) return;

    setMachineFossilSelections((prev) => {
      if (prev.includes(cellId)) {
        return prev.filter((cell) => cell !== cellId);
      }

      if (prev.length >= machineData.maxSelections) {
        return prev;
      }

      return [...prev, cellId];
    });
    setMachineError('');
  };

  const handleMachineFossilValidate = () => {
    if (!machineData?.targets) return;

    if (machineFossilSelections.length !== machineData.targets.length) {
      setMachineError(`Selectionne ${machineData.targets.length} cases avant de verifier.`);
      return;
    }

    const sortedSelections = [...machineFossilSelections].sort();
    const sortedTargets = [...machineData.targets].sort();
    const isCorrect = sortedSelections.every((cell, index) => cell === sortedTargets[index]);

    if (isCorrect) {
      setMachineStage('success');
      setMachineError('');
      return;
    }

    applyTimePenalty();
    setMachineError('Ce ne sont pas les bons emplacements. Vous perdez 1 minute.');
  };

  const resetCodeResult = () => {
    setCodeResult(null);
  };

  const handleQuitGame = () => {
    setShowQuitConfirm(true);
  };

  const confirmQuit = () => {
    setShowQuitConfirm(false);
    onQuit();
  };

  const handleReviewSlotClick = (num) => {
    if (discoveredIndices[num]) {
      setReviewSelectedNumber(num);
      setReviewVisibleCount(1);
      setReviewSelectedIndex(0);
    }
  };

  const revealNextIndice = () => {
    if (indicesFound?.indices?.length) {
      const nextCount = Math.min(currentIndiceUnlockedCount + 1, indicesFound.indices.length);
      setIndiceVisibleCount(nextCount);
      setSelectedIndiceIndex(nextCount - 1);
      unlockIndiceCount(indicesFound.number, indicesFound.indices, nextCount);
    }
  };

  const revealNextReviewIndice = () => {
    if (reviewSelectedIndices.length) {
      const nextCount = Math.min(reviewUnlockedCount + 1, reviewSelectedIndices.length);
      setReviewVisibleCount(nextCount);
      setReviewSelectedIndex(nextCount - 1);
      unlockIndiceCount(reviewSelectedNumber, reviewSelectedIndices, nextCount);
    }
  };

  const goToReviewPage = (direction) => {
    setReviewPage((prev) => Math.min(Math.max(0, prev + direction), reviewPageCount - 1));
  };

  if (finalResult) {
    return (
      <div className="game-screen game-final-screen">
        <div className="final-card">
          <div className="final-kicker">Enquete terminee</div>
          <h1 className="final-title">Bravo</h1>
          <p className="final-text">{finalResult.info}</p>
          <div className="final-time-panel">
            <span className="final-time-label">Temps mis</span>
            <span className="final-time-value">{formatTime(finalResult.elapsedSeconds)}</span>
          </div>
          <button className="theme-secondary-button final-button" onClick={onQuit} type="button">
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="game-top-bar">
        <button className="top-icon-button" type="button" title="Paramètres">
          <IconImage src={ICONS.settings} alt="Paramètres" className="top-icon-image" />
        </button>
        <button className="top-icon-button" type="button" onClick={handleQuitGame} title="Quitter le jeu">
          <IconImage src={ICONS.close} alt="Quitter le jeu" className="top-icon-image" />
        </button>
      </div>

      <div className="game-ornament game-ornament-left" aria-hidden="true" />
      <div className="game-ornament game-ornament-right" aria-hidden="true" />
      <div className="game-ornament game-ornament-bottom-left" aria-hidden="true" />
      <div className="game-ornament game-ornament-bottom-right" aria-hidden="true" />

      <section className="game-timer-panel">
        <div className="timer-frame">
          <div className="timer-frame-inner">
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </section>

      <section className="action-layout">
        <div className="action-item action-item-start">
          <button
            className="action-button start-button"
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            title={isRunning ? 'Pause' : 'Start'}
          >
            <IconImage src={isRunning ? ICONS.pause : ICONS.play} alt={isRunning ? 'Pause' : 'Start'} />
          </button>
          <span className="action-label start-label">Start/Pause</span>
        </div>

        <div className="action-item action-item-indice">
          <button
            className="action-button"
            type="button"
            onClick={() => handleAction('indice')}
            title="Indice"
            disabled={gameButtonsLocked}
            aria-disabled={gameButtonsLocked}
          >
            <IconImage src={ICONS.indice} alt="Indice" />
          </button>
          <span className="action-label">Indice</span>
        </div>

        <div className="action-item action-item-code">
          <button
            className="action-button"
            type="button"
            onClick={() => handleAction('code')}
            title="Code"
            disabled={gameButtonsLocked}
            aria-disabled={gameButtonsLocked}
          >
            <IconImage src={ICONS.code} alt="Code" />
          </button>
          <span className="action-label">Code</span>
        </div>

        <div className="action-item action-item-penalty">
          <button
            className="action-button"
            type="button"
            onClick={() => handleAction('penalty')}
            title="Pénalité"
            disabled={gameButtonsLocked}
            aria-disabled={gameButtonsLocked}
          >
            <IconImage src={ICONS.penalty} alt="Pénalité" />
          </button>
          <span className="action-label">Pénalité</span>
        </div>

        <div className="action-item action-item-machine">
          <button
            className="action-button"
            type="button"
            onClick={() => handleAction('machine')}
            title="Machine"
            disabled={gameButtonsLocked}
            aria-disabled={gameButtonsLocked}
          >
            <IconImage src={ICONS.machine} alt="Machine" />
          </button>
          <span className="action-label">Machine</span>
        </div>

        <div className="action-item action-item-review">
          <button
            className="action-button"
            type="button"
            onClick={() => handleAction('revoir')}
            title="Revoir indices"
            disabled={gameButtonsLocked}
            aria-disabled={gameButtonsLocked}
          >
            <IconImage src={ICONS.review} alt="Revoir indices" />
          </button>
          <span className="action-label">Revoir Indices</span>
        </div>
      </section>

      {showPenalty && (
        <div className="penalty-overlay" onClick={() => setShowPenalty(false)}>
          <div className="theme-modal penalty-modal" onClick={(e) => e.stopPropagation()}>
            <button className="theme-close" onClick={() => setShowPenalty(false)} type="button">
              <IconImage src={ICONS.close} alt="Fermer" className="modal-close-icon" />
            </button>
            <div className="theme-modal-icon">
              <IconImage src={ICONS.penalty} alt="Pénalité" />
            </div>
            <div className="theme-modal-title">Pénalité</div>
            <div className="theme-modal-text">{penaltyMessage}</div>
          </div>
        </div>
      )}

      {showIndice && (
        <div className="indice-overlay" onClick={closeIndiceModal}>
          <div className="theme-modal keypad-modal" onClick={(e) => e.stopPropagation()}>
            <button className="theme-close" onClick={closeIndiceModal} type="button">
              <IconImage src={ICONS.close} alt="Fermer" className="modal-close-icon" />
            </button>

            {!indicesFound ? (
              <>
                <div className="theme-display">{indiceInput || '0'}</div>
                <div className="theme-keypad">
                  <button className="theme-key" onClick={() => handleIndiceNumber('1')} type="button">1</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('2')} type="button">2</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('3')} type="button">3</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('4')} type="button">4</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('5')} type="button">5</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('6')} type="button">6</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('7')} type="button">7</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('8')} type="button">8</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('9')} type="button">9</button>
                  <button className="theme-key theme-key-cancel" onClick={handleIndiceCancel} type="button">C</button>
                  <button className="theme-key" onClick={() => handleIndiceNumber('0')} type="button">0</button>
                  <button className="theme-key theme-key-confirm" onClick={handleIndiceOk} type="button">OK</button>
                </div>
              </>
            ) : (
              <>
                <div className="theme-panel-title">Indice n°{indicesFound.number}</div>
                {indicesFound.indices ? (
                  <>
                    <div className="indice-step-buttons">
                      {indicesFound.indices.map((_, idx) => {
                        const isUnlocked = idx < currentIndiceUnlockedCount;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`indice-step-btn${selectedIndiceIndex === idx ? ' is-active' : ''}`}
                            onClick={() => isUnlocked && setSelectedIndiceIndex(idx)}
                            disabled={!isUnlocked}
                            aria-disabled={!isUnlocked}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                    <div className="theme-result-list">
                      {indicesFound.indices.slice(selectedIndiceIndex, selectedIndiceIndex + 1).map((indice, idx) => (
                        <div key={idx} className="theme-result-item">
                          <span className="theme-result-label">Indice {selectedIndiceIndex + 1}:</span> {indice}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="theme-empty">Rien à signaler...</div>
                )}

                {indicesFound.indices && currentIndiceUnlockedCount < indicesFound.indices.length && (
                  <button className="theme-secondary-button" onClick={revealNextIndice} type="button">
                    Voir l'indice {currentIndiceUnlockedCount + 1}
                  </button>
                )}

                <button
                  className="theme-secondary-button theme-secondary-button-muted"
                  onClick={() => {
                    setIndicesFound(null);
                    setIndiceInput('');
                    setIndiceVisibleCount(1);
                    setSelectedIndiceIndex(0);
                  }}
                  type="button"
                >
                  Retour
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showQuitConfirm && (
        <div className="quit-overlay" onClick={() => setShowQuitConfirm(false)}>
          <div className="theme-modal" onClick={(e) => e.stopPropagation()}>
            <div className="theme-banner">Retour à la sélection</div>
            <button className="theme-close" onClick={() => setShowQuitConfirm(false)} type="button">
              <IconImage src={ICONS.close} alt="Fermer" className="modal-close-icon" />
            </button>
            <div className="theme-panel-title">Voulez-vous quitter le jeu ?</div>
            <div className="theme-button-row">
              <button className="theme-secondary-button theme-secondary-button-muted" onClick={() => setShowQuitConfirm(false)} type="button">Non</button>
              <button className="theme-secondary-button" onClick={confirmQuit} type="button">Oui</button>
            </div>
          </div>
        </div>
      )}

      {showReviewIndices && (
        <div className="review-overlay" onClick={closeReviewIndicesModal}>
          <div className="theme-modal review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="theme-close" onClick={closeReviewIndicesModal} type="button">
              <IconImage src={ICONS.close} alt="Fermer" className="modal-close-icon" />
            </button>

            {!reviewSelectedNumber ? (
              <>
                <div className="theme-banner">Indices déverrouillés</div>
                <div className="theme-panel-title">Revoir les Indices</div>
                <div className="review-page-controls">
                  <button
                    type="button"
                    className="review-page-arrow"
                    onClick={() => goToReviewPage(-1)}
                    disabled={safeReviewPage === 0}
                    aria-label="Page précédente"
                  >
                    ←
                  </button>
                  <span className="review-page-indicator">
                    {safeReviewPage + 1} / {reviewPageCount}
                  </span>
                  <button
                    type="button"
                    className="review-page-arrow"
                    onClick={() => goToReviewPage(1)}
                    disabled={safeReviewPage + 1 >= reviewPageCount}
                    aria-label="Page suivante"
                  >
                    →
                  </button>
                </div>
                <div className="review-grid">
                  {reviewPageNumbers.map((num) => (
                    <button
                      key={num}
                      className="review-slot"
                      onClick={() => handleReviewSlotClick(num)}
                      type="button"
                    >
                      <span className="review-slot-number">{num}</span>
                    </button>
                  ))}
                </div>
                {reviewPageNumbers.length === 0 && (
                  <div className="theme-empty">Aucun indice déverrouillé pour le moment.</div>
                )}
              </>
            ) : (
              <>
                <div className="theme-panel-title">Indice n°{reviewSelectedNumber}</div>
                {reviewSelectedIndices.length ? (
                  <>
                    <div className="indice-step-buttons">
                      {reviewSelectedIndices.map((_, idx) => {
                        const isUnlocked = idx < reviewUnlockedCount;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`indice-step-btn${reviewSelectedIndex === idx ? ' is-active' : ''}`}
                            onClick={() => isUnlocked && setReviewSelectedIndex(idx)}
                            disabled={!isUnlocked}
                            aria-disabled={!isUnlocked}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                    <div className="theme-result-list">
                      {visibleReviewIndices.slice(reviewSelectedIndex, reviewSelectedIndex + 1).map((indice, idx) => (
                        <div key={idx} className="theme-result-item">
                          <span className="theme-result-label">Indice {reviewSelectedIndex + 1}:</span> {indice}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="theme-empty">Rien à signaler...</div>
                )}

                {reviewSelectedIndices.length > 0 && reviewUnlockedCount < reviewSelectedIndices.length && (
                  <button className="theme-secondary-button" onClick={revealNextReviewIndice} type="button">
                    Voir l'indice {reviewUnlockedCount + 1}
                  </button>
                )}

                <button
                  className="theme-secondary-button theme-secondary-button-muted"
                  onClick={() => {
                    setReviewSelectedNumber(null);
                    setReviewVisibleCount(1);
                    setReviewSelectedIndex(0);
                  }}
                  type="button"
                >
                  Retour
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showCode && (
        <div className="code-overlay" onClick={closeCodeModal}>
          <div className="theme-modal keypad-modal" onClick={(e) => e.stopPropagation()}>
            <button className="theme-close" onClick={closeCodeModal} type="button">
              <IconImage src={ICONS.close} alt="Fermer" className="modal-close-icon" />
            </button>

            {!codeResult ? (
              <>
                <div className="theme-display">{codeInput || '0000'}</div>
                <div className="theme-keypad">
                  <button className="theme-key" onClick={() => handleCodeNumber('1')} type="button">1</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('2')} type="button">2</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('3')} type="button">3</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('4')} type="button">4</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('5')} type="button">5</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('6')} type="button">6</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('7')} type="button">7</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('8')} type="button">8</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('9')} type="button">9</button>
                  <button className="theme-key theme-key-cancel" onClick={handleCodeCancel} type="button">C</button>
                  <button className="theme-key" onClick={() => handleCodeNumber('0')} type="button">0</button>
                  <button className="theme-key theme-key-confirm" onClick={handleCodeOk} type="button">OK</button>
                </div>
              </>
            ) : codeResult.type === 'short' ? (
              <>
                <div className="theme-panel-title">Veuillez entrer 4 chiffres.</div>
                <button className="theme-secondary-button theme-secondary-button-muted" onClick={resetCodeResult} type="button">Retour</button>
              </>
            ) : codeResult.type === 'wrong' ? (
              <>
                <div className="theme-modal-icon">
                  <IconImage src={ICONS.penalty} alt="Erreur" />
                </div>
                <div className="theme-panel-title">Code Faux</div>
                <div className="theme-modal-text">Vous perdez 1 minute.</div>
                <button className="theme-secondary-button theme-secondary-button-muted" onClick={resetCodeResult} type="button">Retour</button>
              </>
            ) : (
              <>
                <div className="theme-panel-title">Code n°{codeResult.code}</div>
                <div className="theme-result-item theme-result-single">{codeResult.info}</div>
                <button className="theme-secondary-button theme-secondary-button-muted" onClick={resetCodeResult} type="button">Retour</button>
              </>
            )}
          </div>
        </div>
      )}

      {showMachine && (
        <div
          className={`machine-overlay${machineStage === 'fossils' || machineStage === 'colors' ? ' machine-overlay-fullscreen' : ''}`}
          onClick={closeMachineModal}
        >
          <div
            className={`theme-modal keypad-modal${machineStage === 'fossils' ? ' machine-fossil-modal' : ''}${machineStage === 'colors' ? ' machine-color-modal' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="theme-close" onClick={closeMachineModal} type="button">
              <IconImage src={ICONS.close} alt="Fermer" className="modal-close-icon" />
            </button>

            {machineStage === 'input' && (
              <>
                <div className="theme-panel-title">Machine</div>
                <div className="theme-display">{machineInput || '0'}</div>
                <div className="theme-keypad">
                  <button className="theme-key" onClick={() => handleMachineNumber('1')} type="button">1</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('2')} type="button">2</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('3')} type="button">3</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('4')} type="button">4</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('5')} type="button">5</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('6')} type="button">6</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('7')} type="button">7</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('8')} type="button">8</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('9')} type="button">9</button>
                  <button className="theme-key theme-key-cancel" onClick={handleMachineCancel} type="button">C</button>
                  <button className="theme-key" onClick={() => handleMachineNumber('0')} type="button">0</button>
                  <button className="theme-key theme-key-confirm" onClick={handleMachineOk} type="button">OK</button>
                </div>
              </>
            )}

            {machineStage === 'notfound' && (
              <>
                <div className="theme-modal-icon">
                  <IconImage src={ICONS.machine} alt="Introuvable" />
                </div>
                <div className="theme-panel-title">Machine non trouvée.</div>
                <div className="theme-modal-text">Aucune penalite. Verifiez le numero et reessayez.</div>
                <button className="theme-secondary-button" onClick={closeMachineModal} type="button">Fermer</button>
              </>
            )}

            {machineStage === 'game' && machineData && (
              <>
                <div className="theme-panel-title">Mini jeu Machine</div>
                <div className="theme-modal-text">Clique les boutons dans l'ordre : {machineData.order.join(' - ')}</div>
                <div className="machine-progress">{machineProgress}/{machineData.order.length}</div>
                <div className="machine-game-buttons">
                  {[1, 2, 3].map((value) => (
                    <button key={value} className="theme-key machine-game-key" onClick={() => handleMachineSequenceClick(value)} type="button">
                      {value}
                    </button>
                  ))}
                </div>
                {machineError && <div className="machine-color-error">{machineError}</div>}
              </>
            )}

            {machineStage === 'colors' && machineData?.type === 'colors' && (
              <>
                <div className="machine-color-grid">
                  {MACHINE_COLOR_CONFIG.map((color) => (
                    <div key={color.key} className="machine-color-card">
                      <div className={`machine-color-swatch ${color.swatchClass}`} aria-hidden="true" />
                      <div className="machine-color-label">{color.label}</div>
                      <div className="machine-stepper">
                        <button
                          className="machine-stepper-btn"
                          type="button"
                          onClick={() => updateMachineColorValue(color.key, -1)}
                          aria-label={`Diminuer ${color.label}`}
                        >
                          -
                        </button>
                        <span className="machine-stepper-value">{machineColorValues[color.key]}</span>
                        <button
                          className="machine-stepper-btn"
                          type="button"
                          onClick={() => updateMachineColorValue(color.key, 1)}
                          aria-label={`Augmenter ${color.label}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {machineError && <div className="machine-color-error">{machineError}</div>}
                <div className="machine-color-actions">
                  <button className="theme-secondary-button" onClick={handleMachineColorValidate} type="button">
                    Valider
                  </button>
                  <button className="theme-secondary-button theme-secondary-button-muted" onClick={handleMachineCancel} type="button">
                    Retour
                  </button>
                </div>
              </>
            )}

            {machineStage === 'fossils' && machineData?.type === 'fossils' && (
              <>
                <div className="machine-fossil-header">
                  <div className="machine-fossil-kicker">Machine n°{machineInput}</div>
                  <div className="machine-fossil-title">Chasse aux fossiles</div>
                  <div className="machine-fossil-text">
                    Selectionne jusqu&apos;a {machineData.maxSelections} cases et retrouve les fossiles.
                  </div>
                </div>

                <div className="machine-fossil-board-wrap">
                  <div className="machine-fossil-board">
                    <div className="machine-fossil-corner" />
                    {MACHINE_FOSSIL_COLUMNS.slice(0, machineData.gridSize).map((column) => (
                      <div key={column} className="machine-fossil-axis machine-fossil-axis-top">
                        {column}
                      </div>
                    ))}

                    {Array.from({ length: machineData.gridSize }, (_, rowIndex) => {
                      const rowLabel = rowIndex + 1;
                      return (
                        <React.Fragment key={rowLabel}>
                          <div className="machine-fossil-axis machine-fossil-axis-side">{rowLabel}</div>
                          {MACHINE_FOSSIL_COLUMNS.slice(0, machineData.gridSize).map((column) => {
                            const cellId = `${column}${rowLabel}`;
                            const isSelected = machineFossilSelections.includes(cellId);
                            return (
                              <button
                                key={cellId}
                                type="button"
                                className={`machine-fossil-cell${isSelected ? ' is-selected' : ''}`}
                                onClick={() => toggleMachineFossilSelection(cellId)}
                                aria-pressed={isSelected}
                                aria-label={`${cellId}${isSelected ? ' selectionnee' : ''}`}
                              />
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div className="machine-fossil-selection-count">
                  {machineFossilSelections.length} / {machineData.maxSelections} cases choisies
                </div>
                {machineError && <div className="machine-color-error">{machineError}</div>}
                <div className="machine-fossil-actions">
                  <button className="theme-secondary-button" onClick={handleMachineFossilValidate} type="button">
                    Verifier
                  </button>
                  <button
                    className="theme-secondary-button theme-secondary-button-muted"
                    onClick={() => {
                      setMachineFossilSelections([]);
                      setMachineError('');
                    }}
                    type="button"
                  >
                    Effacer
                  </button>
                </div>
              </>
            )}

            {machineStage === 'success' && machineData && (
              <>
                <div className="theme-panel-title">Machine réussie</div>
                <div className="theme-result-item theme-result-single">{machineData.info}</div>
                <button className="theme-secondary-button" onClick={closeMachineModal} type="button">Fermer</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
