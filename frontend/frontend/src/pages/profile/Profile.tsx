import { FormEvent, useEffect, useState } from 'react'
import { Eye, EyeOff, Save, ShieldCheck, KeyRound, UserRound, Mail, BadgeCheck, CalendarDays, Check, Lock } from 'lucide-react'
import { Card } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage, Role } from '../../services/authService'
import { changePassword, getMe, updateMe } from '../../services/userService'
import { ROLE_LABEL, STATUS_LABEL } from '../../utils/labels'

const PERMS: Record<Role, string[]> = {
  ADMIN: ['Valider les inscriptions et gérer les utilisateurs', 'Gérer tous les bâtiments et leurs responsables', 'Importer et préparer les données', 'Consulter toutes les analyses et prévisions'],
  DATA_SCIENTIST: ['Importer et préparer les données', 'Entraîner et comparer les modèles', 'Suivre les performances des modèles', 'Consulter prévisions et anomalies'],
  ENERGY_MANAGER: ['Analyser la consommation et l’historique', 'Consulter prévisions, pics et anomalies', 'Simuler et comparer des scénarios', 'Consulter alertes et recommandations'],
  BATIMENT: ['Gérer vos bâtiments', 'Consulter votre consommation et votre historique', 'Consulter prévisions et alertes', 'Consulter les recommandations'],
}

const strength = (p: string) => {
  let s = 0
  if (p.length >= 8) s++
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}
const S_LABEL = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent']
const S_COLOR = ['var(--bad)', 'var(--bad)', 'var(--am)', 'var(--cy)', 'var(--ok)']

function PwdField({ label, value, onChange, auto }: { label: string; value: string; onChange: (v: string) => void; auto: string }) {
  const [show, setShow] = useState(false)
  return (<label className="field">{label}
    <div className="fwrap">
      <input className="input" type={show ? 'text' : 'password'} required value={value} autoComplete={auto} onChange={e => onChange(e.target.value)} />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </div></label>)
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [nom, setNom] = useState(user?.nom ?? '')
  const [savingP, setSavingP] = useState(false)
  const [cur, setCur] = useState('')
  const [np, setNp] = useState('')
  const [cf, setCf] = useState('')
  const [savingW, setSavingW] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const notify = (type: 'ok' | 'err', text: string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 4500) }

  // Données fraîches (date d'inscription, statut) depuis le backend
  useEffect(() => { getMe().then(me => { updateUser(me); setNom(me.nom) }).catch(() => {}) }, [])

  if (!user) return null
  const initials = user.nom.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
  const since = user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
  const score = strength(np)

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setSavingP(true)
    try { updateUser(await updateMe(nom.trim())); notify('ok', 'Profil mis à jour') }
    catch (err) { notify('err', getErrorMessage(err)) }
    finally { setSavingP(false) }
  }

  const savePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (np.length < 8) return notify('err', 'Le nouveau mot de passe doit contenir au moins 8 caractères.')
    if (np !== cf) return notify('err', 'Les deux nouveaux mots de passe ne correspondent pas.')
    setSavingW(true)
    try { await changePassword(cur, np); setCur(''); setNp(''); setCf(''); notify('ok', 'Mot de passe modifié') }
    catch (err) { notify('err', getErrorMessage(err)) }
    finally { setSavingW(false) }
  }

  return (<>
    <div className="phero">
      <div className="avatar-xl">{initials}</div>
      <div className="who">
        <h1>{user.nom}</h1>
        <div style={{ opacity: .9, marginTop: 4 }}>{user.email}</div>
        <div className="chips">
          <span className="chip"><BadgeCheck size={15} />{ROLE_LABEL[user.role]}</span>
          <span className="chip"><ShieldCheck size={15} />{STATUS_LABEL[user.status]}</span>
          <span className="chip"><CalendarDays size={15} />Membre depuis le {since}</span>
        </div>
      </div>
    </div>

    <div className="grid g11 mt">
      <Card>
        <div className="sec-ic" style={{ background: 'color-mix(in srgb,var(--vi) 18%,transparent)', color: 'var(--vi)' }}><UserRound size={20} /></div>
        <h2>Informations personnelles</h2>
        <form className="stack" onSubmit={saveProfile}>
          <label className="field">Nom complet<input className="input" required maxLength={120} value={nom} onChange={e => setNom(e.target.value)} /></label>
          <label className="field">Adresse e-mail<div className="fwrap"><input className="input" value={user.email} disabled /><span className="lock"><Mail size={16} /></span></div></label>
          <label className="field">Rôle<div className="fwrap"><input className="input" value={ROLE_LABEL[user.role]} disabled /><span className="lock"><Lock size={16} /></span></div></label>
          <p className="mute" style={{ fontSize: 13 }}>L’e-mail est votre identifiant et le rôle est attribué par l’administrateur.</p>
          <button className="btn pri" style={{ alignSelf: 'flex-start' }} disabled={savingP || !nom.trim() || nom.trim() === user.nom}><Save size={16} />{savingP ? 'Enregistrement…' : 'Enregistrer'}</button>
        </form>
      </Card>

      <Card>
        <div className="sec-ic" style={{ background: 'color-mix(in srgb,var(--cy) 18%,transparent)', color: 'var(--cy)' }}><KeyRound size={20} /></div>
        <h2>Sécurité</h2>
        <form className="stack" onSubmit={savePassword}>
          <PwdField label="Mot de passe actuel" value={cur} onChange={setCur} auto="current-password" />
          <PwdField label="Nouveau mot de passe" value={np} onChange={setNp} auto="new-password" />
          {np && <div><div className="strength">{[0, 1, 2, 3].map(i => <i key={i} style={{ background: i < score ? S_COLOR[score] : undefined }} />)}</div>
            <small style={{ color: S_COLOR[score] }}>{S_LABEL[score]}</small></div>}
          <PwdField label="Confirmer le nouveau mot de passe" value={cf} onChange={setCf} auto="new-password" />
          <p className="mute" style={{ fontSize: 13 }}>8 caractères minimum. Mélangez majuscules, minuscules, chiffres et symboles.</p>
          <button className="btn pri" style={{ alignSelf: 'flex-start' }} disabled={savingW}><KeyRound size={16} />{savingW ? 'Modification…' : 'Changer le mot de passe'}</button>
        </form>
      </Card>
    </div>

    <Card t={`Ce que vous pouvez faire · ${ROLE_LABEL[user.role]}`} cls="mt">
      <div className="grid g3" style={{ gap: 0 }}>
        {PERMS[user.role].map(p => <div className="perm" key={p}><Check size={18} /><span>{p}</span></div>)}
      </div>
    </Card>

    {msg && <div className="toast"><div className={'msg ' + msg.type} role="status">{msg.text}</div></div>}
  </>)
}