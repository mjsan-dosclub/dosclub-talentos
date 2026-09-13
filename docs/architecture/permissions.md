# Authorization boundary

The role families below are agreed. Exact grants are `NEEDS_PRODUCT_DECISION: PD-02`. Use deny-by-default; this document does not authorize broad production access.

| Role | Intended scope |
|---|---|
| Student | Own sessions, attendance, evidence and profile |
| Trainer | Assigned sessions and legitimate manual attendance exceptions |
| College coordinator | Own institution reporting and absence confirmation |
| DOS organiser | Assigned programme operations and reasoned corrections |
| Super admin | Administration; never bypass audit |
| Recruiter | No V1 access |

Do not derive identity from client-supplied role/user IDs. Authenticate on the server and validate resource ownership/scopes for every read and write, including exports, nested resources and file URLs. Explicitly test cross-student, cross-institution and unassigned trainer access. Demo role selectors are not authorization.
