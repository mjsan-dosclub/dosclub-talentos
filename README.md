# DOS Club TalentOS

**Student Growth. Learning Evidence. Talent Intelligence.**

DOS Club TalentOS is the operating platform for the Descience Open Source Club student-development ecosystem.

TalentOS is designed to capture a student's journey over time — from onboarding and baseline assessments through workshops, attendance, learning evidence, certifications, projects, trainer observations and eventual industry readiness.

TalentOS is **not designed as a conventional LMS, college ERP, attendance application or student grading system**.

Its primary purpose is to create a reliable, longitudinal record of how students learn, participate, build, improve and demonstrate capability.

---

# 1. Product Philosophy

TalentOS follows five fundamental principles:

## Growth, not grading

Students should see their development rather than feel ranked or judged.

Avoid terminology such as:

- Fail
- Weak Student
- Poor Performer
- Bottom Rank
- Grade D

Prefer language such as:

- Developing
- Progressing
- Consistent
- Emerging
- Demonstrated
- Needs Support
- Growth Opportunity

---

## Evidence, not assumptions

TalentOS should not claim that a student has a skill simply because the student selected it.

Skills should progressively become supported by evidence such as:

- Workshop participation
- GitHub repositories
- Project submissions
- Assessments
- Certifications
- Trainer observations
- Demonstrated project work

---

## Low operational burden

TalentOS must reduce work for:

- College coordinators
- Trainers
- DOS Club organisers

College faculty should not be expected to perform routine administration inside TalentOS.

TalentOS should proactively send relevant information to colleges rather than requiring them to constantly log into the platform.

---

## Student-first experience

Students are the primary long-term users of TalentOS.

The student experience should be:

- Mobile-first
- PWA-first
- Simple
- Encouraging
- Evidence-driven
- Progress-oriented

---

## Human-controlled decisions

Version 1 must not allow AI to independently make high-impact decisions regarding:

- Employability
- Student rejection
- Final ranking
- Hiring suitability
- Behavioural judgement

AI may eventually assist with summarisation and insight generation, but source data and human review remain authoritative.

---

# 2. Version 1 Objective

TalentOS V1 is being built initially for **DOS Club Batch 3**, which contains approximately **27 planned workshops**.

V1 should provide the operational backbone required to manage these workshops and capture the learning journey of every participating student.

The system should support both:

### B2B

DOS Club programmes operated in partnership with colleges and institutions.

### B2C

Students who directly join DOS Club.

---

# 3. Core Entity Structure

The high-level platform hierarchy is:

```text
Organisation
    ↓
Programme
    ↓
Institution / DOS Direct
    ↓
Batch
    ↓
Group
    ↓
Student
```

B2B example:

```text
DOS Club
  ↓
Saveetha College
  ↓
Batch 3
  ↓
Group A
  ↓
40 Students
```

B2C example:

```text
DOS Club Direct
  ↓
Batch 3
  ↓
Group 01
  ↓
Maximum 40 Students
```

When a B2C group reaches its configured maximum capacity, another group can be created.

The maximum group size must be configurable.

Do not hard-code the number 40.

---

# 4. B2C Delivery Model

B2C students are expected to attend primarily through online sessions.

Offline sessions may also be offered.

The platform must therefore support session modes:

- Online
- Offline
- Hybrid

Do not design the system under the assumption that all B2C sessions will eventually become offline.

---

# 5. User Roles

The initial system should anticipate the following roles.

## DOS Club Super Admin

Responsible for platform-level administration.

Possible responsibilities:

- Institution management
- Batch management
- Student management
- Workshop management
- Reports
- Platform settings
- Permissions
- Attendance corrections
- Programme oversight

---

## DOS Club Organiser / Committee

Operational access.

Responsibilities may include:

- Workshop coordination
- Attendance review
- Student monitoring
- Evidence review
- Communication
- Reporting

---

## College Coordinator

Limited to the institution they represent.

Primary purpose:

- Review programme visibility
- Receive attendance reports
- Confirm attendance exceptions
- Review student development

College users should not be required to perform extensive routine administration.

---

## Trainer / Industry Expert

Extremely simplified access.

Trainer workflows should be intentionally lightweight.

Examples:

- View today's workshop
- Display attendance QR
- Review participant list
- Manually resolve attendance exceptions
- Recognise standout participants
- Flag students requiring support

Trainer access should never become an administrative burden.

---

## Student

Students should have access to their own TalentOS journey.

Potential areas:

