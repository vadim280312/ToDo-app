function TodoItem({ todo, deleteTodo, toggleTodo }) {
  return (
    <div className={`todo ${todo.completed ? "completed" : ""}`}>
      <span onClick={() => toggleTodo(todo.id)}>
        {todo.text}
      </span>

      <button onClick={() => deleteTodo(todo.id)}>
        ❌
      </button>
    </div>
  );
}

export default TodoItem;