import { ReactNode } from 'react'
export const Card=({t,children,cls='',style}:{t?:string,children:ReactNode,cls?:string,style?:any})=><div className={'card '+cls} style={style}>{t&&<h2>{t}</h2>}{children}</div>
export const PageHeader=({t,s,a}:{t:string,s?:string,a?:ReactNode})=><div className="head"><div><h1>{t}</h1>{s&&<p>{s}</p>}</div>{a&&<div>{a}</div>}</div>
export const Spark=({d,color}:{d:number[],color:string})=>{const m=Math.max(...d),n=Math.min(...d);const pts=d.map((v,i)=>`${i*10},${28-((v-n)/(m-n||1))*24}`).join(' ');return <svg className="sp" width="70" height="30" viewBox="0 0 70 30"><polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
export const Kpi=({icon,l,v,d,bad,color='#38b6ff',spark}:{icon:ReactNode,l:string,v:string,d?:string,bad?:boolean,hero?:boolean,color?:string,spark?:number[]})=>
<div className="card kpi"><div className="ic" style={{background:color+'22',color}}>{icon}</div><div><small>{l}</small><b>{v}</b>{d&&<em className={bad?'up':'down'}>{d}</em>}</div>{spark&&<Spark d={spark} color={color}/>}</div>
const C:any={Approuvé:'ok',Actif:'ok',Production:'ok',Faible:'ok',Maintenance:'warn','En attente':'warn',Moyenne:'warn',Moyen:'warn',Candidat:'info',Archivé:'info',Banni:'bad',Critique:'bad',Élevée:'bad',Élevé:'bad'}
export const Badge=({t}:{t:string})=><span className={'bdg '+(C[t]||'info')}>{t}</span>
export const axis={stroke:'var(--bd)',tick:{fill:'var(--mute)',fontSize:11}}
export const tip={contentStyle:{background:'var(--solid)',border:'1px solid var(--bd)',borderRadius:14,color:'var(--tx)',boxShadow:'var(--shadow)'}}
