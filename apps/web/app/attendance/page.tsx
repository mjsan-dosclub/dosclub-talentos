import Link from 'next/link';
import {AttendanceScan} from './scan';
import '../workspace.css';

export default async function AttendancePage({searchParams}:{searchParams:Promise<{token?:string}>}){
  const {token=''}=await searchParams;
  return <main className="access-layout">
    <section className="access-intro"><Link className="brand" href="/"><span className="brand-symbol">d.</span><span>DOS CLUB<span className="brand-sub">TalentOS</span></span></Link><p className="eyebrow">SESSION ATTENDANCE</p><h1>Show up.<br/><em>Keep growing.</em></h1><p>Your attendance becomes part of your private learning journey.</p></section>
    <AttendanceScan token={token}/>
  </main>
}
