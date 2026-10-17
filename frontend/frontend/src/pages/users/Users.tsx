import { Plus,Download } from 'lucide-react'
import { Card,PageHeader,Badge } from '../../components/ui'
import { users } from '../../data/mock'
export default function Users(){return(<><PageHeader t="Utilisateurs" s="Validez les inscriptions et gérez les rôles" a={<><button className="btn"><Download size={16}/>Exporter</button><button className="btn pri"><Plus size={16}/>Ajouter</button></>}/>
<Card><input className="input" placeholder="Rechercher un utilisateur…" style={{marginBottom:12,width:280}}/><table><thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Statut</th><th/></tr></thead><tbody>
{users.map(u=><tr key={u.email}><td><b>{u.nom}</b></td><td>{u.email}</td><td>{u.role}</td><td><Badge t={u.statut}/></td><td>{u.statut==='En attente'?<><button className="btn pri">Valider</button> <button className="btn">Rejeter</button></>:<><button className="btn">Modifier</button> <button className="btn">Bannir</button></>}</td></tr>)}</tbody></table></Card></>)}
