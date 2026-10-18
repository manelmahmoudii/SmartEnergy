import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Download, Users as UsersIcon, Clock, CheckCircle2, Ban, Pencil, Trash2, Check, X, RotateCcw } from 'lucide-react'
import { Card, PageHeader, Badge, Kpi } from '../../components/ui'
import { Role, Status, UserDto, getErrorMessage } from '../../services/authService'
import * as svc from '../../services/userService'
import { ROLE_LABEL, STATUS_LABEL } from '../../utils/labels'

type Form = { id?: number; nom: string; email: string; role: Role }
type Toast = { type: 'ok' | 'err'; text: string } | null

export default function Users() {
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [q, setQ] = useState('')
  const [fStatus, setFStatus] = useState<Status | ''>('')
  const [fRole, setFRole] = useState<Role | ''>('')
  const [form, setForm] = useState<Form | null>(null)
  const [toDelete, setToDelete] = useState<UserDto | null>(null)

  const notify = (type: 'ok' | 'err', text: string) => { setToast({ type, text }); setTimeout(() => setToast(null), 4500) }

  const load = useCallback(async () => {
    try { setUsers(await svc.listUsers()) } catch (e) { notify('err', getErrorMessage(e)) } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  const run = async (fn: () => Promise<unknown>, okMsg: string): Promise<boolean> => {
    setBusy(true)
    try { await fn(); notify('ok', okMsg); await load(); return true }
    catch (e) { notify('err', getErrorMessage(e)); return false }
    finally { setBusy(false) }
  }

  const shown = useMemo(() => users.filter(u =>
    (!fStatus || u.status === fStatus) && (!fRole || u.role === fRole) &&
    (`${u.nom} ${u.email}`.toLowerCase().includes(q.toLowerCase()))), [users, q, fStatus, fRole])
  const count = (s: Status) => users.filter(u => u.status === s).length
  const pending = users.filter(u => u.status === 'PENDING')

  const save = async () => {
    if (!form) return
    const f = form
    const ok = await run(() => f.id
      ? svc.updateUser(f.id, { nom: f.nom.trim(), role: f.role })
      : svc.createUser({ nom: f.nom.trim(), email: f.email.trim().toLowerCase(), role: f.role }),
      f.id ? 'Utilisateur modifié' : 'Utilisateur créé, un mot de passe temporaire lui est envoyé par e-mail')
    if (ok) setForm(null)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    const u = toDelete
    const ok = await run(() => svc.deleteUser(u.id), 'Utilisateur supprimé')
    if (ok) setToDelete(null)
  }

  const exportCsv = () => {
    const safe = (c: string) => `"${(/^[=+\-@]/.test(c) ? "'" + c : c).replace(/"/g, '""')}"`
    const rows = [['Nom', 'E-mail', 'Rôle', 'Statut'], ...shown.map(u => [u.nom, u.email, ROLE_LABEL[u.role], STATUS_LABEL[u.status]])]
    const blob = new Blob(['\ufeff' + rows.map(r => r.map(safe).join(';')).join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'utilisateurs.csv'; a.click(); URL.revokeObjectURL(a.href)
  }

  return (<>
    <PageHeader t="Utilisateurs" s="Validez les inscriptions et gérez les comptes et les rôles"
      a={<><button className="btn" onClick={exportCsv}><Download size={16} />Exporter CSV</button>
        <button className="btn pri" onClick={() => setForm({ nom: '', email: '', role: 'ENERGY_MANAGER' })}><Plus size={16} />Ajouter</button></>} />

    <div className="grid g4">
      <Kpi icon={<UsersIcon />} color="#8b7bff" l="Total" v={String(users.length)} />
      <Kpi icon={<Clock />} color="#ffb547" l="En attente" v={String(count('PENDING'))} />
      <Kpi icon={<CheckCircle2 />} color="#2de3a6" l="Approuvés" v={String(count('APPROVED'))} />
      <Kpi icon={<Ban />} color="#ff5d7a" l="Bannis" v={String(count('BANNED'))} />
    </div>

    {pending.length > 0 && <Card t={`Inscriptions à valider (${pending.length})`} cls="mt">
      {pending.map(u => <div className="row" key={u.id}>
        <div><b>{u.nom}</b><div className="mute" style={{ fontSize: 12 }}>{u.email} · {ROLE_LABEL[u.role]}</div></div>
        <div className="actions">
          <button className="btn pri sm" disabled={busy} onClick={() => run(() => svc.approveUser(u.id), `${u.nom} est validé(e)`)}><Check size={14} />Valider</button>
          <button className="btn sm danger" disabled={busy} onClick={() => run(() => svc.rejectUser(u.id), 'Inscription rejetée')}><X size={14} />Rejeter</button>
        </div></div>)}
    </Card>}

    <Card cls="mt">
      <div className="filters">
        <input className="input" placeholder="Rechercher par nom ou e-mail…" value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1 }} />
        <select className="input" value={fStatus} onChange={e => setFStatus(e.target.value as Status | '')} aria-label="Statut">
          <option value="">Tous les statuts</option>{(Object.keys(STATUS_LABEL) as Status[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
        <select className="input" value={fRole} onChange={e => setFRole(e.target.value as Role | '')} aria-label="Rôle">
          <option value="">Tous les rôles</option>{(Object.keys(ROLE_LABEL) as Role[]).map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select>
      </div>
      <div style={{ overflowX: 'auto' }}><table><thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
        {loading && <tr><td colSpan={5} className="mute">Chargement…</td></tr>}
        {!loading && shown.length === 0 && <tr><td colSpan={5} className="mute">Aucun utilisateur trouvé.</td></tr>}
        {shown.map(u => <tr key={u.id}>
          <td><b>{u.nom}</b></td><td>{u.email}</td><td>{ROLE_LABEL[u.role]}</td><td><Badge t={STATUS_LABEL[u.status]} /></td>
          <td>{u.role === 'ADMIN' ? <span className="mute">Compte protégé</span> : <div className="actions">
            {u.status === 'PENDING' && <button className="btn pri sm" disabled={busy} onClick={() => run(() => svc.approveUser(u.id), 'Compte validé')}>Valider</button>}
            {u.status === 'APPROVED' && <>
              <button className="btn sm" onClick={() => setForm({ id: u.id, nom: u.nom, email: u.email, role: u.role })}><Pencil size={13} />Modifier</button>
              <button className="btn sm" disabled={busy} onClick={() => run(() => svc.banUser(u.id), `${u.nom} est banni(e)`)}><Ban size={13} />Bannir</button></>}
            {(u.status === 'BANNED' || u.status === 'REJECTED') &&
              <button className="btn sm" disabled={busy} onClick={() => run(() => svc.approveUser(u.id), 'Compte réactivé')}><RotateCcw size={13} />Réactiver</button>}
            <button className="btn sm danger" onClick={() => setToDelete(u)} aria-label={`Supprimer ${u.nom}`}><Trash2 size={13} /></button>
          </div>}</td></tr>)}
      </tbody></table></div>
    </Card>

    {form && <div className="modal-bg" onClick={() => setForm(null)}><div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
      <h2>{form.id ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}</h2>
      <form onSubmit={e => { e.preventDefault(); save() }}>
        <label>Nom complet<input className="input" required value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></label>
        <label>Adresse e-mail<input className="input" type="email" required disabled={!!form.id} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Rôle<select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}>
          {(Object.keys(ROLE_LABEL) as Role[]).map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></label>
        {!form.id && <p className="mute" style={{ fontSize: 13 }}>Un mot de passe temporaire sera généré et envoyé par e-mail.</p>}
        <div className="actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn" onClick={() => setForm(null)}>Annuler</button>
          <button className="btn pri" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button></div>
      </form></div></div>}

    {toDelete && <div className="modal-bg" onClick={() => setToDelete(null)}><div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
      <h2>Supprimer cet utilisateur ?</h2>
      <p className="mute" style={{ margin: '8px 0 18px' }}>{toDelete.nom} ({toDelete.email}) sera supprimé définitivement.</p>
      <div className="actions" style={{ justifyContent: 'flex-end' }}>
        <button className="btn" onClick={() => setToDelete(null)}>Annuler</button>
        <button className="btn pri" style={{ background: 'var(--bad)' }} disabled={busy} onClick={confirmDelete}>Supprimer</button></div>
    </div></div>}

    {toast && <div className="toast"><div className={'msg ' + toast.type} role="status">{toast.text}</div></div>}
  </>)
}