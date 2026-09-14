# Git and environment conventions

Inspect the remote default branch and existing conventions first. Intended branch model: `main` for releasable code, `develop` for integration and `feature/<bounded-change>` for work. If the repository differs, reconcile without renaming or overwriting branches blindly.

Commit documentation before substantial feature implementation. Prefer separate commits for domain logic, interface and delivery configuration. Use pull requests into the integration branch, then a reviewed release into main. Never force-push shared branches. Do not reset or clean unknown user changes.

Development: local synthetic fixtures, recording notification adapter, isolated credentials.
Staging: synthetic fixtures and team-accessible demo, separate persistence and credentials.
Production: real students only after auth, permissions, audit, retention and recovery are validated.

Keep `.env*` ignored except `.env.example`; never expose server credentials through client environment variables. Document actual required names after stack inspection. Rotate exposed credentials instead of merely deleting them from the latest commit.

Before delivery run the repository's install/build and relevant checks; verify a fresh checkout can start using the README. Record the deployed commit, environment and URL. Roll back through the hosting provider's prior known-good deployment; database changes require a reviewed compatibility/restore plan.
