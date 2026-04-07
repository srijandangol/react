import { users } from '../features/UserData';

export function useUsers() {
  return { data: users, isLoading: false }
}