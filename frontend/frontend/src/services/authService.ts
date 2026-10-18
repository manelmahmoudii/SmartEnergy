import { isAxiosError } from 'axios'
import { api } from './api'

// Valeurs attendues par l'enum Role du backend
export type RoleCode = 'DATA_SCIENTIST' | 'ENERGY_MANAGER' | 'BATIMENT'

export interface RegisterPayload {
  nom: string
  email: string
  password: string
  role: RoleCode
}

export const register = (p: RegisterPayload) =>
  api.post<{ message: string }>('/auth/register', p).then(r => r.data)

// Extrait le message d'erreur renvoyé par GlobalExceptionHandler
export const getErrorMessage = (e: unknown): string => {
  if (isAxiosError(e)) return e.response?.data?.message ?? 'Serveur injoignable. Vérifiez que le backend est démarré.'
  return 'Une erreur inattendue est survenue.'
}
export type Role = 'ADMIN' | 'DATA_SCIENTIST' | 'ENERGY_MANAGER' | 'BATIMENT'
export type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED'
export interface UserDto { id: number; nom: string; email: string; role: Role; status: Status; createdAt?: string }
export const login = (email: string, password: string) =>
  api.post<{ token: string; user: UserDto }>('/auth/login', { email, password }).then(r => r.data)