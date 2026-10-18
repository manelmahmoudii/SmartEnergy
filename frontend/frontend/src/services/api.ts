import axios from 'axios'

export const api = axios.create({ baseURL: 'http://localhost:8080/api' })
export const ai = axios.create({ baseURL: 'http://localhost:8000' })

api.interceptors.request.use(c => {
  const t = localStorage.getItem('token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

// Token expiré ou invalide : retour à la connexion
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401 && !e.config?.url?.includes('/auth/')) {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    window.location.href = '/'
  }
  return Promise.reject(e)
})