'use client';

import Link from 'next/link';
import {FormEvent,useState} from 'react';

export function OwnerSetupForm({token}:{token:string}){
  const[busy,setBusy]=useState(false);const[message,setMessage]=useState('');const[done,setDone]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setMessage('');const data=new FormData(event.currentTarget);const password=String(data.get('password'));
    if(password!==String(data.get('confirm'))){setMessage('Passwords do not match.');setBusy(false);return;}
    const response=await fetch('/api/setup/owner',{method:'POST',headers:{'Content-Type':'application/json','x-setup-token':token},body:JSON.stringify({email:'descienceosclub@gmail.com',name:String(data.get('name')),password})});
    const body=await response.json().catch(()=>({}));if(response.ok)setDone(true);else setMessage(body.error||'The owner account could not be created.');setBusy(false);
  }
  if(!token)return <section className="access-form"><h3>Setup link missing</h3><p>Open the complete private owner setup link.</p></section>;
  if(done)return <section className="access-form"><h3>Owner account ready.</h3><p>Sign in with descienceosclub@gmail.com and the password you just created.</p><Link className="button" href="/access">Continue to sign in ↗</Link></section>;
  return <form className="access-form" onSubmit={submit}><div><label htmlFor="email">Email</label><input id="email" value="descienceosclub@gmail.com" disabled/></div><div><label htmlFor="name">Display name</label><input id="name" name="name" defaultValue="DOS Club Owner" minLength={2} maxLength={120} required/></div><div><label htmlFor="password">Create password</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></div><div><label htmlFor="confirm">Confirm password</label><input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></div><button className="button" disabled={busy}>{busy?'Creating owner…':'Create owner account'} <span aria-hidden="true">↗</span></button><p className="form-help">Use at least 12 characters. Keep this password private.</p><p className="form-message" role="status" aria-live="polite">{message}</p></form>;
}
