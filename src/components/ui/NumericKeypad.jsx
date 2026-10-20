import React from 'react';

export function NumericKeypad({
  display,
  onNumber,
  onCancel,
  onOk,
  keypadClass,
  keyClass,
  displayClass,
}) {
  return (
    <>
      <div className={displayClass}>{display || '0'}</div>
      <div className={keypadClass}>
        {/* Rangée 1 */}
        <button className={keyClass} onClick={() => onNumber('1')}>
          1
        </button>
        <button className={keyClass} onClick={() => onNumber('2')}>
          2
        </button>
        <button className={keyClass} onClick={() => onNumber('3')}>
          3
        </button>

        {/* Rangée 2 */}
        <button className={keyClass} onClick={() => onNumber('4')}>
          4
        </button>
        <button className={keyClass} onClick={() => onNumber('5')}>
          5
        </button>
        <button className={keyClass} onClick={() => onNumber('6')}>
          6
        </button>

        {/* Rangée 3 */}
        <button className={keyClass} onClick={() => onNumber('7')}>
          7
        </button>
        <button className={keyClass} onClick={() => onNumber('8')}>
          8
        </button>
        <button className={keyClass} onClick={() => onNumber('9')}>
          9
        </button>

        {/* Rangée 4 - Boutons spéciaux + 0 */}
        <button className={`${keyClass} cancel-btn`} onClick={onCancel}>
          C
        </button>
        <button className={keyClass} onClick={() => onNumber('0')}>
          0
        </button>
        <button className={`${keyClass} ok-btn`} onClick={onOk}>
          OK
        </button>
      </div>
    </>
  );
}
