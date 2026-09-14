import {z} from 'zod';
import {actor,failure,HttpError,sameOrigin} from '../../../../lib/access';
import {audit,transaction} from '../../../../lib/db';

const input=z.object({submissionId:z.string().uuid(),status:z.enum(['Reviewed','Resubmission Requested']),reason:z.string().trim().min(3).max(2000)});
export async function POST(request:Request){
  try{
    sameOrigin(request);const a=await actor();
    if(!['trainer','organiser','super_admin'].includes(a.role))throw new HttpError(403,'Evidence review access required');
    const parsed=input.safeParse(await request.json());if(!parsed.success)throw new HttpError(400,'Choose a review result and provide a reason');
    const v=parsed.data;
    const result=await transaction(async db=>{
      const before=(await db.query(`SELECT sub.status,sub.student_id,sub.session_id FROM submissions sub JOIN sessions s ON s.id=sub.session_id WHERE sub.id=$1 AND ($2::text IN ('organiser','super_admin') OR s.trainer_id=$3) FOR UPDATE`,[v.submissionId,a.role,a.id])).rows[0];
      if(!before)throw new HttpError(403,'This submission is outside your assigned sessions');
      const after=(await db.query('UPDATE submissions SET status=$2 WHERE id=$1 RETURNING id,status',[v.submissionId,v.status])).rows[0];
      await audit(db,a,'submission',v.submissionId,before,{...before,status:v.status},v.reason);return after;
    });
    return Response.json(result);
  }catch(error){return failure(error)}
}
