import Link from 'next/link';
import { Workspace } from './workspace';
export default function WorkspacePage(){return <><header className="workspace-header"><Link className="brand" href="/"><span className="brand-symbol">d.</span><span>DOS CLUB<span className="brand-sub">TalentOS</span></span></Link><span className="eyebrow">PRIVATE WORKSPACE</span></header><main className="workspace-page"><Workspace/></main></>}
