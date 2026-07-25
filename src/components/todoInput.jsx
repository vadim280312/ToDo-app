import React from 'react';

function TodoInput({ input, setInput, addTodo }) {
  return (
    <div className="todo-input-row">
      <input
        className="todo-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
        placeholder="Что нужно сделать?"
      />
      <button className="add-btn" onClick={addTodo}>
        Добавить
      </button>
    </div>
  );
}

export default TodoInput;