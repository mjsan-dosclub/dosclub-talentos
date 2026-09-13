# V1 and deadline demo

## Agreed operational scope

B2B: Institution → Batch → Group → Students. B2C: DOS Club Direct → Batch → Group → Students. B2C maximum capacity defaults to 40 and must be configurable. A full group causes subsequent enrolment to use a new group; allocation is atomic to prevent concurrent overfilling. Transfer, withdrawal and reserved-seat semantics remain undecided.

Sessions support online, offline and hybrid delivery. B2C is primarily online; offline sessions are optional. Do not force offline progression.

Each session specifies whether evidence is required, allowed evidence types and a deadline independently of attendance. Types can include GitHub, project URL, document, image, video, reflection and external assessment reference. Nontechnical sessions must not require GitHub by default.

Student 360 includes identity, participation, evidence, certifications, tools and a chronological journey. Certification claims retain provider, completion date, evidence/verification reference and verification status. Tool confidence, evidence and assessed proficiency remain distinct; never auto-promote maturity from attendance alone.

## Small coherent demo acceptance

- A responsive landing page leads to a clearly labelled synthetic-data demo.
- An organiser can inspect a B2B cohort and a B2C group with its configured capacity.
- A session displays mode, schedule, attendance configuration, evidence types and deadline.
- A documented attendance path produces a record with source; manual corrections require a reason and produce an audit event.
- A student submits an allowed evidence reference; the journey reflects it. No evidence is requested for a session configured without it.
- A college view is scoped to its institution and separates unconfirmed absence from confirmed absence.
- A report preview contains attendance and consolidated feedback, not raw individual comments.
- A student profile shows the evidence and certifications without rankings or inferred employability.
- Notification previews distinguish queued/previewed from actually delivered.
- PWA manifest, icons and responsive experience are verified. Offline attendance cannot silently become valid attendance.

Every implemented action must use the same state as its resulting report/profile. Avoid disconnected screen mock data. If role switching is used in an isolated demo, label it as a simulation; never represent it as production authentication.

## Deferred beyond the deadline demo

Live email and Firebase delivery until provider credentials, sender identity, recipients and consent are configured; real student onboarding until auth, permissions and privacy controls are verified; production geofence enforcement until policy is agreed; external assessment synchronization until its contract is supplied; file uploads until private storage and validation exist.

Recruiter access, job matching, AI scoring, public leaderboards, behavioural profiling integration, predictive analytics, WhatsApp, native apps, complex gamification and microservices are outside V1.
