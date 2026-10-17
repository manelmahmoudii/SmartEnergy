import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
export default function AppLayout(){return <div className="app"><Sidebar/><main className="main"><Topbar/><Outlet/></main></div>}
