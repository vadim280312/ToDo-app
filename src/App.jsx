import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProgressRing from './components/ProgressRing';
import TaskItem from './components/TaskItem';
import UndoToast from './components/UndoToast';
import { CATEGORIES, PRIORITIES } from './utils/constants';
import { SOUNDS } from './utils/sounds';
import { launchConfetti } from './utils/confetti';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const s = localStorage.getItem('pro-tasks');
      return s ? JSON.parse(s) : [];
    } catch (e) {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('pro-theme') || 'light');
  const [draggedId, setDraggedId] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem('pro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pro-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every((t) => t.done)) {
      SOUNDS.allDone();
      launchConfetti();
    }
  }, [tasks]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undoStack]);

  const pushUndo = useCallback((currentTasks) => {
    setUndoStack((prev) => [...prev.slice(-9), JSON.parse(JSON.stringify(currentTasks))]);
  }, []);

  const handleUndo = () => {
    if (!undoStack.length) return;
    setTasks(undoStack[undoStack.length - 1]);
    setUndoStack((s) => s.slice(0, -1));
    SOUNDS.undo();
    setShowUndo(false);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const showUndoToast = () => {
    setShowUndo(true);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setShowUndo(false), 6000);
  };

  const addTask = () => {
    if (!input.trim()) return;
    const prev = [...tasks];
    const task = {
      id: Date.now(),
      text: input.trim(),
      done: false,
      category,
      priority,
      deadline: deadline || null,
      createdAt: new Date().toISOString(),
    };
    setTasks([task, ...tasks]);
    pushUndo(prev);
    setInput('');
    setDeadline('');
    SOUNDS.add();
    showUndoToast();
  };

  const toggleTask = (id) => {
    const prev = [...tasks];
    const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(next);
    pushUndo(prev);
    if (next.find((t) => t.id === id)?.done) SOUNDS.complete();
    showUndoToast();
  };

  const deleteTask = (id) => {
    const prev = [...tasks];
    setTasks(tasks.filter((t) => t.id !== id));
    pushUndo(prev);
    SOUNDS.delete();
    showUndoToast();
  };

  const editTask = (id, text) => {
    const prev = [...tasks];
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text } : t)));
    pushUndo(prev);
    showUndoToast();
  };

  const clearCompleted = () => {
    const prev = [...tasks];
    setTasks(tasks.filter((t) => !t.done));
    pushUndo(prev);
    SOUNDS.delete();
    showUndoToast();
  };

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragEnd = () => setDraggedId(null);
  const onDragOver = (e, overId) => {
    e.preventDefault();
    if (draggedId === null || draggedId === overId) return;
    const from = tasks.findIndex((t) => t.id === draggedId);
    const to = tasks.findIndex((t) => t.id === overId);
    if (from === -1 || to === -1) return;
    const next = [...tasks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setTasks(next);
  };

  const filtered = tasks.filter((t) => {
    const matchFilter =
      filter === 'all' ? true : filter === 'active' ? !t.done : t.done;
    const matchSearch = t.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const activeCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="app-wrapper" data-theme={theme}>
      <canvas id="confetti-canvas" />

      <div className="app">
        <header className="app-header">
          <div className="header-row">
            <div>
              <h1 className="app-title">TaskMaster Pro</h1>
              <p className="app-subtitle">Управляй задачами как профи</p>
            </div>
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          <div className="stats-card">
            <ProgressRing progress={progress} />
            <div className="stats-info">
              <div className="stat">
                <span className="stat-value">{activeCount}</span>
                <span className="stat-label">Активных</span>
              </div>
              <div className="divider" />
              <div className="stat">
                <span className="stat-value">{completedCount}</span>
                <span className="stat-label">Выполнено</span>
              </div>
              <div className="divider" />
              <div className="stat">
                <span className="stat-value">{tasks.length}</span>
                <span className="stat-label">Всего</span>
              </div>
            </div>
          </div>
        </header>

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Поиск по задачам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="add-task-card">
          <input
            type="text"
            className="task-input"
            placeholder="Что нужно сделать? (Enter — добавить)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <div className="task-options">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {Object.entries(PRIORITIES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="deadline-input"
            />
            <button className="add-btn" onClick={addTask}>+</button>
          </div>
        </div>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все <span className="badge">{tasks.length}</span>
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Активные <span className="badge">{activeCount}</span>
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Выполненные <span className="badge">{completedCount}</span>
          </button>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Очистить выполненные
            </button>
          )}
        </div>

        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-text">
                {search
                  ? 'Ничего не найдено'
                  : filter === 'completed'
                  ? 'Нет выполненных задач'
                  : 'Задач пока нет'}
              </div>
              {!search && (
                <div className="empty-hint">Добавьте первую задачу выше</div>
              )}
            </div>
          ) : (
            filtered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                draggedId={draggedId}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
              />
            ))
          )}
        </div>

        <UndoToast visible={showUndo} onUndo={handleUndo} />
      </div>
    </div>
  );
}