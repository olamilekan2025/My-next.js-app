# Fix: Email verification redirect + role login flow

## Information gathered
- User signup page redirects to `/auth/verify-email?email=...` after `/api/signup` succeeds.
- Email verification UI calls `POST /api/verify-email` with `{ action:'verify', email, code }`.
- User login API `/api/auth/user-login`:
  - For `user` role: blocks login when `isEmailVerified` is false and returns `needsEmailVerification`.
  - For `admin`/`sales`: sends `loginVerificationCode` and returns `{ success:true }` (login token flow).
- Admin/sales are not supposed to go through *email verification* page; they should go directly to the login verification token flow.

## Problem hypotheses
- Signup redirect is correct on the client, but login verification behavior suggests role confusion.
- There is a mismatch between email-verify route naming (`/api/verify-email` vs any other verify-email route).

## Plan
1. Fix `/api/auth/user-login` to ONLY require email verification for `role === 'user'`.
   - Ensure admin/sales are never marked `isEmailVerified:false` in a way that causes redirect to email page.
2. Fix `/api/signup` (user signup) to ensure the returned payload always includes the email used for redirect, and that it redirects only when email verification was actually sent.
3. Fix `/api/auth/verify-email` references (if any) so clients consistently call the existing `/api/verify-email` API.
4. Fix login page to redirect users to email verification page only when API says `needsEmailVerification`.
   - Ensure admin/sales login flows do not accidentally include `needsEmailVerification`.
5. Run TypeScript/lint checks.

## Followup steps
- Smoke test:
  - Register as user -> should redirect to email verify page.
  - Login as user with unverified email -> should redirect to email verify page.
  - Register/admin or sales -> should NOT redirect to email verify page; should go to verify-login page.

