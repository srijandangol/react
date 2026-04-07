import { create } from 'zustand'
import { Role } from '../types/role'
import type { Role as RoleType } from '../types/role'
import type { User } from '../types/user'

const AUTH_TOKEN_KEY = 'auth_token_v1'
const AUTH_USER_KEY = 'auth_user_v1'

type AuthState = {
  token: string | null
  user: User | null
  isReady: boolean
  signIn: (params: { token: string; user: User }) => void
  logout: () => void
  rehydrate: () => void
  hasRole: (role: RoleType) => boolean
}

function safeParseUser(raw: string | null): User | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as User
    if (!parsed || typeof parsed.id !== 'string') return null
    if (!parsed.role || (parsed.role !== Role.admin && parsed.role !== Role.user)) return null
    return parsed
  } catch {
    return null
  }
}

function loadInitialToken(): string | null {
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

function loadInitialUser(): User | null {
  const storedUser = safeParseUser(window.localStorage.getItem(AUTH_USER_KEY))
  if (storedUser) return storedUser

  // If no stored user, return null (token alone is not enough)
  return null
}

export const useAuthStore = create<AuthState>((set, get) => {
  const token = loadInitialToken()
  const user = loadInitialUser()

  return {
    token,
    user,
    isReady: true,
    signIn: ({ token: nextToken, user: nextUser }) => {
      window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
      set({ token: nextToken, user: nextUser })
    },
    logout: () => {
      try {
        window.localStorage.removeItem(AUTH_TOKEN_KEY)
        window.localStorage.removeItem(AUTH_USER_KEY)
      } catch {
        // ignore
      }
      set({ token: null, user: null })
    },
    rehydrate: () => {
      const currentToken = loadInitialToken()
      const currentUser = loadInitialUser()
      set({ token: currentToken, user: currentUser })
    },
    hasRole: (role: Role) => {
      const u = get().user
      return !!u && u.role === role
    },
  }
})

