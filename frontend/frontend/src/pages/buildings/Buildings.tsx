import { Plus,Pencil,Trash2 } from 'lucide-react'
import { Card,PageHeader,Badge } from '../../components/ui'
import { buildings } from '../../data/mock'
export default function Buildings(){return(<><PageHeader t="Bâtiments" s="Organisez les données énergétiques par bâtiment" a={<button className="btn pri"><Plus size={16}/>Ajouter un bâtiment</button>}/>
<Card><table><thead><tr><th>Nom</th><th>Type</th><th>Surface</th><th>Conso. mensuelle</th><th>Efficacité</th><th>Statut</th><th/></tr></thead><tbody>
{buildings.map(b=><tr key={b.id}><td><b>{b.nom}</b></td><td>{b.type}</td><td>{b.surface} m²</td><td>{b.kwh.toLocaleString('fr')} kWh</td><td style={{width:150}}>{b.score}/100<div className="bar"><i style={{width:b.score+'%'}}/></div></td><td><Badge t={b.statut}/></td><td><button className="btn"><Pencil size={14}/></button> <button className="btn"><Trash2 size={14}/></button></td></tr>)}</tbody></table></Card></>)}
