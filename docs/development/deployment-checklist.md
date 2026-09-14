# TalentOS deployment checklist

Owner account email: `descienceosclub@gmail.com`

This checklist is the release gate for the first controlled TalentOS deployment. Check each item in order. Keep the GitHub repository private.

## 1. Repository and release branch

- [x] The application is committed on `feature/v1-foundation`.
- [x] The remote branch matches local commit `14b2fe6`.
- [x] Automated tests, TypeScript validation and the production build pass.
- [x] Vercel is authorised to see the private `descienceosclub/dosclub-talentos` repository.
- [ ] Review the feature branch and merge it into `main`.
- [ ] Confirm `main` contains `package.json`, `vercel.json`, `apps/web`, `migrations` and `scripts`.
- [ ] Keep branch protection and pull-request review enabled for later production changes.

Do not transfer the repository merely because it is private. Vercel's GitHub app can deploy a private repository. If ownership must change for an organisational reason, transfer it before production, then reconnect the Git remote and Vercel Git integration and verify access again.

## 2. Vercel project

- [ ] Import `descienceosclub/dosclub-talentos`.
- [ ] Use project name `dosclub-talentos` if it is available.
- [ ] Keep the repository root as the Vercel root directory; `vercel.json` already points the build at `apps/web`.
- [ ] Confirm framework detection is Next.js.
- [ ] Confirm Node.js 24 is selected from `package.json` / `.nvmrc`.
- [ ] Record the assigned `https://…vercel.app` URL.
- [ ] Set `BETTER_AUTH_URL` to that exact HTTPS origin before the final deployment.

## 3. Neon PostgreSQL

- [ ] Add Neon from the Vercel project Storage/Marketplace.
- [ ] Choose the nearest available production region to the primary users.
- [ ] Create separate Preview and Production databases or branches.
- [ ] Expose the pooled connection string as `DATABASE_URL` in the matching Vercel environments.
- [ ] Confirm Preview never points at the Production database.
- [ ] Enable Neon backups/restore features appropriate to the selected plan.

## 4. Environment variables

Configure these independently for Preview and Production. Never paste their values into Git, issues, pull requests or chat.

- [ ] `DATABASE_URL` — supplied by Neon.
- [ ] `BETTER_AUTH_SECRET` — a newly generated high-entropy secret.
- [ ] `BETTER_AUTH_URL` — the exact deployment origin, with no trailing path.
- [ ] `RESEND_API_KEY` — a new key created after revoking the key exposed earlier.
- [ ] `EMAIL_FROM` — a sender on a domain verified in Resend.
- [ ] `BOOTSTRAP_ADMIN_EMAIL=descienceosclub@gmail.com` — used only during initial owner creation.
- [ ] `BOOTSTRAP_ADMIN_NAME` — the chosen display name for the owner.
- [ ] `BOOTSTRAP_ADMIN_PASSWORD` — a strong password entered privately for the one-time bootstrap.

`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` remain unset until push delivery is implemented and verified.

## 5. Database initialization

Run these commands from a trusted local checkout with Node.js 24 and `DATABASE_URL` set for the intended target:

```text
npm ci
npm run db:migrate
npm run bootstrap:admin
```

- [ ] Confirm both migrations appear in `schema_migrations`.
- [ ] Confirm the bootstrap command reports that the initial super admin was created.
- [ ] Immediately remove `BOOTSTRAP_ADMIN_PASSWORD` from local and Vercel environments.
- [ ] Do not run the bootstrap again; it refuses to proceed after any role assignment exists.

## 6. Resend

- [ ] Revoke the API key that was exposed in chat.
- [ ] Create a replacement key with only the access required for TalentOS email.
- [ ] Verify the sending domain in Resend.
- [ ] Set a clear sender, for example `DOS Club TalentOS <notifications@your-domain>`.
- [ ] Send one invitation to a controlled test address.
- [ ] Confirm delivery, link origin, expiry text and acceptance.
- [ ] Send one closed-session attendance report to a test college coordinator.

## 7. Controlled acceptance test

- [ ] Sign in as `descienceosclub@gmail.com`.
- [ ] Create one test B2C cohort with a small capacity.
- [ ] Invite a student and confirm that the pending invitation does not consume capacity.
- [ ] Accept the invitation and confirm that acceptance consumes one seat.
- [ ] Confirm a later acceptance is refused when the group is full.
- [ ] Invite a trainer and assign the trainer to a session.
- [ ] Create QR-only check-in and check-out windows.
- [ ] Confirm replayed scans and out-of-order checkout are refused.
- [ ] Create a geofenced window and test both inside and outside the configured radius.
- [ ] Submit workshop evidence and a certification as the student.
- [ ] Review evidence as the assigned trainer.
- [ ] Record a manual attendance exception with a reason.
- [ ] Close the session and verify missing attendance becomes `Absent – Unconfirmed`.
- [ ] Confirm the absence as the college coordinator.
- [ ] Email the consolidated attendance report.
- [ ] Test the public landing page, privacy page, mobile layout and PWA installation.

## 8. Release

- [ ] Review Vercel deployment logs for errors and secret leakage.
- [ ] Confirm protected pages and APIs return no cached private data.
- [ ] Confirm invitation and attendance-token URLs are not stored by the service worker.
- [ ] Promote the validated deployment to Production.
- [ ] Record the production URL in the README and project decision log.
- [ ] Keep the rollout limited to controlled test accounts until retention, support contact and data-correction procedures are approved.

## Current deployment blockers

1. `feature/v1-foundation` has not yet been merged into `main`.
2. Neon is not connected and migrations have not run against a hosted database.
3. Production secrets are not configured.
4. The exposed Resend key must be revoked and replaced.
5. The initial owner password and display name must be entered privately.
