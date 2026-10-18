import { createContext, ReactNode, useContext, useState } from 'react'
import { login, UserDto } from '../services/authService'

interface Ctx { user: UserDto | null; signIn: (email: string, password: string) => Promise<void>; signOut: () => void }
const AuthCtx = createContext<Ctx>(null!)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })
  const signIn = async (email: string, password: string) => {
    const r = await login(email, password)
    localStorage.setItem('token', r.token)
    localStorage.setItem('user', JSON.stringify(r.user))
    setUser(r.user)
  }
  const signOut = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null) }
  return <AuthCtx.Provider value={{ user, signIn, signOut }}>{children}</AuthCtx.Provider>
}