import { Pool, type PoolClient } from 'pg';
let pool: Pool | undefined;
function connectionString(){return process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;}
export function database(){const url=connectionString();if(!url)throw new Error('DATABASE_NOT_CONFIGURED');return pool ??= new Pool({connectionString:url,max:3,idleTimeoutMillis:10000,connectionTimeoutMillis:10000});}
export async function transaction<T>(fn:(db:PoolClient)=>Promise<T>){const client=await database().connect();try{await client.query('BEGIN');const result=await fn(client);await client.query('COMMIT');return result}catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}}
export async function audit(db:PoolClient, actor:{id:string,role:string},entity:string,entityId:string,before:unknown,after:unknown,reason:string){if(!reason.trim())throw new Error('A reason is required');await db.query('INSERT INTO audit_events(actor_id,actor_role,entity,entity_id,before_value,after_value,reason) VALUES($1,$2,$3,$4,$5,$6,$7)',[actor.id,actor.role,entity,entityId,JSON.stringify(before),JSON.stringify(after),reason]);}
