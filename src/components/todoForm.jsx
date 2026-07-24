import { useState } from "react";

function TodoForm({ addTodo }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    addTodo(text);
    setText("");
  }

  return (
    <form onSubmit={submit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите задачу..."
      />

      <button>Добавить</button>
    </form>
  );
}

export default TodoForm;