import {createHash} from 'node:crypto';
import {z} from 'zod';
import {actor,failure,HttpError,sameOrigin} from '../../../../lib/access';
import {audit,transaction} from '../../../../lib/db';
import {insideGeofence} from '../../../../../../packages/shared/geofence.mjs';

const input=z.object({token:z.string().min(40).max(200),latitude:z.number().min(-90).max(90).nullable(),longitude:z.number().min(-180).max(180).nullable()});

export async function POST(request:Request){
  try{
    sameOrigin(request);
    const a=await actor();
    if(a.role!=='student')throw new HttpError(403,'Only students can use an attendance link');
    const parsed=input.safeParse(await request.json());
    if(!parsed.success)throw new HttpError(400,'The attendance link or location is invalid');
    const v=parsed.data;
    const hash=createHash('sha256').update(v.token).digest('hex');
    const result=await transaction(async db=>{
      const window=(await db.query('SELECT * FROM attendance_windows WHERE token_hash=$1 FOR UPDATE',[hash])).rows[0];
      if(!window||window.closed_at)throw new HttpError(404,'This attendance window is unavailable');
      const now=new Date();
      if(now<new Date(window.opens_at))throw new HttpError(409,'This attendance window has not opened yet');
      if(now>new Date(window.closes_at))throw new HttpError(410,'This attendance window has closed');
      const member=(await db.query('SELECT 1 FROM student_profiles p JOIN sessions s ON s.group_id=p.group_id WHERE p.user_id=$1 AND s.id=$2',[a.id,window.session_id])).rows[0];
      if(!member)throw new HttpError(403,'This attendance window is for another group');
      const alreadyUsed=(await db.query('SELECT 1 FROM attendance_events WHERE window_id=$1 AND student_id=$2',[window.id,a.id])).rows[0];
      if(alreadyUsed)throw new HttpError(409,'You already used this attendance window');
      let distance:null|number=null;
      if(window.method==='QR + Geofence'){
        if(v.latitude===null||v.longitude===null)throw new HttpError(400,'Share your current location to use this attendance window');
        const geo=insideGeofence({latitude:window.latitude,longitude:window.longitude},{latitude:v.latitude,longitude:v.longitude},window.radius_meters);
        distance=geo.distance;
        if(!geo.inside)throw new HttpError(403,`You are outside this session's attendance area (${geo.distance} m away)`);
      }
      const current=(await db.query('SELECT status,source,updated_at FROM attendance WHERE student_id=$1 AND session_id=$2 FOR UPDATE',[a.id,window.session_id])).rows[0]??null;
      if(window.event_type==='Check Out'&&current?.status!=='Checked In')throw new HttpError(409,'Check in before checking out');
      if(window.event_type==='Check In'&&['Completed','Manually Confirmed'].includes(current?.status))throw new HttpError(409,'Attendance is already complete');
      const event=(await db.query('INSERT INTO attendance_events(window_id,student_id,event_type,method,distance_meters) VALUES($1,$2,$3,$4,$5) RETURNING id,recorded_at',[window.id,a.id,window.event_type,window.method,distance])).rows[0];
      const status=window.event_type==='Check In'?'Checked In':'Completed';
      const after=(await db.query('INSERT INTO attendance(student_id,session_id,status,source) VALUES($1,$2,$3,$4) ON CONFLICT(student_id,session_id) DO UPDATE SET status=$3,source=$4,updated_at=now() RETURNING status,source,updated_at',[a.id,window.session_id,status,window.method])).rows[0];
      await audit(db,a,'attendance_event',event.id,null,{sessionId:window.session_id,eventType:window.event_type,method:window.method,distance},'Student used session attendance window');
      return after;
    });
    return Response.json(result,{headers:{'Cache-Control':'no-store'}});
  }catch(error){return failure(error)}
}
