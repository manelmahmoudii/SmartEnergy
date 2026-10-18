import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Building2, Users, LineChart, AlertTriangle, Sparkles, Bell, LogOut, Zap, Cpu, UserCircle, UploadCloud, Wand2, BarChart3, Flame, Lightbulb } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { canAccess } from '../../utils/access'
const G = [['Vue générale', [['/dashboard', LayoutDashboard, 'Tableau de bord'], ['/analysis', BarChart3, 'Analyse énergétique'], ['/alerts', Bell, 'Alertes']]],
['Intelligence artificielle', [['/forecast', LineChart, 'Prévisions'], ['/peaks', Flame, 'Pics de consommation'], ['/anomalies', AlertTriangle, 'Anomalies et SHAP'], ['/models', Cpu, 'Modèles IA']]],
['Optimisation', [['/scenarios', Sparkles, 'Scénarios'], ['/recommendations', Lightbulb, 'Recommandations']]],
['Données', [['/import', UploadCloud, 'Importer les données'], ['/preprocessing', Wand2, 'Préparation']]],
['Administration', [['/buildings', Building2, 'Bâtiments'], ['/users', Users, 'Utilisateurs'], ['/profile', UserCircle, 'Mon profil']]]] as any

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const go = useNavigate()
  return (<aside className="side"><div className="logo"><i><Zap size={18} /></i>Smart Energy</div>
  {G.map(([g, items]: any) => {
    const visible = items.filter(([to]: any) => canAccess(user?.role, to))
    if (!visible.length) return null
    return <div key={g}><div className="grp">{g}</div>
      {visible.map(([to, I, t]: any) =>
        <NavLink key={to} to={to} className={({ isActive }) => 'nav' + (isActive ? ' active' : '')}><I size={18} />{to === '/buildings' && user?.role === 'BATIMENT' ? 'Mes bâtiments' : t}</NavLink>)}</div>
  })}
  <div className="model"><b>Modèle actif · XGBoost</b><div className="mute">R² 0,94 · MAE 3,1 kW</div><div className="bar"><i style={{ width: '94%' }} /></div></div>
  <button className="nav" style={{ marginTop: 10 }} onClick={() => { signOut(); go('/') }}><LogOut size={18} />Déconnexion</button></aside>)
}