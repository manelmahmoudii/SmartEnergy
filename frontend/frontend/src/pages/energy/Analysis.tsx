import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid } from 'recharts'
import { Card,PageHeader,axis,tip } from '../../components/ui'
import { months } from '../../data/mock'
export default function Analysis(){return(<><PageHeader t="Analyse énergétique" s="Tendances et historique par période et par bâtiment" a={<><select className="input"><option>Année 2026</option><option>Année 2025</option></select><select className="input"><option>Tous les bâtiments</option></select></>}/>
<Card t="Consommation mensuelle (kWh)"><ResponsiveContainer height={320}><BarChart data={months}><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b7bff"/><stop offset="1" stopColor="#38b6ff"/></linearGradient></defs><CartesianGrid stroke="var(--bd)" vertical={false}/><XAxis dataKey="m" {...axis}/><YAxis {...axis}/><Tooltip {...tip}/><Bar dataKey="kwh" fill="url(#b)" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></Card></>)}