- Workshops
- Attendance
- Submissions
- Projects
- Certifications
- Skills
- Recognitions
- Events
- Notifications
- Personal growth timeline

---

## Recruiter

Recruiter access is **not part of V1**.

The architecture may eventually support employer-facing Talent Passports, but this should not be implemented during the initial operational phase.

---

# 6. Workshop Model

Every workshop should support:

- Workshop title
- Description
- Programme
- Batch
- Group
- Institution
- Trainer
- Date
- Start time
- End time
- Venue
- Session mode
- Learning objective
- Attendance configuration
- Submission requirement
- Submission deadline
- Feedback configuration

---

# 7. Workshop Evidence

Not every workshop requires GitHub.

Examples of non-technical workshops include:

- HR sessions
- Image consulting
- Agile
- Communication
- Leadership
- Career readiness

Therefore every workshop must explicitly define whether evidence is required.

Example configuration:

```text
Submission Required: Yes / No
```

If required:

Possible submission types include:

- GitHub Repository
- Project URL
- Document
- Screenshot
- Image
- Video
- External Assessment
- Reflection
- Other Evidence

Submission types should be extensible.

---

# 8. Submission Deadlines

Evidence should not necessarily be submitted during the workshop.

Each workshop may configure a submission deadline.

Example:

```text
Workshop Date:
18 September 2026

Submission Deadline:
20 September 2026, 11:59 PM
```

Suggested evidence statuses:

- Not Required
- Pending
- Submitted
- Submitted Late
- Reviewed
- Resubmission Requested

Do not invent additional states without documenting them.

---

# 9. Attendance System

TalentOS should contain its own attendance engine.

V1 must not depend on Zenro.

The attendance system should support:

- QR check-in
- QR check-out
- Time-window validation
- Location / geofence validation where required
- Manual trainer attendance
- DOS organiser correction
- College absence confirmation
- Audit logging

---

# 10. QR Attendance

Permanent workshop QR codes should not be used.

Attendance QR tokens should be time-sensitive.

Possible safeguards include:

- Expiring QR
- Logged-in student identity
- Time-window validation
- Location validation
- Duplicate check-in protection

The exact token expiry interval remains a product/technical configuration decision.

Do not hard-code an arbitrary value without approval.

---

# 11. Attendance Status

Initial attendance states:

```text
Not Started
Checked In
Completed
Late
Partial
Absent – Unconfirmed
Absent – Confirmed
Excused
Manually Confirmed
```

Attendance must also record its source:

```text
QR
Trainer
DOS Organiser
College Confirmation
```

A manually corrected attendance record must never be indistinguishable from QR attendance internally.

---

# 12. Manual Attendance

Trainers and authorised DOS organisers may manually update attendance for legitimate exceptions.

Examples:

- Student device unavailable
- Battery failure
- Connectivity issue
- QR malfunction
- Student registration issue
- Approved operational exception

Every manual attendance action must require a reason.

Every manual attendance modification must generate an audit record.

---

# 13. College Absence Confirmation

TalentOS should reduce workload for college staff.

After a workshop, the system can calculate provisional attendance.

Example:

```text
Expected Students: 40
Completed Attendance: 35
Unconfirmed Absences: 5
```

DOS organisers may review operational exceptions.

The college should then receive a concise workshop attendance report.

College confirmation should primarily focus on exceptions rather than requiring the faculty member to recreate attendance.

---

# 14. College Email Reporting

After relevant workshops, TalentOS should support sending a concise summary email.

Possible information:

- Workshop name
- Date
- Expected students
- Present
- Absent
- Late
- Partial attendance
- Consolidated student feedback
- Submission requirement
- Submission deadline
- Students requiring attendance confirmation

Raw individual student feedback should not automatically be emailed.

Only appropriate consolidated feedback should be sent.

---

# 15. Email Provider Architecture

TalentOS should not be tightly coupled to one email provider.

Recommended architecture:

```text
TalentOS
   ↓
Notification Service
   ↓
Email Adapter
   ↓
Email Provider
```

An initial provider such as Resend may be used.

The provider should remain replaceable without rewriting TalentOS business logic.

---

# 16. Feedback

Student checkout may require feedback before a workshop is marked fully completed.

Example feedback:

### Session experience

- Excellent
- Good
- Okay
- Needs Improvement

### Reflection

One thing you learned today.

### Confidence

How confident are you in applying today's learning?

Feedback design should remain short.

Do not turn workshop checkout into a long survey.

---

# 17. Student 360 Profile

Each student should gradually build a complete learning profile.

