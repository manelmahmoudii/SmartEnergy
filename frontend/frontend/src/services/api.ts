import axios from 'axios'
// Backend Spring Boot (JWT) et service IA FastAPI : à brancher
export const api=axios.create({baseURL:'http://localhost:8080/api'})
api.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization=`Bearer ${t}`;return c})
export const ai=axios.create({baseURL:'http://localhost:8000'})
