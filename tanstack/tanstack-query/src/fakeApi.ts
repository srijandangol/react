let todos: any[] = [];

export const getTodos = async () => {
  await new Promise((res) => setTimeout(res, 500));
  return [...todos];
};

export const addTodo = async (todo: any) => {
  await new Promise((res) => setTimeout(res, 500));
  const newTodo = { ...todo, id: Date.now() };
  todos.push(newTodo);
  return newTodo;
};

export const updateTodo = async (updated: any) => {
  await new Promise((res) => setTimeout(res, 500));
  todos = todos.map((t) => (t.id === updated.id ? updated : t));
  return updated;
};

export const deleteTodo = async (id: number) => {
  await new Promise((res) => setTimeout(res, 500));
  todos = todos.filter((t) => t.id !== id);
  return id;
};
