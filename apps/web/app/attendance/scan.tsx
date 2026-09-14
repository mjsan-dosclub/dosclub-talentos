'use client';

import Link from 'next/link';
import {useState} from 'react';

export function AttendanceScan({token}:{token:string}){
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState('');
  const[done,setDone]=useState(false);
  async function record(){
    if(!token){setMessage('This attendance link is incomplete.');return}
    setBusy(true);setMessage('');
    const send=(position:{latitude:number;longitude:number}|null)=>fetch('/api/attendance/scan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,latitude:position?.latitude??null,longitude:position?.longitude??null})});
    let response=await send(null);
    let body=await response.json();
    if(response.status===400&&body.error==='Share your current location to use this attendance window'){
      try{
        const position=await new Promise<{latitude:number;longitude:number}>((resolve,reject)=>navigator.geolocation.getCurrentPosition(result=>resolve({latitude:result.coords.latitude,longitude:result.coords.longitude}),reject,{enableHighAccuracy:true,timeout:10000,maximumAge:0}));
        response=await send(position);body=await response.json();
      }catch{setMessage('Location permission is required for this session.');setBusy(false);return}
    }
    if(response.status===401){location.assign(`/access?returnTo=${encodeURIComponent(location.pathname+location.search)}`);return}
    if(response.ok){setDone(true);setMessage(`${body.status}. You can return to your workspace.`)}
    else setMessage(body.error||'Attendance could not be recorded.');
    setBusy(false);
  }
  return <section className="access-form"><h2>{done?'Attendance recorded':'Confirm your presence'}</h2><p className="form-help">TalentOS may request your location. It is used only when this session requires a geofence.</p><button className="button" onClick={record} disabled={busy||done}>{busy?'Checking…':done?'Complete':'Record attendance ↗'}</button><p className="form-message" role="status" aria-live="polite">{message}</p>{done&&<Link href="/workspace">Open my journey ↗</Link>}</section>
}
