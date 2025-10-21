# TODO: Remove Role Column and Trainer/Admin Related Code

## Tasks
- [x] Update fitpro.sql: Remove role column from users table
- [x] Update server.js: Remove role-related endpoints (/members, /users, /change-role, /trainer-stats, /admin-stats) and role checks in signup/login
- [x] Update dashboard.js: Remove role-based redirects and trainer/admin dashboard functions, simplify to only member dashboard
- [x] Update home.js: Remove role-based redirects, always redirect to member-dashboard.html for logged-in users
- [x] Update about.html: Remove mention of multi-role support
- [x] Update alter_role.js: Comment out or remove content
- [x] Run updated SQL script to alter the database
- [x] Test signup, login, and dashboard access
- [x] Verify no role-related errors in console
