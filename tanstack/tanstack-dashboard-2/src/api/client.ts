/**
 * API Client placeholder for localStorage mode.
 *
 * The application no longer uses Axios because it is running without a backend.
 */

export const apiClient = {
  get: async <T = unknown>(): Promise<T> => {
    throw new Error('apiClient.get is not supported in localStorage mode. Use usersApi instead.');
  },
  post: async <T = unknown>(): Promise<T> => {
    throw new Error('apiClient.post is not supported in localStorage mode. Use usersApi instead.');
  },
  put: async <T = unknown>(): Promise<T> => {
    throw new Error('apiClient.put is not supported in localStorage mode. Use usersApi instead.');
  },
  patch: async <T = unknown>(): Promise<T> => {
    throw new Error('apiClient.patch is not supported in localStorage mode. Use usersApi instead.');
  },
  delete: async <T = unknown>(): Promise<T> => {
    throw new Error('apiClient.delete is not supported in localStorage mode. Use usersApi instead.');
  },
};
