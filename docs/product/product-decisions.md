# Product decisions

## DEC-007 — Invitation capacity

Approved by the product owner on 14 September 2026.

Invitations do not reserve seats. A student becomes a confirmed group member only when they successfully accept an invitation. Acceptance is first-accepted, first-confirmed and must atomically check the group's current enrolment against its configured capacity. If the group is full, acceptance stops and directs the student to contact DOS Club. Waiting-list, transfer and withdrawal behaviour remains `NEEDS_PRODUCT_DECISION`.
