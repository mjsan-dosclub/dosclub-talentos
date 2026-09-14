'use client';

import {FormEvent,useState} from 'react';
import {authClient} from '../../lib/auth-client';

export function SignInForm({returnTo='/workspace'}:{returnTo?:string}){
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setMessage('');
    const data=new FormData(event.currentTarget);
    const result=await authClient.signIn.email({email:String(data.get('email')),password:String(data.get('password')),callbackURL:returnTo});
    if(result.error)setMessage(result.error.status===503?'Member access is being configured.':'Email or password was not recognised.');
    else window.location.assign(returnTo);
    setBusy(false);
  }
  return <form className="access-form" onSubmit={submit}><div><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required/></div><div><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" minLength={12} required/></div><button className="button" disabled={busy}>{busy?'Signing in…':'Sign in'} <span aria-hidden="true">↗</span></button><p className="form-help">Accounts are invitation-only. Contact your DOS organiser if you need access.</p><p className="form-message" role="status" aria-live="polite">{message}</p></form>
}