The profile may contain:

## Identity

- Name
- DOS Student ID
- Photo
- Institution
- Degree
- Department
- Academic year
- Email
- Mobile
- GitHub
- LinkedIn

## DOS Journey

- Workshops
- Attendance
- Feedback
- Evidence
- Projects
- Assignments
- Recognitions

## Certifications

- Certification
- Provider
- Category
- Level
- Completion date
- Certificate
- Verification URL
- Verification status
- Expiry if applicable

## Skills & Tools

- Technology
- Tool
- Exposure
- Evidence
- Assessment references
- Proficiency indicators

## Assessments

- Baseline assessment
- Periodic technical assessments
- Workshop assessments
- External assessment references

## Recognition

- Trainer recognition
- Project achievement
- Hackathon participation
- DOS Club achievement
- Event participation

---

# 18. Certification Tracking

Certifications should be treated as structured records rather than random file uploads.

Example:

```text
Certification:
Claude Fundamentals

Provider:
Relevant provider

Category:
AI

Level:
Foundation

Completed:
20 October 2026

Evidence:
Certificate URL or uploaded document

Verification:
Verified / Pending
```

TalentOS should eventually distinguish verified credentials from student-reported credentials.

---

# 19. Skill Tracking

TalentOS must distinguish between:

### Self-reported confidence

What the student believes they know.

### Evidence-backed exposure

What TalentOS has observed through workshops, projects, submissions and certifications.

### Assessed proficiency

What technical assessments demonstrate.

These three concepts should never be silently merged into one score.

---

# 20. Skill Maturity

Where possible, use developmental language instead of grades.

Suggested maturity progression:

```text
Introduced
↓
Explored
↓
Applied
↓
Demonstrated
↓
Consistently Demonstrated
```

Example:

```text
GitHub

Current maturity:
Demonstrated

Evidence:
6 repositories
3 workshop submissions
1 team project
```

The exact logic that changes maturity levels must be documented before being automated.

---

# 21. External Assessment Platform

DOS Club has a separate technical assessment platform.

TalentOS should not duplicate the assessment engine.

TalentOS should eventually integrate using references or APIs.

Potential stored information:

- Assessment ID
- Assessment name
- Student
- Date
- Result
- Level
- Status
- External reference
- External deep link

V1 may initially use manual or scheduled synchronisation if required.

---

# 22. PWA

TalentOS should be designed as a Progressive Web App.

Students should be able to install TalentOS on their phone without requiring a native App Store application.

The student PWA may provide:

- Upcoming workshops
- Workshop check-in
- Workshop check-out
- Submission deadlines
- Evidence submission
- Certifications
- Student profile
- Events
- Notifications
- Recognitions
- Programme announcements

---

# 23. Notification Architecture

TalentOS should contain a generic notification system.

Initial channels:

- In-app
- Push
- Email

Push notifications may initially use Firebase Cloud Messaging.

Recommended abstraction:

```text
TalentOS
      ↓
Notification Engine
      ↓
 ┌─────────────┐
 │             │
Email         Push
 │             │
Provider     Firebase
```

Future communication channels must not require rewriting core TalentOS logic.

---

# 24. Notification Targeting

DOS organisers should eventually be able to communicate with:

- All students
- Institution
- Batch
- Group
- Workshop attendees
- Workshop absentees
- Students with pending submissions
- Individual students

Examples:

```text
Send reminder to students who have not submitted Workshop 12 evidence.
```

```text
Notify Batch 3 about tomorrow's workshop.
```

```text
Notify one college about venue changes.
```

---

# 25. Student Journey Timeline

Every meaningful activity should contribute to a student's timeline.

Example:

```text
17 Sep
Workshop 01 Completed

19 Sep
GitHub Evidence Submitted

24 Sep
Workshop 02 Completed

25 Sep
Trainer Recognition Received

01 Oct
AI Certification Added

04 Oct
Technical Assessment Completed

10 Oct
Workshop 06 Completed
```

Over time this becomes evidence of development.

---

# 26. V1 Core Modules

V1 should initially focus on:

1. Identity & Access
2. Institution & Cohort Management
3. Student 360 Profile
4. Workshop Operations
5. Smart Attendance
6. Student Feedback
7. Learning Evidence
8. Skills & Certifications
9. Notification Centre
10. Reporting & Insights

---

# 27. Features Explicitly Excluded From V1

Unless separately approved, the following are outside V1:

