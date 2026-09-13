# Meaningful validation

Required for implemented behaviour:

- Capacity: the final seat accepts one member; concurrent attempts cannot overfill a group; configurable limits are respected.
- Attendance: valid transition succeeds; replay, expired challenge, wrong student/group and checkout-before-checkin fail without mutation.
- Manual change: missing reason fails; permitted correction writes before/after/source/actor; audit failure rolls back state.
- Access: students cannot read each other; colleges cannot cross institutions; trainers cannot edit unassigned sessions.
- Evidence: disallowed type fails; no-evidence sessions do not request submission; deadline timestamps render consistently. Late acceptance follows the documented decision only.
- Privacy: reports exclude individual feedback; private responses do not enter PWA caches; credentials are absent from client bundles.
- Notifications: recording adapter never sends; retries cannot duplicate successful delivery when live integration is implemented.
- Journey: the same submitted evidence/attendance appears in profile and report without mismatched fixture counts.
- Interface: phone/desktop, keyboard focus, labels, empty/error/loading states and fresh-browser staging access.

Do not report unimplemented checks as passed. Final handoff lists actual commands/results and manual observations, with any limitations.
