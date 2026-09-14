# Attendance flow

Agreed states: Not Started, Checked In, Completed, Late, Partial, Absent – Unconfirmed, Absent – Confirmed, Excused, Manually Confirmed.

Sources: QR, QR + Geofence, Trainer, DOS Organiser, College Confirmation. Retain source and event history after corrections.

QR check-in/out requires an authenticated student, session membership, valid server-issued expiring challenge, session time-window validation and configured location validation when required. Check-out requires check-in. Reject duplicate/replayed actions without changing state. Never trust the client clock or a client-supplied final status.

Operators explicitly configure each token window. Geofenced windows also require an explicit latitude, longitude and positive radius. Token defaults, automated late/partial derivation and session-closure rules remain PD-03–PD-05. Do not infer absence from a missing scan while a session remains active. Do not assume checkout implies evidence submission.

Trainer manual confirmation or organiser correction requires scope, target, reason, old/new state and server timestamp. Persist audit atomically; failure rolls back the correction.

After session closure and operational review, provisional absences await college confirmation. Preserve who supplied the confirmation and who recorded it, including when an organiser records a college response. Do not label an organiser's own assumption as college confirmation. Excused authority and confirmation transport remain PD-07.

Offline or location-denied attempts must display an actionable exception path; they must not silently count as accepted attendance. Feedback gating remains PD-06.