- Recruiter portal
- Automated job matching
- AI-generated employability decisions
- AI-generated final student scores
- Public cross-college ranking
- Full OriginBI behavioural integration
- Predictive employment analytics
- WhatsApp automation
- Native Android application
- Native iOS application
- Blockchain credentials
- Complex gamification systems
- Microservice architecture

Do not implement these features simply because they appear useful.

---

# 28. Reporting

V1 reporting should focus on operational usefulness.

Possible reports:

### Workshop Report

- Expected students
- Attendance
- Late
- Partial
- Absence
- Feedback
- Evidence status

### Institution Report

- Programme completion
- Attendance trends
- Submission completion
- Workshop feedback
- Students requiring support

### Student Report

- Workshop journey
- Attendance
- Evidence
- Certifications
- Skills
- Recognitions
- Progress timeline

Avoid building one arbitrary final student score during V1.

---

# 29. Audit Logging

All sensitive manual changes must be auditable.

Audit information should include:

```text
Actor
Role
Timestamp
Entity
Original Value
New Value
Reason
```

Examples:

- Attendance correction
- Certification verification
- Evidence deadline extension
- Workshop date change
- Student status modification

No administrator should silently bypass audit history.

---

# 30. Privacy & Access

TalentOS will contain personal and developmental student information.

Use role-based access control.

Core principle:

> Users should only access information required to perform their role.

Examples:

A trainer does not automatically need:

- Student phone numbers
- Behavioural assessments
- Private college comments

A recruiter does not need:

- GPS attendance records
- Internal intervention notes

A student should not see:

- Private recruiter comments
- Internal administrative notes

---

# 31. Landing Page Principle

The public TalentOS landing page must create curiosity without revealing the platform's detailed scoring methodology, analytics logic, institutional comparison methods or operational intellectual property.

The landing page must feel:

- Premium
- Human
- Calm
- Credible
- Editorial
- Technologically sophisticated

It must not look like a generic AI-generated SaaS website.

Avoid:

- Neon gradients
- Artificial intelligence brains
- Robots
- Network graphics
- Excessive glassmorphism
- Excessive cards
- Generic AI copy
- Public ranking tables

The experience should communicate:

> Potential is difficult to see in a résumé.

> TalentOS makes the journey visible.

The public website should reveal enough to create curiosity, but not enough to explain the entire operating model.

---

# 32. Design Principle

TalentOS should feel like:

> A premium operating system for student development and talent evidence.

It should not visually resemble:

- LMS
- College ERP
- HRMS
- Attendance software
- Generic dashboard template
- Gamified children's learning application

Design characteristics:

- Strong typography
- Generous whitespace
- Clear hierarchy
- Restrained colour
- Subtle animation
- Editorial student profiles
- Elegant data visualisation
- Minimal visual noise

---

# 33. AI Development Rule

This repository may be developed with assistance from Codex or other AI development tools.

AI assistants must follow this rule:

> **Do not invent business rules.**

If a requirement, database relationship, status, scoring mechanism, permission, workflow or behavioural rule is not explicitly documented:

```text
NEEDS_PRODUCT_DECISION
```

should be raised.

Do not silently choose an implementation and continue.

---

# 34. AI Development Restrictions

AI assistants must not independently:

- Create new user roles
- Create scoring weights
- Create employability scores
- Modify attendance rules
- Modify permissions
- Modify database relationships
- Expose private student data
- Create new business workflows
- Remove audit requirements
- Make architectural changes
- Modify production databases

without explicit documented approval.

---

# 35. Development Workflow

Every major feature should follow:

```text
Requirement
↓
Product Decision
↓
UX / Flow
↓
Data Model
↓
API Contract
↓
Implementation
↓
Tests
↓
Staging
↓
Approval
↓
Production
```

Do not move directly from:

```text
Idea → Production
```

---

# 36. Git Workflow

Recommended primary branches:

```text
main
develop
feature/*
fix/*
```

### main

Production-ready code only.

### develop

Integrated development branch.

### feature/*

One feature per branch.

Examples:

```text
feature/authentication
feature/student-profile
feature/workshop-management
feature/qr-attendance
feature/push-notifications
```

Pull requests should be reviewed before merging into `develop`.

Production releases should move from `develop` into `main` only after staging validation.

---

# 37. Environments

Maintain:

## Development

Used by developers and AI coding assistants.

## Staging

Used for internal validation and acceptance testing.

## Production

Used by real users.

AI assistants and developers must never experiment directly against production data.

---

# 38. Database Safety

The production database must support:

