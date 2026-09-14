# Technical decisions

13 September 2026: Owner approved invitation-only email/password accounts, students accessing their own records, trainers assigned sessions, institution-scoped college coordinators, organiser programme operations and super-admin account/settings administration, with audited manual changes.

Owner selected Vercel and delegated database selection. Technical choice: managed Neon PostgreSQL, standard pg driver and versioned SQL migrations. Better Auth owns credential hashing and sessions; application role_assignments owns product authorization. Use pooled runtime connections and separate preview/production databases.

Next.js 16 and Node 24 serve the application. The versioned root `vercel.json` installs from the lockfile, builds the nested web application and selects its output. Database migrations are explicit deployment operations, never executed in a page request.

Resend is the initial email provider behind an application adapter. The API key and verified `EMAIL_FROM` identity live only in Vercel environment settings. A key exposed in conversation on 14 September 2026 must be revoked and is not accepted as deployment configuration.

No account signup endpoint is enabled. Invitation delivery and first-admin provisioning must be implemented and tested before account onboarding is advertised as available. No credentials have been configured yet.
