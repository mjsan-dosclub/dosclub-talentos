import Link from 'next/link';
import {SignInForm} from './sign-in-form';

export default async function Access({searchParams}:{searchParams:Promise<{returnTo?:string}>}){
  const {returnTo='/workspace'}=await searchParams;
  const safeReturn=returnTo.startsWith('/')&&!returnTo.startsWith('//')?returnTo:'/workspace';
  return <main className="access-layout"><section className="access-intro"><Link className="eyebrow" href="/">← DOS CLUB TALENTOS</Link><p className="eyebrow">MEMBER ACCESS</p><h1>A place for<br/><em>your journey.</em></h1><p>Sign in with the email address from your DOS Club invitation.</p></section><SignInForm returnTo={safeReturn}/></main>
}
