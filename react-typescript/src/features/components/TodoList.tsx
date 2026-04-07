import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TodoItem from "./TodoItem";
import { selectTodos } from '../todos/TodoSelectors';
import { addTodo } from '../todos/TodoSlice';

const TodoList: React.FC = () => {
  const todos = useSelector(selectTodos);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addTodo(text));
      setText("");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo"
        />
        <button onClick={handleAdd} style={{ marginLeft: "0.5rem" }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;