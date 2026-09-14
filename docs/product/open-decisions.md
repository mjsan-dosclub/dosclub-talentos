# Product decision register

Confirmed: growth not grading; configurable B2C capacity default 40; optional offline delivery; per-session evidence requirements and deadlines; manual attendance with reasons/audit; college exception confirmation; consolidated feedback reporting; PWA; email/Firebase adapters; separate assessment portal; no public ranking or AI high-impact decisions.

All items below are `NEEDS_PRODUCT_DECISION`. No arbitrary production defaults are permitted.

| ID | Missing decision | Affected behaviour |
|---|---|---|
| PD-01 | Login method, invitation/onboarding and account recovery | Live identity |
| PD-02 | Exact role grants, trainer assignments, organiser scope and multi-institution membership | Production authorization |
| PD-03 | QR lifetime, rotation, check-in/out windows and replay rules | Live QR attendance |
| PD-04 | Geofence radius, accuracy threshold, location retention, online/hybrid fallback | Location enforcement |
| PD-05 | Late/partial/completed duration rules and session closure | Automatic attendance classification |
| PD-06 | Whether feedback blocks checkout; questions and aggregation privacy threshold | Feedback gate/reporting |
| PD-07 | College confirmation identity, reply/link workflow, deadlines and excused authority | Live absence confirmation |
| PD-08 | Late evidence acceptance, resubmission and review authority | Submission policy beyond timestamp recording |
| PD-09 | Certification verification authority and maturity transition evidence requirements | Verified credentials/maturity changes |
| PD-10 | Transfers, withdrawn seats, waiting lists and capacity changes below enrolment | Advanced group allocation; invitation capacity is resolved separately |
| PD-11 | Retention, consent, deletion/export handling and contact visibility | Real student data |
| PD-12 | Assessment portal URL, authentication, identifiers and result contract | External assessment sync |
| PD-13 | Hosting target, domain, identity/database services and provider accounts | Shared staging/production |
| PD-14 | Notification recipients, opt-in, retries and scheduled-report triggers | Live messaging |

Fixtures may demonstrate explicitly labelled examples; fixture settings are not approved policies. Resolve only decisions required by the next slice. Record decision owner, date, accepted wording and implementation impact here.
