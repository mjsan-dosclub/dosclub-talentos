import {z} from 'zod';
import {actor,failure,HttpError,sameOrigin} from '../../../lib/access';
import {audit,transaction} from '../../../lib/db';
import {safeEvidenceUrl} from '../../../../../packages/shared/evidence.mjs';

const input=z.object({course:z.string().trim().max(200).nullable(),department:z.string().trim().max(200).nullable(),academicYear:z.string().trim().max(100).nullable(),githubUrl:z.url().max(2000).nullable(),linkedinUrl:z.url().max(2000).nullable()});

export async function PATCH(request:Request){
  try{
    sameOrigin(request);
    const a=await actor();
    if(a.role!=='student')throw new HttpError(403,'Only students can edit their own profile');
    const parsed=input.safeParse(await request.json());
    if(!parsed.success)throw new HttpError(400,'Check the profile details');
    const v=parsed.data;
    for(const url of [v.githubUrl,v.linkedinUrl])if(url)try{safeEvidenceUrl(url)}catch(error){throw new HttpError(400,(error as Error).message)}
    const profile=await transaction(async db=>{
      const before=(await db.query('SELECT course,department,academic_year,github_url,linkedin_url FROM student_profiles WHERE user_id=$1 FOR UPDATE',[a.id])).rows[0];
      if(!before)throw new HttpError(404,'Student profile not found');
      const after=(await db.query('UPDATE student_profiles SET course=$2,department=$3,academic_year=$4,github_url=$5,linkedin_url=$6 WHERE user_id=$1 RETURNING course,department,academic_year,github_url,linkedin_url',[a.id,v.course,v.department,v.academicYear,v.githubUrl,v.linkedinUrl])).rows[0];
      await audit(db,a,'student_profile',a.id,before,after,'Student updated own profile');
      return after;
    });
    return Response.json(profile);
  }catch(error){return failure(error)}
}
