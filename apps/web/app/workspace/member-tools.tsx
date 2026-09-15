'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';

type Session={id:string;group_id:string;title:string;evidence_required:boolean;evidence_types:string[];evidence_deadline:string|null};
type Student={user_id:string;group_id:string;name:string};
type Absence={student_id:string;session_id:string;student_name:string;session_title:string;starts_at:string};
type Journey={student:{course:string|null;department:string|null;academic_year:string|null;github_url:string|null;linkedin_url:string|null};attendance:Array<{status:string;source:string;updated_at:string;title:string}>;submissions:Array<{type:string;reference:string;status:string;submitted_at:string;title:string}>;certifications:Array<{title:string;provider:string;completed_on:string;reference:string;status:string}>;tools:Array<{tool:string;reflection:string;created_at:string}>};
type Submission={id:string;type:string;reference:string;status:string;submitted_at:string;student_name:string;session_title:string};

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
    event.preventDefault();setMessage('');const target=event.currentTarget;const form=new FormData(target);
    try{
      if(kind==='evidence')await post('/api/submissions',{sessionId:form.get('sessionId'),type:form.get('type'),reference:form.get('reference')});
      else if(kind==='certification')await post('/api/certifications',{title:form.get('title'),provider:form.get('provider'),completedOn:form.get('completedOn'),reference:form.get('reference')});
      else if(kind==='tool')await post('/api/tools',{tool:form.get('tool'),reflection:form.get('reflection')});
      setMessage('Added to your journey.');target.reset();setSelected('');load();
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
      <details><summary>Add tool reflection</summary><form onSubmit={e=>submit('tool',e)}><label>Tool<input name="tool" required/></label><label>What can you do with it?<textarea name="reflection" minLength={10} required/></label><button>Add reflection</button></form></details>
      {journey&&<details><summary>Update profile</summary><form onSubmit={async e=>{e.preventDefault();setMessage('');const form=new FormData(e.currentTarget);const value=(name:string)=>String(form.get(name)||'').trim()||null;try{await fetch('/api/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({course:value('course'),department:value('department'),academicYear:value('academicYear'),githubUrl:value('githubUrl'),linkedinUrl:value('linkedinUrl')})}).then(async r=>{const body=await r.json();if(!r.ok)throw new Error(body.error)});setMessage('Profile updated.');load()}catch(error){setMessage((error as Error).message)}}}><label>Course<input name="course" defaultValue={journey.student.course||''}/></label><label>Department<input name="department" defaultValue={journey.student.department||''}/></label><label>Academic year<input name="academicYear" defaultValue={journey.student.academic_year||''}/></label><label>GitHub URL<input name="githubUrl" type="url" defaultValue={journey.student.github_url||''}/></label><label>LinkedIn URL<input name="linkedinUrl" type="url" defaultValue={journey.student.linkedin_url||''}/></label><button>Update profile</button></form></details>}
    </div>
    <p className="form-message" role="status" aria-live="polite">{message}</p>
    {journey&&<div className="journey-summary">
      <article><strong>{journey.attendance.length}</strong><span>attendance records</span></article>
      <article><strong>{journey.submissions.length}</strong><span>workshop submissions</span></article>
      <article><strong>{journey.certifications.length}</strong><span>certifications</span></article>
      <article><strong>{journey.tools.length}</strong><span>tool reflections</span></article>
    </div>}
  </section>
}

export function ReviewTools({submissions}:{submissions:Submission[]}){const[message,setMessage]=useState('');const linked=new Set(['GitHub Repository','Project URL','External Assessment','Document','Image','Video']);async function review(submission:Submission,status:'Reviewed'|'Resubmission Requested'){const reason=window.prompt(status==='Reviewed'?'Review note':'Explain what should be resubmitted');if(!reason)return;try{await post('/api/submissions/review',{submissionId:submission.id,status,reason});setMessage('Review recorded with an audit trail.');setTimeout(()=>location.reload(),500)}catch(error){setMessage((error as Error).message)}}return <section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">EVIDENCE REVIEW</p><h2>Respond to the work.</h2></div>{submissions.length?<div className="review-list">{submissions.map(s=><article key={s.id}><div><p className="eyebrow">{s.status}</p><h3>{s.student_name}</h3><p>{s.session_title} · {s.type}</p>{linked.has(s.type)?<a href={s.reference} target="_blank" rel="noreferrer">Open evidence ↗</a>:<blockquote>{s.reference}</blockquote>}</div><div className="review-actions"><button onClick={()=>review(s,'Reviewed')}>Mark reviewed</button><button onClick={()=>review(s,'Resubmission Requested')}>Request resubmission</button></div></article>)}</div>:<p className="empty-copy">No submissions are waiting for review.</p>}<p className="form-message">{message}</p></section>}

export function AttendanceTools({role,sessions,students,absences}:{role:string;sessions:Session[];students:Student[];absences:Absence[]}){
  const[message,setMessage]=useState('');
  const[selectedSession,setSelectedSession]=useState('');
  const[method,setMethod]=useState('QR');
  const[qr,setQr]=useState<{url:string;qr:string}|null>(null);
  const availableStudents=useMemo(()=>{const group=sessions.find(s=>s.id===selectedSession)?.group_id;return students.filter(s=>s.group_id===group)},[selectedSession,sessions,students]);
  async function manual(event:FormEvent<HTMLFormElement>){event.preventDefault();const target=event.currentTarget;const form=new FormData(target);try{await post('/api/attendance/manual',{studentId:form.get('studentId'),sessionId:form.get('sessionId'),reason:form.get('reason')});setMessage('Attendance recorded with an audit trail.');target.reset();setSelectedSession('')}catch(error){setMessage((error as Error).message)}}
  async function openWindow(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);try{const geo=method==='QR + Geofence';const result=await post('/api/attendance/windows',{sessionId:form.get('sessionId'),eventType:form.get('eventType'),method,opensAt:new Date(String(form.get('opensAt'))).toISOString(),closesAt:new Date(String(form.get('closesAt'))).toISOString(),latitude:geo?Number(form.get('latitude')):null,longitude:geo?Number(form.get('longitude')):null,radiusMeters:geo?Number(form.get('radiusMeters')):null,reason:form.get('reason')});setQr(result);setMessage('Attendance window created. Display this QR during the session.')}catch(error){setMessage((error as Error).message)}}
  async function confirm(absence:Absence){const reason=window.prompt('Reason for confirming this absence');if(!reason)return;try{await post('/api/attendance/confirm-absence',{studentId:absence.student_id,sessionId:absence.session_id,reason});setMessage('Absence confirmed.');setTimeout(()=>location.reload(),500)}catch(error){setMessage((error as Error).message)}}
  if(role==='college_coordinator')return <section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">ATTENDANCE REVIEW</p><h2>Confirm only the exceptions.</h2></div>{absences.length?<div className="data-list">{absences.map(a=><article key={a.student_id+a.session_id}><time>{new Date(a.starts_at).toLocaleDateString('en-IN')}</time><div><h3>{a.student_name}</h3><p>{a.session_title} · Unconfirmed absence</p><button className="text-button" onClick={()=>confirm(a)}>Confirm absence ↗</button></div></article>)}</div>:<p className="empty-copy">No attendance exceptions need confirmation.</p>}<p className="form-message">{message}</p></section>;
  return <section className="workspace-section"><div className="workspace-section-title"><p className="eyebrow">ATTENDANCE</p><h2>Open a window or resolve a special case.</h2></div><div className="tool-grid student-tools"><details><summary>Open attendance window</summary><form onSubmit={openWindow}>
    <label>Session<select name="sessionId" required><option value="">Choose session</option>{sessions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
    <label>Event<select name="eventType"><option>Check In</option><option>Check Out</option></select></label>
    <label>Method<select name="method" value={method} onChange={e=>setMethod(e.target.value)}><option>QR</option><option>QR + Geofence</option></select></label>
    <label>Opens<input name="opensAt" type="datetime-local" required/></label><label>Closes<input name="closesAt" type="datetime-local" required/></label>
    {method==='QR + Geofence'&&<><label>Latitude<input name="latitude" type="number" step="any" min="-90" max="90" required/></label><label>Longitude<input name="longitude" type="number" step="any" min="-180" max="180" required/></label><label>Radius in metres<input name="radiusMeters" type="number" min="1" required/></label></>}
    <label>Reason<textarea name="reason" required/></label><button>Create attendance QR</button>
  </form></details><details><summary>Record manual attendance</summary><form onSubmit={manual}>
    <label>Session<select name="sessionId" value={selectedSession} onChange={e=>setSelectedSession(e.target.value)} required><option value="">Choose session</option>{sessions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
    <label>Student<select name="studentId" required><option value="">Choose student</option>{availableStudents.map(s=><option key={s.user_id} value={s.user_id}>{s.name}</option>)}</select></label>
    <label>Reason<textarea name="reason" required/></label><button>Record attendance</button>
  </form></details></div>{qr&&<div className="attendance-qr"><img src={qr.qr} alt="Attendance QR code"/><div><p className="eyebrow">READY TO DISPLAY</p><h3>Students scan this code.</h3><a href={qr.url} target="_blank" rel="noreferrer">Open attendance link ↗</a></div></div>}<p className="form-message">{message}</p></section>
}
