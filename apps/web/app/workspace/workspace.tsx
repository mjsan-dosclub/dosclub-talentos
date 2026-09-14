'use client';

import {useEffect,useState} from 'react';
import {authClient} from '../../lib/auth-client';
import {AdminTools} from './admin-tools';
import {AttendanceTools,StudentTools} from './member-tools';

type Student={user_id:string;group_id:string;name:string;dos_id:string|null;group_name:string;institution:string};
type Session={id:string;group_id:string;title:string;mode:string;starts_at:string;institution:string;group_name:string;evidence_required:boolean;evidence_types:string[];evidence_deadline:string|null};
type Data={
  actor:{name:string;role:string};
  students:Student[];
  sessions:Session[];
  cohorts:Array<{id:string;name:string;batch:string;institution_id:string;institution:string;kind:string;capacity:number;enrolled:number}>;
  institutions:Array<{id:string;name:string;kind:string}>;
  trainers:Array<{id:string;name:string}>;
  attendance:Array<{student_id:string;session_id:string;student_name:string;session_title:string;starts_at:string}>;
};

export function Workspace(){
  const[data,setData]=useState<Data|null>(null);
  const[error,setError]=useState('');
  useEffect(()=>{fetch('/api/workspace',{cache:'no-store'}).then(async r=>{if(r.status===401){window.location.assign('/access');return}const body=await r.json();if(!r.ok)throw new Error(body.error);setData(body)}).catch(e=>setError(e.message))},[]);
  if(error)return <section className="workspace-empty"><p className="eyebrow">WORKSPACE UNAVAILABLE</p><h1>We couldn’t open<br/><em>your journey.</em></h1><p>{error}</p></section>;
  if(!data)return <p className="eyebrow">OPENING YOUR WORKSPACE…</p>;
  const operator=['organiser','super_admin'].includes(data.actor.role);
  const attendanceRole=['trainer','organiser','super_admin','college_coordinator'].includes(data.actor.role);
  return <>
    <section className="workspace-welcome"><div><p className="eyebrow">{data.actor.role.replaceAll('_',' ')}</p><h1>Hello, <em>{data.actor.name}.</em></h1><p>Your TalentOS view is limited to the people and sessions assigned to your role.</p></div><button className="text-button" onClick={async()=>{await authClient.signOut();location.assign('/')}}>Sign out ↗</button></section>
    {operator&&<AdminTools cohorts={data.cohorts} institutions={data.institutions} trainers={data.trainers} actorRole={data.actor.role}/>}
    {data.actor.role==='student'&&<StudentTools sessions={data.sessions}/>}
    {attendanceRole&&<AttendanceTools role={data.actor.role} sessions={data.sessions} students={data.students} absences={data.attendance}/>}
    {data.cohorts.length>0&&<section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">COHORTS</p><h2>Where learning happens.</h2></div><div className="data-grid">{data.cohorts.map(c=><article className="data-card" key={c.id}><p className="eyebrow">{c.kind} · {c.batch}</p><h3>{c.institution}</h3><p>{c.name}</p><div className="capacity"><span style={{width:`${Math.min(100,c.enrolled/c.capacity*100)}%`}}/><div>{c.enrolled} of {c.capacity} students</div></div></article>)}</div></section>}
    <section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">SESSIONS</p><h2>The work in motion.</h2></div>{data.sessions.length?<div className="data-list">{data.sessions.map(s=><article key={s.id}><time>{new Date(s.starts_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</time><div><h3>{s.title}</h3><p>{s.institution} · {s.group_name} · {s.mode}</p><small>{s.evidence_required?`Evidence due ${new Date(s.evidence_deadline!).toLocaleString('en-IN')}`:'No evidence required'}</small></div></article>)}</div>:<p className="empty-copy">No sessions are available in your scope yet.</p>}</section>
    <section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">STUDENTS</p><h2>Journeys in your care.</h2></div>{data.students.length?<div className="student-grid">{data.students.map(s=><article key={s.user_id}><span className="student-initial">{s.name.slice(0,1)}</span><div><h3>{s.name}</h3><p>{s.institution} · {s.group_name}</p><small>{s.dos_id||'DOS ID pending'}</small></div></article>)}</div>:<p className="empty-copy">No student profiles are available in your scope.</p>}</section>
  </>
}
