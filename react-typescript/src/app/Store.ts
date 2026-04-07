import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../features/todos/TodoSlice";
import { loadState, saveState } from "../utils/localStorage";

const persistedTodos = loadState<{ todos: { id: number; text: string; completed: boolean }[] }>("todos");

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  preloadedState: {
    todos: persistedTodos || { todos: [] }, // use localStorage if exists
  },
});

// Subscribe to store changes to save in localStorage
store.subscribe(() => {
  saveState("todos", store.getState().todos);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;