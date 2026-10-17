export type Role='Administrateur'|'Data Scientist'|'Energy Manager'
export interface Building{id:number;nom:string;type:string;surface:number;kwh:number;statut:string;score:number}
export interface AppUser{nom:string;email:string;role:Role;statut:string}
