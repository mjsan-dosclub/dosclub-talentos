# Architecture and data boundaries

Reconcile with the repository before choosing frameworks. Prefer one deployable modular application with server-enforced domain rules and durable transactional storage.

## Entities

- Institution (B2B or DOS Direct), Batch, Group (configured capacity), Membership (student/group and effective status).
- User, scoped RoleAssignment, StudentProfile, TrainerAssignment.
- Workshop (learning topic), Session (scheduled delivery and participating groups).
- AttendanceRecord (student/session, state, source, timestamps), AttendanceEvent (append-only transitions), QRChallenge (server-controlled validity).
- Feedback (student/session with restricted visibility); consolidated report derived from source records.
- EvidenceRequirement (session/types/deadline), Submission (student/session/reference/timestamps/review state).
- Certification (student/provider/evidence/verification metadata), ToolRecord (self-confidence), SkillEvidence and AssessmentReference (separate provenance).
- NotificationIntent, DeliveryAttempt, AuditEvent.

Treat these as design entities pending repository reconciliation, not a finalized migration. Membership cardinality and the workshop/session relationship require review where existing behaviour differs.

## Integrity

Enforce unique attendance per student/session. Every write checks scoped access and membership on the server. Allocate B2C seats in a transaction that locks/checks capacity and creates the next group safely. Use idempotency for attendance and delivery retries. Store instants in UTC and render explicit local time zones. Validate URL schemes and uploaded content. Do not fetch arbitrary submitted URLs on the server.

Manual state mutation and audit insertion are one transaction. Audit records are append-only to application roles and contain only necessary information. Failed authorization cannot mutate state.

## Notifications

Domain event → notification intent/outbox → email or push adapter → delivery attempt. Resend is an initial email option; Firebase Cloud Messaging is the push target. Adapters keep provider SDKs out of domain logic. Development uses a recording adapter with no external delivery. Production needs recipient validation, opt-in where applicable, retry/idempotency handling and delivery status. Never equate queued with sent.

Report previews show attendance categories separately and only consolidated feedback. Do not send raw feedback or student assessment/behavioural data by default. Confirmation links need scoped identity, expiration and audited handling.

## Privacy and assessment boundary

Student data is private by default. No public student discovery, ranking or recruiter access. Sensitive responses and location must not enter service-worker caches or application logs. Never cache authenticated API responses for offline use without an explicit privacy design. The assessment portal remains authoritative for its results; keep external identifiers and provenance, not an invented test engine or score mapping.
