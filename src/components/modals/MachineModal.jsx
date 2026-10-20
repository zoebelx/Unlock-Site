import React, { useState } from 'react';
import { NumericKeypad } from '../ui/NumericKeypad';
import { getMachineInfo } from '../../constants/machines';

export function MachineModal({ isOpen, onClose }) {
  const [machineInput, setMachineInput] = useState('');
  const [machineStage, setMachineStage] = useState('input');
  const [machineData, setMachineData] = useState(null);
  const [machineProgress, setMachineProgress] = useState(0);

  const handleNumber = (num) => {
    if (machineInput.length < 12) {
      setMachineInput(machineInput + num);
    }
  };

  const handleCancel = () => {
    setMachineInput('');
    setMachineStage('input');
    setMachineData(null);
    setMachineProgress(0);
  };

  const handleOk = () => {
    const data = getMachineInfo(machineInput);
    if (!data) {
      setMachineStage('notfound');
      return;
    }

    setMachineData(data);
    setMachineProgress(0);
    setMachineStage('game');
  };

  const handleSequenceClick = (value) => {
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

    setMachineProgress(0);
  };

  const closeMachine = () => {
    handleCancel();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="machine-overlay" onClick={closeMachine}>
      <div className="machine-modal" onClick={(e) => e.stopPropagation()}>
        <button className="machine-close" onClick={closeMachine}>
          ✖️
        </button>

        {machineStage === 'input' && (
          <>
            <div className="machine-title">Machine</div>
            <NumericKeypad
              display={machineInput || '0'}
              onNumber={handleNumber}
              onCancel={handleCancel}
              onOk={handleOk}
              keypadClass="machine-keypad"
              keyClass="machine-key"
              displayClass="machine-display"
            />
          </>
        )}

        {machineStage === 'notfound' && (
          <>
            <button className="machine-close machine-close-error" onClick={closeMachine}>
              ✖️
            </button>
            <div className="machine-skull">☠️</div>
            <div className="machine-error-title">Machine non trouvée.</div>
            <button className="machine-result-close" onClick={closeMachine}>
              Fermer
            </button>
          </>
        )}

        {machineStage === 'game' && machineData && (
          <>
            <div className="machine-title">Mini jeu Machine</div>
            <div className="machine-game-hint">
              Clique les boutons dans l'ordre : {machineData.order.join(' - ')}
            </div>
            <div className="machine-progress">
              {machineProgress}/{machineData.order.length}
            </div>
            <div className="machine-game-buttons">
              {[1, 2, 3].map((value) => (
                <button key={value} className="machine-game-btn" onClick={() => handleSequenceClick(value)}>
                  {value}
                </button>
              ))}
            </div>
          </>
        )}

        {machineStage === 'success' && machineData && (
          <>
            <div className="machine-success-title">Machine réussie</div>
            <div className="machine-success-text">{machineData.info}</div>
            <button className="machine-result-close" onClick={closeMachine}>
              Fermer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
