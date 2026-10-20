import React from 'react';

export function TimerBar({ formattedTime, onToggleTimer, isRunning }) {
  return (
    <div className="timer-container" onClick={onToggleTimer} title={isRunning ? 'Pause' : 'Start'}>
      <span className="timer-text">{formattedTime}</span>
    </div>
  );
}
