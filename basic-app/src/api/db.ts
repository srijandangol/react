import usersSeed from '../storage/users.seed.json'

import { Role } from '../types/role'
import type { Role as RoleType } from '../types/role'
import type { User } from '../types/user'

export type UserRecord = User & {
  // Stored only in local “DB” for demo purposes.
  password: string
}

export type UserPublic = User

const USERS_DB_KEY = 'users_db_v1'
const SEED_DATA_KEY = 'seed_data_v1'
let cachedUsers: UserRecord[] | null = null

type SeedUser = {
  id: string
  name: string
  email: string
  password: string
  role: RoleType
  phone?: string
  address?: string
}

function ensureBrowser() {
  if (typeof window === 'undefined' || !window.localStorage) {
    throw new Error('localStorage is not available')
  }
}

function loadUsersFromStorage(): UserRecord[] | null {
  const raw = window.localStorage.getItem(USERS_DB_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed as UserRecord[]
  } catch {
    return null
  }
}

function saveUsersToStorage(users: UserRecord[]) {
  window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(users))
}

function loadSeedDataFromStorage(): SeedUser[] | null {
  const raw = window.localStorage.getItem(SEED_DATA_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed as SeedUser[]
  } catch {
    return null
  }
}

function saveSeedDataToStorage(seedData: SeedUser[]) {
  window.localStorage.setItem(SEED_DATA_KEY, JSON.stringify(seedData))
}

function isSeedUser(value: unknown): value is SeedUser {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.email === 'string' &&
    typeof v.password === 'string' &&
    (v.role === Role.admin || v.role === Role.user)
  )
}

function seedToRecord(seed: unknown): UserRecord {
  if (!isSeedUser(seed)) {
    throw new Error('Invalid seed user record')
  }

  if (
    seed.role !== Role.admin &&
    seed.role !== Role.user
  ) {
    throw new Error('Invalid seed user record')
  }

  return {
    id: seed.id,
    name: seed.name,
    email: seed.email.toLowerCase(),
    password: seed.password,
    role: seed.role,
    phone: typeof seed.phone === 'string' ? seed.phone : '',
    address: typeof seed.address === 'string' ? seed.address : '',
  }
}

function initIfNeeded() {
  ensureBrowser()
  if (cachedUsers) return

  const existing = loadUsersFromStorage()
  if (existing && existing.length > 0) {
    cachedUsers = existing
    return
  }

  // Load seed data from localStorage if available, otherwise use static seed
  const storedSeed = loadSeedDataFromStorage()
  const seedData = storedSeed || usersSeed

  const seeded = (seedData as unknown[]).map(seedToRecord)
  saveUsersToStorage(seeded)
  cachedUsers = seeded
}

export function loadUsers(): UserPublic[] {
  initIfNeeded()
  return cachedUsers!.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    address: u.address,
  }))
}

export function loadUserRecordByEmail(email: string): UserRecord | null {
  initIfNeeded()
  const e = email.trim().toLowerCase()
  return cachedUsers!.find((u) => u.email === e) ?? null
}

export function loadUserRecordById(id: string): UserRecord | null {
  initIfNeeded()
  return cachedUsers!.find((u) => u.id === id) ?? null
}

export function createUserRecord(input: Omit<UserRecord, 'id'> & { id?: string }) {
  initIfNeeded()

  const email = input.email.trim().toLowerCase()
  const exists = cachedUsers!.some((u) => u.email === email)
  if (exists) {
    throw new Error('Email already exists')
  }

  // Generate ID in pattern: u_{role}_{number}
  const id = input.id ?? (() => {
    const rolePrefix = input.role === Role.admin ? 'admin' : 'user'
    const existingIds = cachedUsers!
      .filter(u => u.id.startsWith(`u_${rolePrefix}_`))
      .map(u => {
        const parts = u.id.split('_')
        return parseInt(parts[parts.length - 1]) || 0
      })
      .sort((a, b) => b - a)
    const nextNumber = existingIds.length > 0 ? existingIds[0] + 1 : 1
    return `u_${rolePrefix}_${nextNumber}`
  })()

  const record: UserRecord = {
    id,
    name: input.name,
    email,
    password: input.password,
    role: input.role,
    phone: input.phone,
    address: input.address,
  }

  cachedUsers!.push(record)
  saveUsersToStorage(cachedUsers!)

  // Update seed data in localStorage
  const seedData = cachedUsers!.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    phone: u.phone,
    address: u.address,
  }))
  saveSeedDataToStorage(seedData)

  return record
}

export function updateUserRecord(id: string, patch: Partial<Omit<UserRecord, 'id'>>) {
  initIfNeeded()
  const idx = cachedUsers!.findIndex((u) => u.id === id)
  if (idx < 0) throw new Error('User not found')

  const current = cachedUsers![idx]
  const next: UserRecord = {
    ...current,
    ...patch,
    email: typeof patch.email === 'string' ? patch.email.trim().toLowerCase() : current.email,
  }

  if (typeof patch.email === 'string') {
    const emailTaken = cachedUsers!.some((u) => u.id !== id && u.email === next.email)
    if (emailTaken) throw new Error('Email already exists')
  }

  cachedUsers![idx] = next
  saveUsersToStorage(cachedUsers!)

  // Update seed data in localStorage
  const seedData = cachedUsers!.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    phone: u.phone,
    address: u.address,
  }))
  saveSeedDataToStorage(seedData)

  return next
}

export function deleteUserRecord(id: string) {
  initIfNeeded()
  const before = cachedUsers!.length
  cachedUsers = cachedUsers!.filter((u) => u.id !== id)
  saveUsersToStorage(cachedUsers!)

  // Update seed data in localStorage
  const seedData = cachedUsers!.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    phone: u.phone,
    address: u.address,
  }))
  saveSeedDataToStorage(seedData)

  return cachedUsers!.length !== before
}

export function exportAsSeedData() {
  initIfNeeded()
  // Return seed data from localStorage, which includes all registered users
  const storedSeed = loadSeedDataFromStorage()
  if (storedSeed) {
    return storedSeed
  }
  // Fallback to current users if no stored seed data
  return cachedUsers!.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    phone: u.phone,
    address: u.address,
  }))
}

