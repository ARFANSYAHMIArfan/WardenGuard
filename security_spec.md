# WardenGuard Security Specification

## Data Invariants
1. An incident report must have a `location`, `timestamp`, and `videoUrl`.
2. Only authorized wardens (listed in `/wardens/{uid}`) can read or update incident reports.
3. Students (unauthorized users) can only CREATE reports but not read them. (Assuming there's a student interface, though in this app we only build the Warden dashboard).
4. `status` transitions are strictly from `Sent` to `Reviewed`.
5. `priority` can only be set to `High` by a warden flagging for action.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Malicious ID**: Create report with ID "....//etc/passwd".
2. **Missing Field**: Create report without `videoUrl`.
3. **Invalid Status**: Try to create report with status "Deleted".
4. **Unauthenticated Read**: Try to list reports without being logged in.
5. **Unauthorized Read**: Try to read reports as a non-warden user.
6. **Ghost Update**: Try to update `reporterId` field on an existing report.
7. **Privilege Escalation**: Try to add self to `/wardens` collection.
8. **Invalid Timestamp**: Try to set `timestamp` to a future date manually (client-side).
9. **Large Payload**: Send a 1MB string in the `description` field.
10. **ID Poisoning**: Use a 2KB string as a document ID.
11. **Impersonation**: Create a report with a `reporterId` that doesn't match `request.auth.uid`.
12. **State Shortcut**: Try to update a `Reviewed` case back to `Sent`.

## Security Rules Implementation Strategy
- Use `isValidIncidentReport()` helper.
- Restrict `read` to users who exist in `/wardens` collection.
- Use `affectedKeys().hasOnly()` for status updates and flagging.
