# Separate Routes for Resend Functionality

## Steps (0/5 completed)

- [x] 1. Create `src/app/api/auth/resend-login-code/route.ts` - Dedicated POST route for resending login verification code
- [x] 2. Edit `src/app/api/auth/verify-login/route.ts` - Remove resend action handler, keep only verify
- [x] 3. Edit `src/app/auth/verify-login/verify-login-client.tsx` - Update handleResend fetch to new endpoint
- [x] 4. Edit `src/app/auth/login/page.tsx` - Update login submit resend fetch to new endpoint  
- [x] 5. Test the flow and mark complete

**Task complete! Routes separated successfully.**

**Next step: Create resend-login-code route**

