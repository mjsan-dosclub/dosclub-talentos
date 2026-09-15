'use client';

import {FormEvent,useState} from 'react';

type Cohort={id:string;name:string;batch:string;institution_id:string;institution:string;kind:string;capacity:number;enrolled:number};
type Institution={id:string;name:string;kind:string};
type Trainer={id:string;name:string};
type Session={id:string;title:string;closed_at:string|null};

async function post(url:string,body:unknown){
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||'The request could not be completed');
  return result;
}

export function AdminTools({cohorts,institutions,trainers,sessions,actorRole}:{cohorts:Cohort[];institutions:Institution[];trainers:Trainer[];sessions:Session[];actorRole:string}){
  const[message,setMessage]=useState('');
  const[busy,setBusy]=useState('');
  const[inviteRole,setInviteRole]=useState('student');

  async function submit(kind:string,event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setBusy(kind);
    setMessage('');
    const target=event.currentTarget;
    const form=new FormData(target);
    try{
      if(kind==='cohort')await post('/api/cohorts',{institution:form.get('institution'),kind:form.get('kind'),batch:form.get('batch'),group:form.get('group'),capacity:Number(form.get('capacity')),reason:form.get('reason')});
      if(kind==='invite')await post('/api/invitations',{
        email:form.get('email'),name:form.get('name'),role:inviteRole,
        institutionId:inviteRole==='college_coordinator'?form.get('institutionId'):null,
        groupId:inviteRole==='student'?form.get('groupId'):null,
        expiresAt:new Date(String(form.get('expiresAt'))).toISOString(),reason:form.get('reason')
      });
      if(kind==='session'){
        const required=form.get('required')==='yes';
        await post('/api/sessions',{title:form.get('title'),objective:form.get('objective'),groupId:form.get('groupId'),trainerId:form.get('trainerId')||null,startsAt:new Date(String(form.get('startsAt'))).toISOString(),endsAt:new Date(String(form.get('endsAt'))).toISOString(),mode:form.get('mode'),venue:form.get('venue'),required,types:required?[form.get('evidenceType')]:[],deadline:required?new Date(String(form.get('deadline'))).toISOString():null,reason:form.get('reason')});
      }
      if(kind==='close')await post('/api/sessions/close',{sessionId:form.get('sessionId'),reason:form.get('reason')});
      if(kind==='report')await post('/api/reports/attendance',{sessionId:form.get('sessionId'),reason:form.get('reason')});
      setMessage(kind==='invite'?'Invitation sent.':'Saved successfully.');
      target.reset();
      if(kind!=='invite')setTimeout(()=>location.reload(),500);
    }catch(error){setMessage((error as Error).message)}
    finally{setBusy('')}
  }

  return <section className="workspace-section admin-tools">
    <div className="workspace-section-title"><p className="eyebrow">PROGRAMME TOOLS</p><h2>Prepare the next step.</h2></div>
    <div className="tool-grid">
      <details><summary>Create cohort</summary><form onSubmit={e=>submit('cohort',e)}>
        <label>Institution<input name="institution" required/></label>
        <label>Programme type<select name="kind"><option>B2B</option><option>B2C</option></select></label>
        <label>Batch<input name="batch" required/></label>
        <label>Group<input name="group" required/></label>
        <label>Capacity<input name="capacity" type="number" min="1" defaultValue="40" required/></label>
        <label>Reason<textarea name="reason" required/></label>
        <button disabled={Boolean(busy)}>Create cohort</button>
      </form></details>

      <details><summary>Schedule session</summary><form onSubmit={e=>submit('session',e)}>
        <label>Workshop title<input name="title" required/></label>
        <label>Learning objective<textarea name="objective" required/></label>
        <label>Group<select name="groupId" required><option value="">Choose group</option>{cohorts.map(c=><option key={c.id} value={c.id}>{c.institution} · {c.name}</option>)}</select></label>
        <label>Trainer<select name="trainerId"><option value="">Assign later</option>{trainers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
        <label>Starts<input name="startsAt" type="datetime-local" required/></label>
        <label>Ends<input name="endsAt" type="datetime-local" required/></label>
        <label>Mode<select name="mode"><option>Online</option><option>Offline</option><option>Hybrid</option></select></label>
        <label>Venue or meeting reference<input name="venue" required/></label>
        <label>Evidence required?<select name="required"><option value="no">No</option><option value="yes">Yes</option></select></label>
        <label>Evidence type<select name="evidenceType"><option>GitHub Repository</option><option>Project URL</option><option>Reflection</option><option>External Assessment</option></select></label>
        <label>Evidence deadline<input name="deadline" type="datetime-local"/></label>
        <label>Reason<textarea name="reason" required/></label>
        <button disabled={Boolean(busy)}>Schedule session</button>
      </form></details>

      <details><summary>Invite member</summary><form onSubmit={e=>submit('invite',e)}>
        <label>Role<select name="role" value={inviteRole} onChange={e=>setInviteRole(e.target.value)}>
          <option value="student">Student</option><option value="trainer">Trainer</option><option value="college_coordinator">College coordinator</option>
          {actorRole==='super_admin'&&<><option value="organiser">DOS organiser</option><option value="super_admin">Super admin</option></>}
        </select></label>
        <label>Name<input name="name" required/></label>
        <label>Email<input name="email" type="email" required/></label>
        {inviteRole==='student'&&<label>Group<select name="groupId" required><option value="">Choose group</option>{cohorts.filter(c=>c.enrolled<c.capacity).map(c=><option key={c.id} value={c.id}>{c.institution} · {c.name} · {c.capacity-c.enrolled} confirmed seats open</option>)}</select></label>}
        {inviteRole==='college_coordinator'&&<label>Institution<select name="institutionId" required><option value="">Choose institution</option>{institutions.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label>}
        <label>Invitation expires<input name="expiresAt" type="datetime-local" required/></label>
        <label>Reason<textarea name="reason" required/></label>
        {inviteRole==='student'&&<p>Invitations do not reserve capacity. The seat is confirmed when accepted.</p>}
        <button disabled={Boolean(busy)}>Send invitation</button>
      </form></details>
      <details><summary>Close session & report</summary><form onSubmit={e=>submit('close',e)}><label>Open session<select name="sessionId" required><option value="">Choose session</option>{sessions.filter(s=>!s.closed_at).map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label><label>Closure reason<textarea name="reason" required/></label><p>Closing creates unconfirmed absence records only for students without attendance.</p><button disabled={Boolean(busy)}>Close session</button></form><form onSubmit={e=>submit('report',e)}><label>Closed session<select name="sessionId" required><option value="">Choose session</option>{sessions.filter(s=>s.closed_at).map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label><label>Reporting reason<textarea name="reason" required/></label><p>Email a consolidated attendance summary to assigned college coordinators.</p><button disabled={Boolean(busy)}>Email report</button></form></details>
    </div>
    <p className="form-message" role="status" aria-live="polite">{message}</p>
  </section>
}
