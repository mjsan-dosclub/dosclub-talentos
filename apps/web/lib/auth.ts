import { betterAuth } from 'better-auth';
import { database } from './db';
function createAuth() {
 return betterAuth({database:database(),secret:process.env.BETTER_AUTH_SECRET!,baseURL:process.env.BETTER_AUTH_URL!,emailAndPassword:{enabled:true,disableSignUp:true,minPasswordLength:12},rateLimit:{enabled:true,storage:'database'},advanced:{useSecureCookies:process.env.NODE_ENV==='production'},disabledPaths:['/delete-user','/update-user','/change-email']});
}
let instance: ReturnType<typeof createAuth>|undefined;
export function auth(){
 if(!process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL) throw new Error('AUTH_NOT_CONFIGURED');
 return instance ??= createAuth();
}
