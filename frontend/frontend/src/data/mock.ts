import { Building, AppUser } from '../types'
export const hours=Array.from({length:24},(_,h)=>({h:`${h}h`,reel:Math.round(60+35*Math.sin((h-6)/3.8)+(h>17&&h<21?25:0)),prevu:Math.round(62+33*Math.sin((h-6)/3.8)+(h>17&&h<21?22:0))}))
export const months=['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'].map((m,i)=>({m,kwh:Math.round(42000+9000*Math.cos((i-6)/1.9))}))
export const buildings:Building[]=[
{id:1,nom:'Bloc A – Administration',type:'Bureaux',surface:3200,kwh:48210,statut:'Actif',score:82},
{id:2,nom:'Bloc B – Amphithéâtres',type:'Enseignement',surface:4100,kwh:61890,statut:'Actif',score:64},
{id:3,nom:'Bibliothèque',type:'Public',surface:2300,kwh:27440,statut:'Actif',score:91},
{id:4,nom:'Data Center',type:'Technique',surface:600,kwh:72300,statut:'Maintenance',score:58}]
export const users:AppUser[]=[
{nom:'Ines Agrebi',email:'ines.agrebi@tekup.tn',role:'Administrateur',statut:'Approuvé'},
{nom:'Nour Ben Salem',email:'nour.bensalem@tekup.tn',role:'Data Scientist',statut:'Approuvé'},
{nom:'Eya Karoui',email:'eya.karoui@tekup.tn',role:'Energy Manager',statut:'Approuvé'},
{nom:'Manel Mahmoudi',email:'manel.m@tekup.tn',role:'Energy Manager',statut:'En attente'},
{nom:'Nawres Mettichi',email:'nawres.m@tekup.tn',role:'Data Scientist',statut:'Banni'}]
export const anomalies=[
{date:'14 oct. 02:15',bat:'Data Center',kw:312,att:221,sev:'Critique'},
{date:'13 oct. 22:40',bat:'Bloc B',kw:198,att:96,sev:'Élevée'},
{date:'12 oct. 03:05',bat:'Bloc A',kw:121,att:74,sev:'Moyenne'}]
export const shap:[string,number][]=[['Température extérieure',.42],['Heure de la journée',.31],['Jour ouvré',.18],['Occupation',.12],['Consommation J-1',.09]]
export const scenarios=[
{nom:'Décalage de la climatisation (−1 h)',gain:8.4,eco:5200,effort:'Faible'},
{nom:'Éclairage LED et détecteurs',gain:12.1,eco:7400,effort:'Moyen'},
{nom:'Écrêtage des pics 18h–21h',gain:6.7,eco:4100,effort:'Faible'}]
export const models:[string,number,number,string][]=[['XGBoost',.94,3.1,'Production'],['LightGBM',.93,3.4,'Candidat'],['Random Forest',.89,4.6,'Archivé']]
export const peaks:[string,string,number,string][]=[['Demain 19h','Bloc B',342,'Élevé'],['Demain 12h','Data Center',301,'Moyen'],['Jeudi 18h','Bloc A',188,'Faible']]
