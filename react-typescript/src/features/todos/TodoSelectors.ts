import type { RootState } from '../../app/Store';

export const selectTodos = (state: RootState) => state.todos.todos;