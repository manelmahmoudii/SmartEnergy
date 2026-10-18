import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Card, PageHeader, Badge } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage, UserDto } from '../../services/authService'
import { listUsers } from '../../services/userService'
import * as svc from '../../services/buildingService'
import { BuildingDto, BuildingStatus } from '../../services/buildingService'

const STATUS_LABEL: Record<BuildingStatus, string> = { ACTIF: 'Actif', MAINTENANCE: 'Maintenance', INACTIF: 'Inactif' }
type Form = { id?: number; nom: string; type: string; surface: string; adresse: string; ville: string; status: BuildingStatus; responsableId: string }
const empty: Form = { nom: '', type: '', surface: '', adresse: '', ville: '', status: 'ACTIF', responsableId: '' }

export default function Buildings() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const canEdit = isAdmin || user?.role === 'BATIMENT'
  const [items, setItems] = useState<BuildingDto[]>([])
  const [owners, setOwners] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [toDelete, setToDelete] = useState<BuildingDto | null>(null)

  const notify = (type: 'ok' | 'err', text: string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 4500) }
  const load = useCallback(async () => {
    try { setItems(await svc.listBuildings()) } catch (e) { notify('err', getErrorMessage(e)) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])
  useEffect(() => {
    if (isAdmin) listUsers().then(us => setOwners(us.filter(u => u.role === 'BATIMENT' && u.status === 'APPROVED'))).catch(() => {})
  }, [isAdmin])

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true)
    try { await fn(); notify('ok', ok); await load(); return true }
    catch (e) { notify('err', getErrorMessage(e)); return false }
    finally { setBusy(false) }
  }

  const save = async () => {
    if (!form) return
    const f = form
    const body = { nom: f.nom.trim(), type: f.type.trim(), surface: Number(f.surface), adresse: f.adresse.trim(), ville: f.ville.trim(),
      status: f.status, responsableId: f.responsableId ? Number(f.responsableId) : null }
    const ok = await run(() => f.id ? svc.updateBuilding(f.id, body) : svc.createBuilding(body), f.id ? 'Bâtiment modifié' : 'Bâtiment ajouté')
    if (ok) setForm(null)
  }
  const confirmDelete = async () => {
    if (!toDelete) return
    const b = toDelete
    if (await run(() => svc.deleteBuilding(b.id), 'Bâtiment supprimé')) setToDelete(null)
  }

  return (<>
    <PageHeader t={user?.role === 'BATIMENT' ? 'Mes bâtiments' : 'Bâtiments'}
      s={isAdmin ? 'Organisez les bâtiments et attribuez-les à leurs responsables' : user?.role === 'BATIMENT' ? 'Ajoutez et gérez vos bâtiments' : 'Consultez les bâtiments et leur état'}
      a={canEdit ? <button className="btn pri" onClick={() => setForm(empty)}><Plus size={16} />Ajouter un bâtiment</button> : undefined} />

    <Card><div style={{ overflowX: 'auto' }}><table><thead><tr><th>Nom</th><th>Type</th><th>Surface</th><th>Ville</th><th>Responsable</th><th>Statut</th>{canEdit && <th>Actions</th>}</tr></thead><tbody>
      {loading && <tr><td colSpan={7} className="mute">Chargement…</td></tr>}
      {!loading && items.length === 0 && <tr><td colSpan={7} className="mute">{user?.role === 'BATIMENT' ? 'Vous n’avez pas encore de bâtiment. Cliquez sur « Ajouter un bâtiment ».' : 'Aucun bâtiment.'}</td></tr>}
      {items.map(b => <tr key={b.id}><td><b>{b.nom}</b></td><td>{b.type}</td><td>{b.surface.toLocaleString('fr')} m²</td><td>{b.ville || '—'}</td>
        <td>{b.responsableNom || <span className="mute">Non attribué</span>}</td><td><Badge t={STATUS_LABEL[b.status]} /></td>
        {canEdit && <td><div className="actions">
          <button className="btn sm" onClick={() => setForm({ id: b.id, nom: b.nom, type: b.type, surface: String(b.surface), adresse: b.adresse ?? '', ville: b.ville ?? '', status: b.status, responsableId: b.responsableId ? String(b.responsableId) : '' })}><Pencil size={13} />Modifier</button>
          <button className="btn sm danger" onClick={() => setToDelete(b)} aria-label={`Supprimer ${b.nom}`}><Trash2 size={13} /></button></div></td>}</tr>)}
    </tbody></table></div></Card>

    {form && <div className="modal-bg" onClick={() => setForm(null)}><div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
      <h2>{form.id ? 'Modifier le bâtiment' : 'Ajouter un bâtiment'}</h2>
      <form onSubmit={e => { e.preventDefault(); save() }}>
        <label>Nom<input className="input" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></label>
        <label>Type (Bureaux, Enseignement…)<input className="input" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} /></label>
        <label>Surface (m²)<input className="input" type="number" min="1" step="any" required value={form.surface} onChange={e => setForm({ ...form, surface: e.target.value })} /></label>
        <label>Adresse<input className="input" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} /></label>
        <label>Ville<input className="input" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} /></label>
        <label>Statut<select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as BuildingStatus })}>
          {(Object.keys(STATUS_LABEL) as BuildingStatus[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
        {isAdmin && <label>Responsable (rôle Bâtiment)<select className="input" value={form.responsableId} onChange={e => setForm({ ...form, responsableId: e.target.value })}>
          <option value="">Non attribué</option>{owners.map(o => <option key={o.id} value={o.id}>{o.nom} ({o.email})</option>)}</select></label>}
        <div className="actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn" onClick={() => setForm(null)}>Annuler</button>
          <button className="btn pri" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button></div>
      </form></div></div>}

    {toDelete && <div className="modal-bg" onClick={() => setToDelete(null)}><div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
      <h2>Supprimer ce bâtiment ?</h2><p className="mute" style={{ margin: '8px 0 18px' }}>{toDelete.nom} sera supprimé définitivement.</p>
      <div className="actions" style={{ justifyContent: 'flex-end' }}><button className="btn" onClick={() => setToDelete(null)}>Annuler</button>
        <button className="btn pri" style={{ background: 'var(--bad)' }} disabled={busy} onClick={confirmDelete}>Supprimer</button></div></div></div>}

    {msg && <div className="toast"><div className={'msg ' + msg.type} role="status">{msg.text}</div></div>}
  </>)
}