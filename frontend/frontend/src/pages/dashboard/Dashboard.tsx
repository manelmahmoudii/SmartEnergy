import { AreaChart,Area,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,CartesianGrid } from 'recharts'
import { Zap,Wallet,Flame,AlertTriangle,ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card,Kpi,Badge,axis,tip } from '../../components/ui'
import { hours,buildings,anomalies } from '../../data/mock'
const col=['#38b6ff','#8b7bff','#ffb547','#2de3a6']
export default function Dashboard(){return(<>
<div className="banner"><div style={{position:'relative',zIndex:1}}><h1>Bonjour Manel 👋</h1><p>Votre consommation baisse de 3,2 % ce mois-ci. Un pic de 342 kW est prévu demain à 19h au Bloc B : anticipez-le dès maintenant.</p><Link to="/scenarios" className="btn">Simuler une solution <ArrowRight size={16}/></Link></div>
<div style={{display:'flex',gap:14,position:'relative',zIndex:1}}><div className="stat"><b>−3,2 %</b>vs septembre</div><div className="stat"><b>94 %</b>précision IA</div></div></div>
<div className="grid g4 mt"><Kpi icon={<Zap/>} color="#38b6ff" l="Consommation du mois" v="209 840 kWh" d="−3,2 %" spark={[8,6,7,5,6,4,3]}/>
<Kpi icon={<Wallet/>} color="#2de3a6" l="Coût estimé" v="31 480 TND" d="−2,1 %" spark={[5,6,5,4,4,3,3]}/><Kpi icon={<Flame/>} color="#ffb547" l="Pic prévu demain" v="342 kW" d="19h · risque élevé" bad spark={[2,3,4,3,6,7,9]}/>
<Kpi icon={<AlertTriangle/>} color="#ff5d7a" l="Anomalies ouvertes" v="3" d="1 critique" bad spark={[1,1,2,1,2,3,3]}/></div>
<div className="grid g2 mt"><Card t="Réel vs prévision – 24 h (kW)"><ResponsiveContainer height={300}><AreaChart data={hours}><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b7bff" stopOpacity=".55"/><stop offset="1" stopColor="#38b6ff" stopOpacity="0"/></linearGradient></defs>
<CartesianGrid stroke="var(--bd)" vertical={false}/><XAxis dataKey="h" {...axis} interval={2}/><YAxis {...axis}/><Tooltip {...tip}/><Area dataKey="prevu" name="Prévu" stroke="#ffb547" fill="none" strokeDasharray="5 4" strokeWidth={2.5}/><Area dataKey="reel" name="Réel" stroke="#8b7bff" fill="url(#a)" strokeWidth={3}/></AreaChart></ResponsiveContainer></Card>
<Card t="Risque de pic · demain"><div className="gauge"><div><b style={{fontSize:32,fontFamily:'Sora'}}>72 %</b><span className="mute">risque élevé</span></div></div><p className="mute" style={{textAlign:'center',marginTop:10}}>Pic attendu à 19h au Bloc B</p></Card></div>
<div className="grid g2 mt"><Card t="Anomalies récentes">{anomalies.map(a=><div className="row" key={a.date}><div><b>{a.bat}</b><div className="mute" style={{fontSize:12}}>{a.date} · {a.kw} kW mesurés</div></div><Badge t={a.sev}/></div>)}</Card>
<Card t="Répartition par bâtiment"><ResponsiveContainer height={210}><PieChart><Pie data={buildings} dataKey="kwh" nameKey="nom" innerRadius={56} outerRadius={86} paddingAngle={3} stroke="none">{buildings.map((_,i)=><Cell key={i} fill={col[i]}/>)}</Pie><Tooltip {...tip}/></PieChart></ResponsiveContainer></Card></div></>)}
