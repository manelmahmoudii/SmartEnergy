import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage, register, RoleCode } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
const F = ({ l, t = 'text', p, v, set }: { l: string; t?: string; p?: string; v?: string; set?: (s: string) => void }) =>
  <label>{l}<input className="input" type={t} placeholder={p} required value={v} onChange={e => set?.(e.target.value)} /></label>

export function Login() {
  const go = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try { await signIn(email.trim().toLowerCase(), password); go('/dashboard') }
    catch (err) { setError(getErrorMessage(err)) }
    finally { setLoading(false) }
  }

  return (<form onSubmit={submit}><h1>Connexion</h1><p className="mute">Accédez à votre espace selon votre rôle.</p>
    {error && <div className="msg err" role="alert">{error}</div>}
    <F l="Adresse e-mail" t="email" p="prenom.nom@tekup.tn" v={email} set={setEmail} /><F l="Mot de passe" t="password" v={password} set={setPassword} />
    <div className="row" style={{ border: 0, padding: 0 }}><label style={{ flexDirection: 'row', gap: 8 }}><input type="checkbox" />Se souvenir de moi</label><Link to="/forgot" style={{ color: 'var(--cy)' }}>Mot de passe oublié ?</Link></div>
    <button className="btn pri" style={{ justifyContent: 'center' }} disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
    <p className="mute" style={{ textAlign: 'center' }}>Pas de compte ? <Link to="/register" style={{ color: 'var(--cy)' }}>Créer un compte</Link></p></form>)
}

export function Register() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<RoleCode>('ENERGY_MANAGER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.')
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.')
    setLoading(true)
    try {
      const res = await register({ nom: nom.trim(), email: email.trim().toLowerCase(), password, role })
      setSuccess(res.message)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', padding: 50, maxWidth: 480, margin: 'auto' }}>
      <h1>Demande envoyée ✅</h1>
      <div className="msg ok">{success}</div>
      <p className="mute">Vous pourrez vous connecter dès que votre compte sera approuvé.</p>
      <Link to="/" className="btn pri" style={{ justifyContent: 'center' }}>Retour à la connexion</Link>
    </div>)

  return (
    <form onSubmit={submit}>
      <h1>Créer un compte</h1>
      <p className="mute">Votre inscription sera validée par un administrateur.</p>
      {error && <div className="msg err" role="alert">{error}</div>}
      <F l="Nom complet" v={nom} set={setNom} />
      <F l="Adresse e-mail" t="email" v={email} set={setEmail} />
      <F l="Mot de passe (8 caractères minimum)" t="password" v={password} set={setPassword} />
      <F l="Confirmer le mot de passe" t="password" v={confirm} set={setConfirm} />
      <label>Rôle souhaité
        <select className="input" value={role} onChange={e => setRole(e.target.value as RoleCode)}>
          <option value="ENERGY_MANAGER">Energy Manager</option>
          <option value="DATA_SCIENTIST">Data Scientist</option>
        </select>
      </label>
      <button className="btn pri" style={{ justifyContent: 'center' }} disabled={loading}>{loading ? 'Envoi en cours…' : 'Envoyer la demande'}</button>
      <Link to="/" className="mute" style={{ textAlign: 'center' }}>Retour à la connexion</Link>
    </form>)
}

export function Forgot() {
  return (<form onSubmit={e => e.preventDefault()}><h1>Mot de passe oublié</h1><p className="mute">Nous vous envoyons un lien de réinitialisation par e-mail.</p><F l="Adresse e-mail" t="email" />
    <button className="btn pri" style={{ justifyContent: 'center' }}>Envoyer le lien</button><Link to="/" className="mute" style={{ textAlign: 'center' }}>Retour à la connexion</Link></form>)
}