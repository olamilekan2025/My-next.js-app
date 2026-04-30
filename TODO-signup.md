# Signup Routes Implementation TODO

## Steps:
- [x] 1. Analyze existing files (mongoDB.ts, mailer.ts, signup page)
- [x] 2. Create `/api/signup/route.ts` - API endpoint for signup
- [x] 3. Create `/api/verify-email/route.ts` - API endpoint for email verification
- [x] 4. Update signup page to redirect to verification
- [x] 5. Update verify-email-client to use real API
- [x] 6. Remove hardcoded user from auth-mock.ts

## Progress:
### Step 1: ✅ Analyzed files
- mongoDB.ts: MongoDB connection with global caching
- mailer.ts: Has sendEmailVerificationCode(email, code) function  
- signup/page.tsx: Existing form that calls /api/signup (not implemented)

### Step 2: ✅ Created /api/signup/route.ts
- Accepts user data (firstname, lastname, email, phone, address, password)
- Hashes password with bcrypt
- Stores user to MongoDB (users collection)
- Generates 6-digit verification code
- Sends verification code via sendEmailVerificationCode
- Redirects to email verification page

### Step 3: ✅ Created /api/verify-email/route.ts
- Handles 'verify' action to verify 6-digit code
- Handles 'resend' action to resend verification code
- Updates isEmailVerified flag in MongoDB

### Step 4: ✅ Updated signup page
- After successful API response, redirects to /auth/verify-email?email={email}

### Step 5: ✅ Updated verify-email-client
- Uses /api/verify-email API for verification
- Uses /api/verify-email API for resend

### Step 6: ✅ Cleaned up auth-mock.ts
- Removed hardcoded user from users array
- Kept helper functions (sendLoginCode, verifyLoginToken, etc.)
