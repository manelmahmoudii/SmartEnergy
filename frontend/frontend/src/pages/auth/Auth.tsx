import { Link, useNavigate } from 'react-router-dom'
const F=({l,t='text',p}:{l:string,t?:string,p?:string})=><label>{l}<input className="input" type={t} placeholder={p} required/></label>
export function Login(){const go=useNavigate();return(<form onSubmit={e=>{e.preventDefault();go('/dashboard')}}><h1>Connexion</h1><p className="mute">Accédez à votre espace selon votre rôle.</p>
<F l="Adresse e-mail" t="email" p="prenom.nom@tekup.tn"/><F l="Mot de passe" t="password"/>
<div className="row" style={{border:0,padding:0}}><label style={{flexDirection:'row',gap:8}}><input type="checkbox"/>Se souvenir de moi</label><Link to="/forgot" style={{color:'var(--cy)'}}>Mot de passe oublié ?</Link></div>
<button className="btn pri" style={{justifyContent:'center'}}>Se connecter</button><p className="mute" style={{textAlign:'center'}}>Pas de compte ? <Link to="/register" style={{color:'var(--cy)'}}>Créer un compte</Link></p></form>)}
export function Register(){const go=useNavigate();return(<form onSubmit={e=>{e.preventDefault();go('/')}}><h1>Créer un compte</h1><p className="mute">Votre inscription sera validée par un administrateur.</p>
<F l="Nom complet"/><F l="Adresse e-mail" t="email"/><F l="Mot de passe" t="password"/>
<label>Rôle souhaité<select className="input"><option>Energy Manager</option><option>Data Scientist</option></select></label>
<button className="btn pri" style={{justifyContent:'center'}}>Envoyer la demande</button><Link to="/" className="mute" style={{textAlign:'center'}}>Retour à la connexion</Link></form>)}
export function Forgot(){return(<form onSubmit={e=>e.preventDefault()}><h1>Mot de passe oublié</h1><p className="mute">Nous vous envoyons un lien de réinitialisation par e-mail.</p><F l="Adresse e-mail" t="email"/>
<button className="btn pri" style={{justifyContent:'center'}}>Envoyer le lien</button><Link to="/" className="mute" style={{textAlign:'center'}}>Retour à la connexion</Link></form>)}
