import React from "react";
import TodoList from '../features/components/TodoList';

const TodosPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h1>My Todos</h1>
      <TodoList />
    </div>
  );
};

export default TodosPage;