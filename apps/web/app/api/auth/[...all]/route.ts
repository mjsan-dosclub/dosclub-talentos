import {auth} from '../../../../lib/auth';
export const runtime='nodejs';
async function handler(request:Request){try{return await auth().handler(request)}catch{ return Response.json({message:'Sign-in is temporarily unavailable. Please contact your DOS organiser.'},{status:503,headers:{'Cache-Control':'no-store'}})}}
export {handler as GET,handler as POST};
