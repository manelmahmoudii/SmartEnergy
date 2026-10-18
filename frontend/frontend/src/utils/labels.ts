import { Role, Status } from '../services/authService'

export const ROLE_LABEL: Record<Role, string> = { ADMIN: 'Administrateur', DATA_SCIENTIST: 'Data Scientist', ENERGY_MANAGER: 'Energy Manager' }
export const STATUS_LABEL: Record<Status, string> = { PENDING: 'En attente', APPROVED: 'Approuvé', REJECTED: 'Rejeté', BANNED: 'Banni' }