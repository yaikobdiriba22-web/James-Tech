# Security Specification for James Tech Database

## Data Invariants
1. **Projects (showcase)**:
   - Anyone (anonymous/public) can read and list projects.
   - Only authenticated administrators (such as `yaikobdiriba22@gmail.com`) can create, update, or delete projects.
   - Project IDs must be valid alphanumeric strings.
   - Strict field matching is required on creation.

2. **Contact Messages**:
   - Anyone can submit (create) a contact message.
   - Only authenticated administrators can read, list, update, or delete contact messages.
   - Contact messages are immutable after creation, except for the `status` field (unread, read, archived) which only admins can update.

3. **Admins**:
   - Only authenticated users who are administrators can read/list/write the admin list.
   - Admin email `yaikobdiriba22@gmail.com` is bootstrapped as the system master admin.

---

## The "Dirty Dozen" Threat Payloads

1. **Anonymous Project Creation**: A guest attempt to insert a fake project to deface the website.
2. **Standard User Project Deletion**: A standard signed-in non-admin user attempts to delete a project document.
3. **Admin Role Self-Escalation**: A user tries to create a document in `admins` with their own UID and `role: "admin"`.
4. **Project State Tampering**: An admin update that includes unapproved fields (e.g., trying to set a `ghostField` or inject invalid data).
5. **Project ID Poisoning**: Trying to create a project with a 2KB junk character string as the Document ID.
6. **Malicious Contact Message Reading**: A standard user or anonymous user attempts to retrieve/query standard contact messages of other clients.
7. **Contact Message Deletion by Submitter**: A guest user submits a contact form and immediately attempts to delete it to cover tracks.
8. **Contact Message Spoofing**: Submitting a contact message with a `createdAt` timestamp set in the future rather than using the server timestamp `request.time`.
9. **Project Creation Missing Fields**: Creating a project document lacking the `category` or `technologies` fields.
10. **Unauthenticated Admin Querying**: A non-logged-in user attempting to query the list of system admins.
11. **Malicious Contact Message Status Hijacking**: A guest sender trying to update their own message status to "archived".
12. **Project CreatedAt Modification**: An admin attempting to rewrite the `createdAt` timestamp of a project during an update (immutable field check).

---

## Test Runner Specification

The rules will be verified in `firestore.rules` and tested via strict application logic.
All threat payloads must return `PERMISSION_DENIED`.
