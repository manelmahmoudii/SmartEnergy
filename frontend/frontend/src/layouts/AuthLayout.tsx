import { Outlet } from 'react-router-dom'
import { Zap } from 'lucide-react'
import ThemeToggle from '../components/layout/ThemeToggle'
export default function AuthLayout(){return(<div className="auth"><div className="art"><div className="logo"><i><Zap size={18}/></i>Smart Energy</div>
<div><h1>Prévoyez. Détectez. Économisez.</h1><p>Suivez la consommation de vos bâtiments, anticipez les pics et comprenez chaque anomalie grâce à l’IA.</p></div>
<small className="mute">TEK-UP University · 2026–2027</small><div className="orb"/><div className="float" style={{right:70,top:150}}><span>Consommation prévue</span><b>342 kW</b><span style={{color:"#ffd27a"}}>Pic à 19h</span></div><div className="float" style={{right:200,bottom:130}}><span>Anomalie détectée</span><b>Data Center</b><span style={{color:"#8affd4"}}>Expliquée par SHAP</span></div></div><ThemeToggle cls="themeab"/><Outlet/></div>)}
