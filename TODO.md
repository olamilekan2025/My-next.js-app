# TODO

- [x] Diagnose why email reset link contains token instead of 6-digit code.
- [x] Replace reset token flow with 6-digit reset code flow (server + email).
- [x] Update forgot-password API to generate and store 6-digit code (with 1h expiry).
- [x] Update resend-reset-password API to re-generate and re-send 6-digit code.
- [x] Update reset-password API to validate submitted 6-digit code and then reset password.
- [x] Update reset-password UI to accept 6-digit code and submit `{ code, email, newPassword }`.
- [ ] Run `npm run lint` and fix any remaining TypeScript/ESLint issues.
- [ ] Run a quick manual test: request reset, confirm email shows 6-digit code, reset succeeds.

