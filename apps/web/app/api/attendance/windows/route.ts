import {createHash,randomBytes} from 'node:crypto';
import QRCode from 'qrcode';
import {z} from 'zod';
import {actor,failure,HttpError,sameOrigin} from '../../../../lib/access';
import {audit,transaction} from '../../../../lib/db';

const input=z.object({
  sessionId:z.string().uuid(),
  eventType:z.enum(['Check In','Check Out']),
  method:z.enum(['QR','QR + Geofence']),
  opensAt:z.string().datetime(),
  closesAt:z.string().datetime(),
  latitude:z.number().min(-90).max(90).nullable(),
  longitude:z.number().min(-180).max(180).nullable(),
  radiusMeters:z.number().int().positive().max(100000).nullable(),
  reason:z.string().trim().min(3).max(2000)
});

export async function POST(request:Request){
  try{
    sameOrigin(request);
    const a=await actor();
    if(!['trainer','organiser','super_admin'].includes(a.role))throw new HttpError(403,'Attendance operations access required');
    const parsed=input.safeParse(await request.json());
    if(!parsed.success)throw new HttpError(400,'Check the attendance window details');
    const v=parsed.data;
    if(Date.parse(v.closesAt)<=Date.parse(v.opensAt))throw new HttpError(400,'Attendance closing time must follow its opening time');
    const geo=[v.latitude,v.longitude,v.radiusMeters];
    if(v.method==='QR + Geofence'&&geo.some(value=>value===null))throw new HttpError(400,'Geofenced attendance requires a location and radius');
    if(v.method==='QR'&&geo.some(value=>value!==null))throw new HttpError(400,'Location values apply only to geofenced attendance');
    const token=randomBytes(32).toString('base64url');
    const tokenHash=createHash('sha256').update(token).digest('hex');
    const id=await transaction(async db=>{
      const session=(await db.query(`SELECT s.id FROM sessions s WHERE s.id=$1 AND ($2::text IN ('organiser','super_admin') OR s.trainer_id=$3)`,[v.sessionId,a.role,a.id])).rows[0];
      if(!session)throw new HttpError(403,'This session is not assigned to you');
      const row=(await db.query('INSERT INTO attendance_windows(session_id,event_type,method,token_hash,opens_at,closes_at,latitude,longitude,radius_meters,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',[v.sessionId,v.eventType,v.method,tokenHash,v.opensAt,v.closesAt,v.latitude,v.longitude,v.radiusMeters,a.id])).rows[0];
      await audit(db,a,'attendance_window',row.id,null,{sessionId:v.sessionId,eventType:v.eventType,method:v.method,opensAt:v.opensAt,closesAt:v.closesAt},v.reason);
      return row.id as string;
    });
    const url=`${process.env.BETTER_AUTH_URL}/attendance?token=${encodeURIComponent(token)}`;
    const qr=await QRCode.toDataURL(url,{width:480,margin:2,errorCorrectionLevel:'M'});
    return Response.json({id,url,qr},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(error){return failure(error)}
}
