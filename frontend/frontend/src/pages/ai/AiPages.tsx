import { LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,BarChart,Bar } from 'recharts'
import { Play } from 'lucide-react'
import { Card,PageHeader,Badge,axis,tip } from '../../components/ui'
import { hours,anomalies,shap,models,peaks } from '../../data/mock'
export const Forecast=()=>(<><PageHeader t="Prévisions de consommation" s="Prévision à 24 h comparée aux valeurs réelles"/>
<Card><ResponsiveContainer height={360}><LineChart data={hours}><CartesianGrid stroke="var(--bd)" vertical={false}/><XAxis dataKey="h" {...axis}/><YAxis {...axis}/><Tooltip {...tip}/><Line dataKey="reel" name="Réel" stroke="#38e0ff" strokeWidth={3} dot={false}/><Line dataKey="prevu" name="Prévu" stroke="#ffb547" strokeWidth={3} strokeDasharray="6 4" dot={false}/></LineChart></ResponsiveContainer></Card></>)
export const Peaks=()=>(<><PageHeader t="Pics de consommation" s="Périodes à risque des prochains jours"/>
<div className="grid g3">{peaks.map(p=><Card key={p[0]}><Badge t={p[3]}/><h2 style={{marginTop:12}}>{p[0]} · {p[1]}</h2><b style={{font:'700 34px Sora'}}>{p[2]} kW</b></Card>)}</div></>)
export const Anomalies=()=>(<><PageHeader t="Anomalies et explicabilité" s="Comprenez pourquoi une consommation est jugée inhabituelle"/>
<div className="grid g2"><Card t="Anomalies détectées"><table><thead><tr><th>Date</th><th>Bâtiment</th><th>Mesuré</th><th>Attendu</th><th>Gravité</th></tr></thead><tbody>{anomalies.map(a=><tr key={a.date}><td>{a.date}</td><td>{a.bat}</td><td><b>{a.kw} kW</b></td><td>{a.att} kW</td><td><Badge t={a.sev}/></td></tr>)}</tbody></table></Card>
<Card t="Facteurs d’influence (SHAP)">{shap.map(([n,v])=><div key={n} style={{marginBottom:14}}><div className="row" style={{border:0,padding:0}}><span>{n}</span><b>{v.toFixed(2)}</b></div><div className="bar"><i style={{width:v*220+'%'}}/></div></div>)}</Card></div></>)
export const Models=()=>(<><PageHeader t="Modèles d’IA" s="Entraînez, comparez et surveillez les modèles" a={<button className="btn pri"><Play size={16}/>Entraîner un modèle</button>}/>
<Card><table><thead><tr><th>Modèle</th><th>R²</th><th>MAE (kW)</th><th>Statut</th></tr></thead><tbody>{models.map(m=><tr key={m[0]}><td><b>{m[0]}</b></td><td>{m[1]}</td><td>{m[2]}</td><td><Badge t={m[3]}/></td></tr>)}</tbody></table></Card>
<Card t="Erreur moyenne par modèle" cls="mt"><ResponsiveContainer height={200}><BarChart data={models.map(m=>({n:m[0],mae:m[2]}))}><XAxis dataKey="n" {...axis}/><YAxis {...axis}/><Tooltip {...tip}/><Bar dataKey="mae" fill="#7c6cff" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></Card></>)
