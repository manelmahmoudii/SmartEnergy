import { Search,Bell } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
export default function Topbar(){return(<div className="top"><div><div className="search"><Search size={16}/><input className="input" placeholder="Rechercher un bâtiment, une alerte…"/></div>
<select className="input" aria-label="Bâtiment"><option>Tous les bâtiments</option><option>Bloc A</option><option>Bloc B</option><option>Bibliothèque</option><option>Data Center</option></select></div>
<div><ThemeToggle/><button className="ico" aria-label="Alertes"><Bell size={18}/><b/></button><div style={{textAlign:'right'}}><b>Manel Mahmoudi</b><div className="mute" style={{fontSize:12}}>Energy Manager</div></div><div className="av">EK</div></div></div>)}
