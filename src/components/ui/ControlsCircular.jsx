import React from 'react';

export function ControlsCircular({
  isRunning,
  onStartPause,
  onAction,
  gameButtonsLocked,
}) {
  return (
    <div className="controls-circular">
      {/* Top center: Start/Pause */}
      <div className="control-item position-pause">
        <button
          className="circle-btn bg-green"
          onClick={onStartPause}
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? '⏸' : '▶'}
        </button>
        <span>Start/Pause</span>
      </div>

      {/* Left: Indice */}
      <div className="control-item position-indice">
        <button
          className="circle-btn bg-red"
          onClick={() => onAction('indice')}
          title="Indice"
          disabled={gameButtonsLocked}
          aria-disabled={gameButtonsLocked}
        >
          💡
        </button>
        <span>Indice</span>
      </div>

      {/* Right: Code */}
      <div className="control-item position-machine">
        <button
          className="circle-btn bg-blue"
          onClick={() => onAction('code')}
          title="Code"
          disabled={gameButtonsLocked}
          aria-disabled={gameButtonsLocked}
        >
          🔒
        </button>
        <span>Code</span>
      </div>

      {/* Bottom-right: Machine/Engrenage */}
      <div className="control-item position-revoir">
        <button
          className="circle-btn bg-cyan"
          onClick={() => onAction('machine')}
          title="Machine"
          disabled={gameButtonsLocked}
          aria-disabled={gameButtonsLocked}
        >
          ⚙️
        </button>
        <span>Machine</span>
      </div>

      {/* Bottom center: Revoir Indices */}
      <div className="control-item position-revoir-indice">
        <button
          className="circle-btn bg-purple"
          onClick={() => onAction('revoir')}
          title="Revoir Indices"
          disabled={gameButtonsLocked}
          aria-disabled={gameButtonsLocked}
        >
          👁️
        </button>
        <span>Revoir Indices</span>
      </div>

      {/* Center: Pénalité */}
      <div className="control-item position-penalty">
        <button
          className="circle-btn bg-purple penalty-btn"
          onClick={() => onAction('penalty')}
          title="Pénalité"
          disabled={gameButtonsLocked}
          aria-disabled={gameButtonsLocked}
        >
          ☠️
        </button>
        <span>Pénalité</span>
      </div>
    </div>
  );
}
