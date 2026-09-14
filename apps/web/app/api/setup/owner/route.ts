import { timingSafeEqual } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { audit, transaction } from '../../../../lib/db';

const input = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(12).max(200),
});

function validToken(received: string | null) {
  const expected = process.env.BOOTSTRAP_SETUP_TOKEN;
  if (!received || !expected) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  if (!validToken(request.headers.get('x-setup-token'))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid owner details' }, { status: 400 });

  try {
    await transaction(async (db) => {
      const existing = await db.query('SELECT 1 FROM role_assignments LIMIT 1');
      if (existing.rowCount) throw new Error('OWNER_ALREADY_EXISTS');

      const userId = crypto.randomUUID();
      const accountId = crypto.randomUUID();
      const now = new Date();
      const password = await hashPassword(parsed.data.password);
      await db.query('INSERT INTO "user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES($1,$2,lower($3),true,$4,$4)', [userId, parsed.data.name, parsed.data.email, now]);
      await db.query('INSERT INTO account(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,\'credential\',$2,$3,$4,$4)', [accountId, userId, password, now]);
      await db.query("INSERT INTO role_assignments(user_id,role) VALUES($1,'super_admin')", [userId]);
      await audit(db, { id: userId, role: 'super_admin' }, 'account', userId, null, { role: 'super_admin' }, 'Initial owner bootstrap');
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'OWNER_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'Owner already exists' }, { status: 409 });
    }
    throw error;
  }
}
