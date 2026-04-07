import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Role } from '../types/role'
import {
  createUserRecord,
  deleteUserRecord,
  loadUserRecordByEmail,
  loadUserRecordById,
  loadUsers,
  updateUserRecord,
  exportAsSeedData,
} from './db'

function jsonResponse<T>(
  config: AxiosRequestConfig,
  status: number,
  data: T,
): Promise<AxiosResponse<T>> {
  const cfg: AxiosRequestConfig = {
    ...config,
    headers: config.headers ?? {},
  }

  return Promise.resolve({
    data,
    status,
    statusText: String(status),
    headers: {},
    config: cfg,
  } as AxiosResponse<T>)
}

function parseRequestBody(config: AxiosRequestConfig): unknown {
  const raw = config.data
  if (!raw) return undefined
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return undefined
    }
  }
  return raw
}

function extractAuthToken(config: AxiosRequestConfig): string | null {
  const auth = config.headers?.Authorization ?? config.headers?.authorization
  if (!auth || typeof auth !== 'string') return null
  const parts = auth.split(' ')
  if (parts.length === 2 && parts[0] === 'Bearer') return parts[1]
  return null
}

function normalizeUrl(url: string) {
  // axios baseURL is `/api`, so we may see `/auth/login` or `api/auth/login`.
  let out = url.trim()
  if (out.startsWith('/')) out = out.slice(1)
  if (out.startsWith('api/')) out = out.slice(4)
  return `/${out}`
}

function getAuthedUserId(config: AxiosRequestConfig): string | null {
  const token = extractAuthToken(config)
  if (!token) return null
  // Token is simply the user ID
  const user = loadUserRecordById(token)
  return user ? token : null
}

