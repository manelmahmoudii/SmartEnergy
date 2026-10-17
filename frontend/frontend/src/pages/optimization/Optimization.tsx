import { Play } from 'lucide-react'
import { Card,PageHeader,Badge } from '../../components/ui'
import { scenarios } from '../../data/mock'
export const Scenarios=()=>(<><PageHeader t="Simulation de scénarios" s="Estimez l’effet de chaque stratégie. Aucun équipement n’est piloté." a={<button className="btn pri"><Play size={16}/>Lancer une simulation</button>}/>
<div className="grid g3">{scenarios.map(s=><Card key={s.nom}><h2>{s.nom}</h2><b style={{font:'700 34px Sora',color:'var(--ok)'}}>−{s.gain} %</b><div className="row"><span className="mute">Économie annuelle</span><b>{s.eco} TND</b></div><div className="row"><span className="mute">Effort</span><Badge t={s.effort}/></div></Card>)}</div></>)
export const Recommendations=()=>(<><PageHeader t="Recommandations" s="Basées sur vos analyses et vos simulations"/>
{[['Écrêter les pics 18h–21h','Gain rapide et effort faible. À lancer en premier.'],['Installer l’éclairage LED','Réduction cumulée d’environ −18 % avec l’écrêtage.'],['Inspecter le Data Center','Anomalie critique récurrente la nuit.']].map(r=><div className="alert" key={r[0]}><div><b>{r[0]}</b><p className="mute">{r[1]}</p></div></div>)}</>)
