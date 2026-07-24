import { useEffect, useState } from "react";
import TodoForm from "./components/todoForm";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo(text) {
    if (!text.trim()) return;

    setTodos([
      {
        id: Date.now(),
        text,
        completed: false,
      },
      ...todos,
    ]);
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  return (
    <div className="container">
      <h1> ToDo App</h1>

      <TodoForm addTodo={addTodo} />

      <TodoList
        todos={todos}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
      />

      <p className="count">
        Осталось задач: {todos.filter((t) => !t.completed).length}
      </p>
    </div>
  );
}

export default App;