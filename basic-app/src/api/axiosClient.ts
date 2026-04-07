import axios from 'axios'
import { mockAdapter } from './mockAdapter'

const AUTH_TOKEN_KEY = 'auth_token_v1'

export const axiosClient = axios.create({
  baseURL: '/api',
  // Custom adapter makes this “API” run entirely in the browser.
  adapter: mockAdapter,
})

axiosClient.interceptors.request.use((config) => {
  let token: string | null = null
  try {
    token = window.localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    token = null
  }

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

