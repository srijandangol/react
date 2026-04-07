import { axiosClient } from './axiosClient'
import type { Role } from '../types/role'
import type { User } from '../types/user'

export type CreateUserRequest = {
  name: string
  email: string
  password: string
  role: Role
  phone: string
  address: string
}

export type UpdateUserRequest = Partial<{
  name: string
  email: string
  password: string
  role: Role
  phone: string
  address: string
}>

export type DeleteUserResponse = { deleted: boolean }

export async function listUsers(): Promise<User[]> {
  const res = await axiosClient.get<User[]>('/users')
  return res.data
}

export async function createUser(req: CreateUserRequest): Promise<User> {
  const res = await axiosClient.post<User>('/users', req)
  return res.data
}

export async function updateUser(id: string, req: UpdateUserRequest): Promise<User> {
  const res = await axiosClient.put<User>(`/users/${id}`, req)
  return res.data
}

export async function deleteUser(id: string): Promise<DeleteUserResponse> {
  const res = await axiosClient.delete<DeleteUserResponse>(`/users/${id}`)
  return res.data
}

export async function exportSeedData() {
  const res = await axiosClient.get<Record<string, unknown>[]>('/seed-export')
  return res.data
}

