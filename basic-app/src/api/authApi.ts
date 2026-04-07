import { axiosClient } from './axiosClient'
import type { User } from '../types/user'

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  token: string
  user: User
}

export async function login(req: LoginRequest): Promise<AuthResponse> {
  const res = await axiosClient.post<AuthResponse>('/auth/login', req)
  return res.data
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  const res = await axiosClient.post<AuthResponse>('/auth/register', req)
  return res.data
}