export const mockAdapter: AxiosAdapter = (config) => {
  const method = (config.method ?? 'get').toLowerCase()
  const url = normalizeUrl(config.url ?? '')

  // Simple routing table.
  const routeKey = `${method.toUpperCase()} ${url}`

  // Auth endpoints.
  if (routeKey === 'POST /auth/login') {
    const body = parseRequestBody(config)
    const email =
      typeof (body as Record<string, unknown> | undefined)?.email === 'string'
        ? ((body as Record<string, unknown>).email as string)
        : ''
    const password =
      typeof (body as Record<string, unknown> | undefined)?.password === 'string'
        ? ((body as Record<string, unknown>).password as string)
        : ''

    const record = loadUserRecordByEmail(email)
    if (!record || record.password !== password) {
      return jsonResponse(config, 401, { message: 'Invalid credentials' })
    }

    // Token is simply the user ID
    const token = record.id

    return jsonResponse(config, 200, {
      token,
      user: {
        id: record.id,
        name: record.name,
        email: record.email,
        role: record.role,
        phone: record.phone,
        address: record.address,
      },
    })
  }

  if (routeKey === 'POST /auth/register') {
    const body = parseRequestBody(config)
    const name =
      typeof (body as Record<string, unknown> | undefined)?.name === 'string'
        ? ((body as Record<string, unknown>).name as string)
        : ''
    const email =
      typeof (body as Record<string, unknown> | undefined)?.email === 'string'
        ? ((body as Record<string, unknown>).email as string)
        : ''
    const password =
      typeof (body as Record<string, unknown> | undefined)?.password === 'string'
        ? ((body as Record<string, unknown>).password as string)
        : ''

    if (!name || !email || !password) {
      return jsonResponse(config, 400, { message: 'Missing required fields' })
    }

    try {
      const record = createUserRecord({
        name,
        email,
        password,
        role: Role.user,
        phone: '',
        address: '',
      })

      // Token is simply the user ID
      const token = record.id

      return jsonResponse(config, 201, {
        token,
        user: {
          id: record.id,
          name: record.name,
          email: record.email,
          role: record.role,
          phone: record.phone,
          address: record.address,
        },
      })
    } catch (e) {
      return jsonResponse(config, 400, { message: (e as Error).message ?? 'Registration failed' })
    }
  }

  // Export seed data (public endpoint - for downloading current state)
  if (routeKey === 'GET /seed-export') {
    return jsonResponse(config, 200, exportAsSeedData())
  }

  // Remaining endpoints require auth.
  const userId = getAuthedUserId(config)
  if (!userId) {
    return jsonResponse(config, 401, { message: 'Unauthorized' })
  }

  const authedUser = loadUserRecordById(userId)
  if (!authedUser) {
    return jsonResponse(config, 401, { message: 'Unauthorized' })
  }

  // Users list (admin sees all, non-admin sees self).
  if (routeKey === 'GET /users') {
    if (authedUser.role === Role.admin) {
      return jsonResponse(config, 200, loadUsers())
    }

    return jsonResponse(config, 200, [
      {
        id: authedUser.id,
        name: authedUser.name,
        email: authedUser.email,
        role: authedUser.role,
        phone: authedUser.phone,
        address: authedUser.address,
      },
    ])
  }

  // Create user (admin only)
  if (routeKey === 'POST /users') {
    if (authedUser.role !== Role.admin) {
      return jsonResponse(config, 403, { message: 'Forbidden' })
    }

    const body = parseRequestBody(config)
    const b = (body ?? {}) as Record<string, unknown>
    const name = typeof b.name === 'string' ? b.name : ''
    const email = typeof b.email === 'string' ? b.email : ''
    const password = typeof b.password === 'string' ? b.password : ''
    const role = b.role === Role.admin ? Role.admin : Role.user
    const phone = typeof b.phone === 'string' ? b.phone : ''
    const address = typeof b.address === 'string' ? b.address : ''

    try {
      const record = createUserRecord({
        name,
        email,
        password,
        role,
        phone,
        address,
      })

      return jsonResponse(config, 201, {
        id: record.id,
        name: record.name,
        email: record.email,
        role: record.role,
        phone: record.phone,
        address: record.address,
      })
    } catch (e) {
      return jsonResponse(config, 400, { message: (e as Error).message ?? 'Create failed' })
    }
  }

  // Routes with :id
  const matchUpdate = url.match(/^\/users\/([^/]+)$/)
  if (matchUpdate) {
    const userId = matchUpdate[1]

    if (method === 'put') {
      if (authedUser.role !== Role.admin) {
        return jsonResponse(config, 403, { message: 'Forbidden' })
      }

      const body = parseRequestBody(config)
      const b = (body ?? {}) as Record<string, unknown>
      const nextPatch: Record<string, unknown> = {}

      if (typeof b.name === 'string') nextPatch.name = b.name
      if (typeof b.email === 'string') nextPatch.email = b.email
      if (typeof b.role === 'string') nextPatch.role = b.role === Role.admin ? Role.admin : Role.user
      if (typeof b.phone === 'string') nextPatch.phone = b.phone
      if (typeof b.address === 'string') nextPatch.address = b.address
      if (typeof b.password === 'string' && b.password.trim().length > 0) nextPatch.password = b.password

      try {
        const record = updateUserRecord(userId, nextPatch)
        return jsonResponse(config, 200, {
          id: record.id,
          name: record.name,
          email: record.email,
          role: record.role,
          phone: record.phone,
          address: record.address,
        })
      } catch (e) {
        return jsonResponse(config, 400, { message: (e as Error).message ?? 'Update failed' })
      }
    }

    if (method === 'delete') {
      if (authedUser.role !== Role.admin) {
        return jsonResponse(config, 403, { message: 'Forbidden' })
      }

      const deleted = deleteUserRecord(userId)
      if (!deleted) return jsonResponse(config, 404, { message: 'User not found' })
      return jsonResponse(config, 200, { deleted: true })
    }
  }

  return jsonResponse(config, 404, { message: `No route for ${routeKey}` })
}

