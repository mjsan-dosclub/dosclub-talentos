import Link from 'next/link';
import {OwnerSetupForm} from './setup-form';

export default async function SetupOwner({searchParams}:{searchParams:Promise<{token?:string}>}){
  const {token=''}=await searchParams;
  return <main className="access-layout"><section className="access-intro"><Link className="eyebrow" href="/">← DOS CLUB TALENTOS</Link><p className="eyebrow">OWNER SETUP</p><h1>Make it<br/><em>yours.</em></h1><p>Create the first private super-admin account. This setup link stops working after the account is created.</p></section><OwnerSetupForm token={token}/></main>;
}
