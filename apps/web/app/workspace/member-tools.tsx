'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';

type Session={id:string;group_id:string;title:string;evidence_required:boolean;evidence_types:string[];evidence_deadline:string|null};
type Student={user_id:string;group_id:string;name:string};
type Absence={student_id:string;session_id:string;student_name:string;session_title:string;starts_at:string};
type Journey={attendance:Array<{status:string;source:string;updated_at:string;title:string}>;submissions:Array<{type:string;reference:string;status:string;submitted_at:string;title:string}>;certifications:Array<{title:string;provider:string;completed_on:string;reference:string;status:string}>};

async function post(url:string,body:unknown){
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||'The request could not be completed');
  return result;
}

export function StudentTools({sessions}:{sessions:Session[]}){
  const[message,setMessage]=useState('');
  const[journey,setJourney]=useState<Journey|null>(null);
  const[selected,setSelected]=useState('');
  const eligible=sessions.filter(s=>s.evidence_required);
  const session=eligible.find(s=>s.id===selected);
  const load=()=>fetch('/api/journey',{cache:'no-store'}).then(r=>r.json()).then(setJourney).catch(()=>{});
  useEffect(()=>{void load()},[]);
  async function submit(kind:string,event:FormEvent<HTMLFormElement>){
    event.preventDefault();setMessage('');const form=new FormData(event.currentTarget);
    try{
      if(kind==='evidence')await post('/api/submissions',{sessionId:form.get('sessionId'),type:form.get('type'),reference:form.get('reference')});
      else await post('/api/certifications',{title:form.get('title'),provider:form.get('provider'),completedOn:form.get('completedOn'),reference:form.get('reference')});
      setMessage('Added to your journey.');event.currentTarget.reset();setSelected('');load();
    }catch(error){setMessage((error as Error).message)}
  }
  return <section className="workspace-section">
    <div className="workspace-section-title"><p className="eyebrow">MY JOURNEY</p><h2>Turn your work into evidence.</h2></div>
    <div className="tool-grid student-tools">
      <details><summary>Submit workshop evidence</summary><form onSubmit={e=>submit('evidence',e)}>
        <label>Session<select name="sessionId" value={selected} onChange={e=>setSelected(e.target.value)} required><option value="">Choose session</option>{eligible.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
        <label>Evidence type<select name="type" required><option value="">Choose type</option>{session?.evidence_types.map(type=><option key={type}>{type}</option>)}</select></label>
        <label>Link or response<textarea name="reference" required/></label>
        {session?.evidence_deadline&&<p>Due {new Date(session.evidence_deadline).toLocaleString('en-IN')}</p>}
        <button>Submit evidence</button>
      </form></details>
      <details><summary>Add certification</summary><form onSubmit={e=>submit('certification',e)}>
        <label>Certification<input name="title" required/></label><label>Provider<input name="provider" required/></label>
        <label>Completed on<input name="completedOn" type="date" required/></label><label>Certificate link<input name="reference" type="url" required/></label>
        <button>Add certification</button>
      </form></details>
    </div>
    <p className="form-message" role="status" aria-live="polite">{message}</p>
    {journey&&<div className="journey-summary">
      <article><strong>{journey.attendance.length}</strong><span>attendance records</span></article>
      <article><strong>{journey.submissions.length}</strong><span>workshop submissions</span></article>
      <article><strong>{journey.certifications.length}</strong><span>certifications</span></article>
    </div>}
  </section>
}

export function AttendanceTools({role,sessions,students,absences}:{role:string;sessions:Session[];students:Student[];absences:Absence[]}){
  const[message,setMessage]=useState('');
  const[selectedSession,setSelectedSession]=useState('');
  const availableStudents=useMemo(()=>{const group=sessions.find(s=>s.id===selectedSession)?.group_id;return students.filter(s=>s.group_id===group)},[selectedSession,sessions,students]);
  async function manual(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);try{await post('/api/attendance/manual',{studentId:form.get('studentId'),sessionId:form.get('sessionId'),reason:form.get('reason')});setMessage('Attendance recorded with an audit trail.');event.currentTarget.reset();setSelectedSession('')}catch(error){setMessage((error as Error).message)}}
  async function confirm(absence:Absence){const reason=window.prompt('Reason for confirming this absence');if(!reason)return;try{await post('/api/attendance/confirm-absence',{studentId:absence.student_id,sessionId:absence.session_id,reason});setMessage('Absence confirmed.');setTimeout(()=>location.reload(),500)}catch(error){setMessage((error as Error).message)}}
  if(role==='college_coordinator')return <section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">ATTENDANCE REVIEW</p><h2>Confirm only the exceptions.</h2></div>{absences.length?<div className="data-list">{absences.map(a=><article key={a.student_id+a.session_id}><time>{new Date(a.starts_at).toLocaleDateString('en-IN')}</time><div><h3>{a.student_name}</h3><p>{a.session_title} · Unconfirmed absence</p><button className="text-button" onClick={()=>confirm(a)}>Confirm absence ↗</button></div></article>)}</div>:<p className="empty-copy">No attendance exceptions need confirmation.</p>}<p className="form-message">{message}</p></section>;
  return <section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">ATTENDANCE</p><h2>Resolve a special case.</h2></div><div className="tool-grid single-tool"><details><summary>Record manual attendance</summary><form onSubmit={manual}>
    <label>Session<select name="sessionId" value={selectedSession} onChange={e=>setSelectedSession(e.target.value)} required><option value="">Choose session</option>{sessions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
    <label>Student<select name="studentId" required><option value="">Choose student</option>{availableStudents.map(s=><option key={s.user_id} value={s.user_id}>{s.name}</option>)}</select></label>
    <label>Reason<textarea name="reason" required/></label><button>Record attendance</button>
  </form></details></div><p className="form-message">{message}</p></section>
}
