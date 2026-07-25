import React, { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import { getDeadlineStatus } from '../utils/deadline';

export default function TaskItem({
  task, draggedId, onToggle, onDelete, onEdit,
  onDragStart, onDragEnd, onDragOver
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const dl = getDeadlineStatus(task.deadline);
  const cat = CATEGORIES[task.category];
  const pri = PRIORITIES[task.priority];

  const save = () => {
    if (text.trim()) onEdit(task.id, text.trim());
    setEditing(false);
  };

  return (
    <div
      className={`task-item ${task.done ? 'done' : ''} ${draggedId === task.id ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, task.id)}
    >
      <div className="drag-handle">⋮⋮</div>

      <button
        className={`checkbox ${task.done ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
      >
        {task.done ? '✓' : ''}
      </button>

      <div className="task-content">
        {editing ? (
          <input
            className="edit-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            autoFocus
          />
        ) : (
          <div
            className="task-text"
            onDoubleClick={() => { setText(task.text); setEditing(true); }}
          >
            {task.text}
          </div>
        )}

        <div className="task-meta">
          <span className="category-badge" style={{ background: cat.bg, color: cat.color }}>
            {cat.label}
          </span>
          <span className="priority-indicator" style={{ color: pri.color }}>
            {Array(pri.dots).fill('●').join('')}
          </span>
          {dl && (
            <span className={`deadline ${dl.urgent ? 'urgent' : ''}`} style={{ color: dl.color }}>
              ⏰ {dl.text}
            </span>
          )}
        </div>
      </div>

      <button className="delete-btn" onClick={() => onDelete(task.id)} title="Удалить">
        🗑
      </button>
    </div>
  );
}