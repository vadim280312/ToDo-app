import React from 'react';

const filters = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'completed', label: 'Выполненные' }
];

function TodoFilters({ filter, setFilter, completedCount, clearCompleted }) {
  return (
    <div className="filter-row">
      {filters.map(f => (
        <button
          key={f.key}
          className={`filter-btn ${filter === f.key ? 'active' : ''}`}
          onClick={() => setFilter(f.key)}
        >
          {f.label}
        </button>
      ))}
      {completedCount > 0 && (
        <button className="clear-btn" onClick={clearCompleted}>
          Очистить выполненные
        </button>
      )}
    </div>
  );
}

export default TodoFilters;