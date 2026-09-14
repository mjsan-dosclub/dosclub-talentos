# Implementation status

The deadline has been removed at the user's request. Target is a fully functional V1, delivered in verified increments.

Implemented in the first application increments: Next.js/React/TypeScript app structure, responsive public landing page, invitation-only sign-in UI, role-scoped member workspace, preliminary privacy page, PWA manifest and public-only offline cache, PostgreSQL schema, Better Auth server boundary, recording/Resend notification adapters, student evidence and certification workflows, journey summaries, audited trainer/DOS manual attendance, lightweight college absence confirmation, cohort/session operator forms with trainer assignment, role-aware member invitations, one-time super-admin bootstrap, and emailed invitation acceptance.

The accepted capacity rule is first-accepted, first-confirmed. Pending invitations do not reserve capacity; acceptance locks the group and atomically checks confirmed enrolment before creating a student account.

Pending: database/environment connection, invitation delivery retry/management, attendance closure and absence generation, evidence review, profile editing, Firebase push, verified-domain email delivery, reports, deployment and production readiness. No fake login or seeded role switch is used. Authenticated, invitation and attendance-token pages and APIs are deliberately excluded from the offline cache.

Technical direction: Node 24, Next.js App Router and TypeScript in a modular monolith, deployed to Vercel with Neon PostgreSQL. Dependencies are locked after install. See root package scripts.
