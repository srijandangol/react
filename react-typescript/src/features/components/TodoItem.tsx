import React from "react";
import { useDispatch } from "react-redux";
import type { Todo } from '../todos/TodosTypes';
import { toggleTodo, deleteTodo } from '../todos/TodoSlice';

type Props = {
  todo: Todo;
};

const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useDispatch();

  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem",
        borderBottom: "1px solid #ccc",
        textDecoration: todo.completed ? "line-through" : "none",
        cursor: "pointer",
      }}
    >
      <span onClick={() => dispatch(toggleTodo(todo.id))}>{todo.text}</span>
      <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
    </li>
  );
};

export default TodoItem;