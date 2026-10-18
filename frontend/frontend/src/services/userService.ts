import { api } from './api'
import { Role, UserDto } from './authService'

export const listUsers = () => api.get<UserDto[]>('/users').then(r => r.data)
export const approveUser = (id: number) => api.patch<UserDto>(`/users/${id}/approve`).then(r => r.data)
export const rejectUser = (id: number) => api.patch<UserDto>(`/users/${id}/reject`).then(r => r.data)
export const banUser = (id: number) => api.patch<UserDto>(`/users/${id}/ban`).then(r => r.data)
export const createUser = (b: { nom: string; email: string; role: Role }) => api.post<UserDto>('/users', b).then(r => r.data)
export const updateUser = (id: number, b: { nom: string; role: Role }) => api.put<UserDto>(`/users/${id}`, b).then(r => r.data)
export const deleteUser = (id: number) => api.delete(`/users/${id}`)
export const getMe = () => api.get<UserDto>('/users/me').then(r => r.data)
export const updateMe = (nom: string) => api.put<UserDto>('/users/me', { nom }).then(r => r.data)
export const changePassword = (currentPassword: string, newPassword: string) =>
  api.put<{ message: string }>('/users/me/password', { currentPassword, newPassword }).then(r => r.data)