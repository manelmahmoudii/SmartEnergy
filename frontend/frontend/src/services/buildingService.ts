import { api } from './api'

export type BuildingStatus = 'ACTIF' | 'MAINTENANCE' | 'INACTIF'
export interface BuildingDto {
  id: number; nom: string; type: string; surface: number; adresse?: string; ville?: string
  status: BuildingStatus; responsableId?: number | null; responsableNom?: string | null
}
export type BuildingForm = Omit<BuildingDto, 'id' | 'responsableNom'>

export const listBuildings = () => api.get<BuildingDto[]>('/buildings').then(r => r.data)
export const createBuilding = (b: BuildingForm) => api.post<BuildingDto>('/buildings', b).then(r => r.data)
export const updateBuilding = (id: number, b: BuildingForm) => api.put<BuildingDto>(`/buildings/${id}`, b).then(r => r.data)
export const deleteBuilding = (id: number) => api.delete(`/buildings/${id}`)