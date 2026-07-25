import React from 'react';

export default function UndoToast({ visible, onUndo }) {
  if (!visible) return null;

  return (
    <div className="undo-toast">
      <span>✓ Изменение сохранено</span>
      <button onClick={onUndo}>↩ Отменить (Ctrl+Z)</button>
    </div>
  );
}