# AI development rules

If a requirement, workflow, business rule, scoring rule, permission or database relationship is not explicitly documented, do not invent it. Mark it `NEEDS_PRODUCT_DECISION` and stop implementation of that specific behaviour until clarified. Continue independent approved work.

1. Read repository instructions and inspect existing code before editing. Preserve user changes.
2. Work on a feature branch. Keep changes reviewable and scoped to a coherent slice.
3. Record implementation status honestly: documented, simulated, implemented, tested and deployed are different states.
4. Do not claim a skill from confidence, a verified credential from a URL, or attendance from a client-only action.
5. Never implement AI student scoring, high-impact decisions or public ranking.
6. Enforce access server-side and audit manual changes atomically, including super-admin changes.
7. Keep secrets and real student data out of fixtures, logs, source control and screenshots.
8. Test domain boundaries and negative authorization cases. Do not substitute visual checks for access checks.
9. Use provider adapters and explicit integration contracts. Do not invent external API results.
10. Update README, decision register and validation notes alongside behaviour changes.
11. Communicate included work, deferred work, failed checks and deployment blockers plainly.
