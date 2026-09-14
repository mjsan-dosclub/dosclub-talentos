export const evidenceTypes = Object.freeze(['GitHub Repository','Project URL','Document','Image','Video','External Assessment','Reflection','Other Evidence']);
export function validateEvidenceRequirement({required,types,deadline,sessionEnd}) {
  if(typeof required !== 'boolean') throw new Error('Evidence requirement must be explicit');
  if(!required) return {required:false,types:[],deadline:null};
  if(!Array.isArray(types)||types.length===0||types.some(t=>!evidenceTypes.includes(t))) throw new Error('Choose supported evidence types');
  const due=Date.parse(deadline),end=Date.parse(sessionEnd);
  if(!Number.isFinite(due)||!Number.isFinite(end)||due<=end) throw new Error('Set an evidence deadline after the session');
  return {required:true,types:[...new Set(types)],deadline:new Date(due).toISOString()};
}
export function safeEvidenceUrl(value){let url;try{url=new URL(value)}catch{throw new Error('Enter a valid URL')};if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new Error('Use a web URL without credentials');return url.toString()}
