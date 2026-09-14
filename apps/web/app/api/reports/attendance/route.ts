import {z} from 'zod';
import {actor,failure,HttpError,operator,sameOrigin} from '../../../../lib/access';
import {audit,database,transaction} from '../../../../lib/db';
import {sendEmail} from '../../../../lib/email';

const input=z.object({sessionId:z.string().uuid(),reason:z.string().trim().min(3).max(2000)});
const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]!));
export async function POST(request:Request){
  try{
    sameOrigin(request);const a=await actor();operator(a);
    const parsed=input.safeParse(await request.json());if(!parsed.success)throw new HttpError(400,'Choose a session and provide a reporting reason');
    const db=database();
    const session=(await db.query(`SELECT s.id,s.closed_at,w.title,i.id AS institution_id,i.name AS institution FROM sessions s JOIN workshops w ON w.id=s.workshop_id JOIN groups g ON g.id=s.group_id JOIN batches b ON b.id=g.batch_id JOIN institutions i ON i.id=b.institution_id WHERE s.id=$1`,[parsed.data.sessionId])).rows[0];
    if(!session)throw new HttpError(404,'Session not found');
    if(!session.closed_at)throw new HttpError(409,'Close the session before sending its attendance report');
    const recipients=(await db.query(`SELECT u.email FROM "user" u JOIN role_assignments r ON r.user_id=u.id WHERE r.role='college_coordinator' AND r.institution_id=$1 ORDER BY u.email`,[session.institution_id])).rows;
    if(!recipients.length)throw new HttpError(409,'No college coordinator account is assigned to this institution');
    const rows=(await db.query('SELECT status,count(*)::integer AS count FROM attendance WHERE session_id=$1 GROUP BY status ORDER BY status',[session.id])).rows;
    const total=rows.reduce((sum,row)=>sum+row.count,0);
    const list=rows.map(row=>`<li><strong>${escapeHtml(row.status)}</strong>: ${row.count}</li>`).join('');
    for(const recipient of recipients)await sendEmail({id:`attendance-report-${session.id}-${recipient.email}`,to:recipient.email,subject:`TalentOS attendance · ${session.title}`,html:`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#252b24"><h1 style="font-family:Georgia,serif;font-weight:normal">${escapeHtml(session.title)}</h1><p>${escapeHtml(session.institution)} attendance summary</p><p><strong>${total}</strong> student records</p><ul>${list}</ul><p>Sign in to TalentOS to review institution-scoped exceptions.</p></div>`});
    await transaction(async client=>audit(client,a,'attendance_report',session.id,null,{recipients:recipients.length,total,statuses:rows},parsed.data.reason));
    return Response.json({status:'sent',recipients:recipients.length,total});
  }catch(error){return failure(error)}
}
