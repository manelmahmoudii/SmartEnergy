import { Routes,Route } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import AppLayout from '../layouts/AppLayout'
import { Login,Register,Forgot } from '../pages/auth/Auth'
import Dashboard from '../pages/dashboard/Dashboard'
import Buildings from '../pages/buildings/Buildings'
import Users from '../pages/users/Users'
import { ImportData,Preprocessing } from '../pages/data/DataPages'
import Analysis from '../pages/energy/Analysis'
import * as AI from '../pages/ai/AiPages'
import { Scenarios,Recommendations } from '../pages/optimization/Optimization'
import Alerts from '../pages/alerts/Alerts'
import Profile from '../pages/profile/Profile'
export default function AppRoutes(){return(<Routes>
<Route element={<AuthLayout/>}><Route path="/" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/forgot" element={<Forgot/>}/></Route>
<Route element={<AppLayout/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/analysis" element={<Analysis/>}/><Route path="/alerts" element={<Alerts/>}/>
<Route path="/forecast" element={<AI.Forecast/>}/><Route path="/peaks" element={<AI.Peaks/>}/><Route path="/anomalies" element={<AI.Anomalies/>}/><Route path="/models" element={<AI.Models/>}/>
<Route path="/scenarios" element={<Scenarios/>}/><Route path="/recommendations" element={<Recommendations/>}/>
<Route path="/import" element={<ImportData/>}/><Route path="/preprocessing" element={<Preprocessing/>}/>
<Route path="/buildings" element={<Buildings/>}/><Route path="/users" element={<Users/>}/><Route path="/profile" element={<Profile/>}/></Route></Routes>)}
