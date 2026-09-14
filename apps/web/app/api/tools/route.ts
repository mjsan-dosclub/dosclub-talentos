import {z} from 'zod';
import {actor,failure,HttpError,sameOrigin} from '../../../lib/access';
import {audit,transaction} from '../../../lib/db';

const input=z.object({tool:z.string().trim().min(1).max(200),reflection:z.string().trim().min(10).max(3000)});
export async function POST(request:Request){
  try{
    sameOrigin(request);const a=await actor();
    if(a.role!=='student')throw new HttpError(403,'Only students can add their own tool reflections');
    const parsed=input.safeParse(await request.json());if(!parsed.success)throw new HttpError(400,'Name the tool and describe what you can do with it');
    const row=await transaction(async db=>{const result=(await db.query('INSERT INTO tool_confidence(student_id,tool,reflection) VALUES($1,$2,$3) RETURNING id,tool,reflection,created_at',[a.id,parsed.data.tool,parsed.data.reflection])).rows[0];await audit(db,a,'tool_reflection',result.id,null,{tool:result.tool},'Student added tool reflection');return result});
    return Response.json(row,{status:201});
  }catch(error){return failure(error)}
}
