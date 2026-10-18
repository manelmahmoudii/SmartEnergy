import { Search, Bell } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABEL } from '../../utils/labels'

export default function Topbar() {
  const { user } = useAuth()
  const initials = (user?.nom ?? '?').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
  return (<div className="top"><div><div className="search"><Search size={16} /><input className="input" placeholder="Rechercher un bâtiment, une alerte…" /></div>
    <select className="input" aria-label="Bâtiment"><option>Tous les bâtiments</option><option>Bloc A</option><option>Bloc B</option><option>Bibliothèque</option><option>Data Center</option></select></div>
    <div><ThemeToggle /><button className="ico" aria-label="Alertes"><Bell size={18} /><b /></button>
      <div style={{ textAlign: 'right' }}><b>{user?.nom}</b><div className="mute" style={{ fontSize: 12 }}>{user && ROLE_LABEL[user.role]}</div></div><div className="av">{initials}</div></div></div>)
}