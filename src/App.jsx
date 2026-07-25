import React, { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';
import TodoFilters from './components/TodoFilters';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      done: false,
      createdAt: new Date().toLocaleString('ru-RU')
    };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.done));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  const activeCount = todos.filter(t => !t.done).length;
  const completedCount = todos.filter(t => t.done).length;

  return (
    <div className="app">
      <h1 className="app-title">📝 Мои задачи</h1>
      <p className="app-subtitle">
        {activeCount} активных · {completedCount} выполнено
      </p>

      <TodoInput
        input={input}
        setInput={setInput}
        addTodo={addTodo}
      />

      <TodoFilters
        filter={filter}
        setFilter={setFilter}
        completedCount={completedCount}
        clearCompleted={clearCompleted}
      />

      <div className="todo-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {filter === 'all'
              ? 'Задач пока нет. Добавьте первую!'
              : filter === 'active'
                ? 'Нет активных задач!'
                : 'Нет выполненных задач!'}
          </div>
        ) : (
          filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;