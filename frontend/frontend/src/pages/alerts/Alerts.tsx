import { PageHeader } from '../../components/ui'
export default function Alerts(){return(<><PageHeader t="Alertes" s="Pics et anomalies nécessitant votre attention"/>
{[['Pic probable demain à 19h – Bloc B (342 kW)','#ffb547'],['Anomalie critique – Data Center : 312 kW contre 221 kW attendus','#ff5d7a'],['Consommation nocturne élevée – Bloc A','#ffb547']].map(a=><div className="alert" key={a[0]} style={{borderLeft:`4px solid ${a[1]}`}}><b>{a[0]}</b></div>)}</>)}
