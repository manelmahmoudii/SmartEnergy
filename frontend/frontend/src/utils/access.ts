import { Role } from '../services/authService'

const BATIMENT_PAGES = ['/dashboard', '/buildings', '/analysis', '/forecast', '/alerts', '/recommendations', '/profile']

export const canAccess = (role: Role | undefined, path: string) => {
  if (!role) return false
  if (role === 'BATIMENT') return BATIMENT_PAGES.includes(path)
  if (path === '/users') return role === 'ADMIN'
  return true
}