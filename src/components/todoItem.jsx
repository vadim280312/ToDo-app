import React from 'react';

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <div className={`todo-item ${todo.done ? 'done' : ''}`}>
      <button
        className={`checkbox ${todo.done ? 'checked' : ''}`}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.done && '✓'}
      </button>

      <div className="todo-content">
        <div className="todo-text">{todo.text}</div>
        <div className="todo-date">{todo.createdAt}</div>
      </div>

      <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
        Удалить
      </button>
    </div>
  );
}

export default TodoItem;