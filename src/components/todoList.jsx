import TodoItem from "./todoItem";

function TodoList({ todos, deleteTodo, toggleTodo }) {
  return (
    <div className="list">
      {todos.length === 0 ? (
        <h3>Нет задач</h3>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
          />
        ))
      )}
    </div>
  );
}

export default TodoList;