export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");

const saveToStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const getTodos = async (): Promise<Todo[]> => {
  await new Promise((res) => setTimeout(res, 1000));
  return [...todos];
};

export const addTodo = async (todo: Omit<Todo, "id">): Promise<Todo> => {
  await new Promise((res) => setTimeout(res, 1000));
  const newTodo: Todo = { ...todo, id: Date.now() };
  todos.push(newTodo);
  saveToStorage();
  return newTodo;
};

export const updateTodo = async (updated: Todo): Promise<Todo> => {
  await new Promise((res) => setTimeout(res, 1000));
  todos = todos.map((t) => (t.id === updated.id ? updated : t));
  saveToStorage();
  return updated;
};

export const deleteTodo = async (id: number): Promise<number> => {
  await new Promise((res) => setTimeout(res, 500));
  todos = todos.filter((t) => t.id !== id);
  saveToStorage();
  return id;
};