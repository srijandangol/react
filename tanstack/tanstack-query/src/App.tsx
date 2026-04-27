import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "./fakeApi";
import "./App.css";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState<Todo | null>(null);
  const queryClient = useQueryClient();

  // FETCH
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // ADD
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditing(null);
      setInput("");
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editing) {
      updateMutation.mutate({ ...editing, title: input });
    } else {
      addMutation.mutate({
        title: input,
        completed: false,
      });
    }

    setInput("");
  };

  return (
    <div className='container'>
      <h1>TanStack Todo</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Add task...'
        />
        <button type='submit'>{editing ? "Update" : "Add"}</button>
      </form>

      {isLoading ? (
        <p>Loading...</p>) : todos.length === 0 ? (
        <p>No tasks yet</p> ) : null}

      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span>{todo.title}</span>

            <div className='actions'>
              <button
                onClick={() =>
                  updateMutation.mutate({ ...todo, completed: !todo.completed })
                }
              >
                {todo.completed ? "Undo" : "Complete"}
              </button>

              <button
                onClick={() => {
                  setEditing(todo);
                  setInput(todo.title);
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteMutation.mutate(todo.id)}
                className='delete'
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
