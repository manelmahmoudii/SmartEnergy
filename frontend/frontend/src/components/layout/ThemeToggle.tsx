import { Sun,Moon } from 'lucide-react'
import { useTheme } from './useTheme'
export default function ThemeToggle({cls=''}:{cls?:string}){const {theme,toggle}=useTheme();return <button className={'ico '+cls} onClick={toggle} aria-label={theme==='dark'?'Passer en thème clair':'Passer en thème sombre'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button>}
