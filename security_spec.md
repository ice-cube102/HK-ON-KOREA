# Security Specification: Staff Feedback & Content Management

## 1. Data Invariants
- **FeedbackProposal**:
  - Only authenticated users can submit proposals.
  - `authorUid` must match `request.auth.uid`.
  - Proposals start with status `pending`.
  - Only admin (`galaxynoob102@gmail.com`) can update status to `applied` or `rejected`, or delete proposals.
  - Required fields: `authorName`, `authorUid`, `sectionKey`, `proposedText`, `status`.
  - String length bounds: `authorName <= 100`, `sectionKey <= 100`, `proposedText <= 5000`.
- **SiteOverride**:
  - Readable by all users (public) to display approved custom website content.
  - Writable (create, update, delete) ONLY by verified admin (`galaxynoob102@gmail.com`).
  - Required fields: `sectionKey`, `text`.

## 2. Dirty Dozen Payloads (Adversarial test cases)
1. **Unauthenticated Proposal Creation**: An unauthenticated user attempts to create a proposal document. (Must FAIL with PERMISSION_DENIED)
2. **Identity Spoofing in Proposal**: Authenticated user `user_abc` attempts to set `authorUid: 'user_xyz'`. (Must FAIL)
3. **Ghost Field Injection**: Authenticated user attempts to submit proposal with shadow field `isAdmin: true` or `bypassed: true`. (Must FAIL)
4. **Oversized Proposal Payload**: User attempts to submit `proposedText` exceeding 5000 characters. (Must FAIL)
5. **Unauthorized Status Escalation on Create**: Non-admin user attempts to create a proposal with `status: 'applied'`. (Must FAIL)
6. **Non-admin Proposal Status Change**: Non-admin user attempts to update a proposal's status from `pending` to `applied`. (Must FAIL)
7. **Non-admin Site Override Creation**: Regular authenticated employee attempts to write to `/site_overrides/sec_1`. (Must FAIL)
8. **Public User Site Override Deletion**: Anonymous or regular user tries to delete an active site override. (Must FAIL)
9. **Invalid Document ID Poisoning**: Malicious user attempts to write with path variable containing special characters or >128 chars. (Must FAIL)
10. **Email Spoofing without Verification**: Attacker presents unverified email `galaxynoob102@gmail.com` with `email_verified: false`. (Must FAIL)
11. **Client Delegation List Scraping**: Non-admin user attempts to list all employee proposals across different users. (Must FAIL)
12. **Malicious Empty Fields**: User attempts to submit proposal with empty `proposedText` or missing required keys. (Must FAIL)