- Version-controlled migrations
- Backups
- Restore procedure
- Audit history
- Soft deletion where appropriate
- Referential integrity
- Access controls

Schema changes must occur through migrations.

Do not manually modify production tables without documented emergency procedures.

---

# 39. Secrets

Secrets must never be committed to Git.

Examples:

- Database passwords
- Firebase credentials
- API keys
- Email provider keys
- Authentication secrets

Use environment variables.

Commit only:

```text
.env.example
```

Never commit:

```text
.env
```

---

# 40. Initial Build Sequence

Recommended implementation sequence:

```text
01 Repository + Documentation
02 Authentication
03 Roles & Permissions
04 Institution Management
05 Batch & Group Management
06 Student Profile
07 Workshop Management
08 Attendance
09 Feedback
10 Evidence Submission
11 Certification Tracking
12 Skill Tracking
13 Notifications
14 Reporting
15 PWA Behaviour
16 Student Journey
```

Each stage should be verified before expanding the next layer.

---

# 41. Product Decision Log

Important architectural or business decisions should be documented.

Examples:

```text
DEC-001
TalentOS owns its attendance system.
Zenro integration is not required for V1.

DEC-002
B2C students are organised into configurable-capacity groups.
Initial operational target: 40.

DEC-003
No final Talent Score will be implemented during initial V1.

DEC-004
TalentOS is PWA-first.

DEC-005
GitHub evidence is configurable per workshop.

DEC-006
College administration should be kept intentionally lightweight.
```

This prevents future developers or AI assistants from unknowingly reversing previous decisions.

---

# 42. Guiding Question

Whenever a new TalentOS feature is proposed, ask:

> Does this help DOS Club understand, support or demonstrate the student's development journey?

If the answer is no, the feature may not belong in TalentOS.

---

# 43. Current Project Status

**Stage:** Active V1 implementation

**Implementation Status:** Foundation and initial operational journeys implemented

**Current Priority:** Complete role workflows, connect managed services, validate staging and release to production.

Next specifications required:

1. Database entity relationship model
2. Role and permission matrix
3. Attendance state machine
4. Evidence state machine
5. Certification verification state
6. B2C group lifecycle
7. Screen map
8. API architecture
9. Technology-stack decision

Do not begin large-scale implementation until these are reviewed.


# 44. Development handoff — 13 September 2026

The existing product specification above remains authoritative. Work is developed on focused branches and reviewed before release.

Supporting specifications:

- [V1 and deadline demo scope](docs/product/v1-scope.md)
- [Open product decisions](docs/product/open-decisions.md)
- [Proposed architecture](docs/architecture/system-architecture.md)
- [Permissions boundary](docs/architecture/permissions.md)
- [Attendance flow](docs/architecture/attendance-flow.md)
- [AI development rules](docs/development/ai-development-rules.md)
- [Git and environments](docs/development/git-workflow.md)
- [Validation strategy](docs/development/testing-strategy.md)

Planning documents do not approve unresolved policies. Any missing business rule remains marked `NEEDS_PRODUCT_DECISION`.


# 45. Active build — full functional V1

The deadline-driven demo constraint was removed by the owner. Development now targets the operational V1 in verified increments. See [implementation status](docs/development/implementation-status.md).

## Local development

Use Node.js 24 (`.nvmrc`). From the repository root, run `npm ci`, copy `.env.example` to `apps/web/.env.local`, and fill the local values without committing them. Run `npm run db:migrate`, then `npm run bootstrap:admin` once to create the first owner. Remove the bootstrap password immediately after it succeeds. Run `npm run dev` and open http://localhost:3000.

Validate changes with `npm test`, `npm run typecheck` and `npm run build`. `npm start` serves a previously built application.

## Vercel and Neon release path

1. Import `descienceosclub/dosclub-talentos` into Vercel and use the repository root as the project root.
2. Add a Neon PostgreSQL integration to the Vercel project and expose its pooled connection string as `DATABASE_URL` for Preview and Production.
3. Add `BETTER_AUTH_URL`, a generated `BETTER_AUTH_SECRET`, `EMAIL_FROM`, and a newly rotated `RESEND_API_KEY` to each target environment. Never reuse the key exposed in chat.
4. Run `npm run db:migrate` against the target database, bootstrap the initial owner once, and then delete the bootstrap password variable.
5. Verify invitation acceptance, sign-in, cohort creation and session scheduling in Preview before promoting the release to Production.

The approved seat policy is first-accepted, first-confirmed. Sending an invitation does not reserve capacity; accepting it atomically claims an available place.
