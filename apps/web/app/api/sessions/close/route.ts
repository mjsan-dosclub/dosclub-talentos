import {z} from 'zod';
import {actor,failure,HttpError,operator,sameOrigin} from '../../../../lib/access';
import {audit,transaction} from '../../../../lib/db';

const input=z.object({sessionId:z.string().uuid(),reason:z.string().trim().min(3).max(2000)});
export async function POST(request:Request){
  try{
    sameOrigin(request);const a=await actor();operator(a);
    const parsed=input.safeParse(await request.json());if(!parsed.success)throw new HttpError(400,'Choose a session and provide a closure reason');
    const result=await transaction(async db=>{
      const session=(await db.query('SELECT id,group_id,closed_at FROM sessions WHERE id=$1 FOR UPDATE',[parsed.data.sessionId])).rows[0];
      if(!session)throw new HttpError(404,'Session not found');
      if(session.closed_at)throw new HttpError(409,'This session is already closed');
      const absences=await db.query(`INSERT INTO attendance(student_id,session_id,status,source) SELECT p.user_id,$1,'Absent – Unconfirmed','DOS Organiser' FROM student_profiles p WHERE p.group_id=$2 ON CONFLICT(student_id,session_id) DO NOTHING RETURNING student_id`,[session.id,session.group_id]);
      const closed=(await db.query('UPDATE sessions SET closed_at=now() WHERE id=$1 RETURNING closed_at',[session.id])).rows[0];
      await audit(db,a,'session',session.id,{closedAt:null},{closedAt:closed.closed_at,unconfirmedAbsences:absences.rowCount},parsed.data.reason);
      return {closedAt:closed.closed_at,unconfirmedAbsences:absences.rowCount};
    });
    return Response.json(result);
  }catch(error){return failure(error)}
}
