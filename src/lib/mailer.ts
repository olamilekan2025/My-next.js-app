import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(options: nodemailer.SendMailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"My Product" <noreply@oladunjoyejeleel@gmail.com>',
      ...options,
    });
    console.log(`✅ Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

export async function sendLoginVerificationCode(email: string, code: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f8f9fa; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .code { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; margin: 20px 0; display: inline-block; font-family: monospace; }
    .button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
    .footer { margin-top: 30px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔐 Login Verification</h1>
    <p>Enter this 6-digit code to verify your login on your device.</p>
    <div class="code">${code}</div>
    <p style="font-size: 16px;">This code expires in 5 minutes.</p>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/auth/verify-login" class="button">Verify Login</a>
    <div class="footer">
      <p>If you didn't request this, ignore this email.</p>
      <p>© 2024 My Product</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: email, subject: 'Login Verification Code', html });
}

export async function sendEmailVerificationCode(email: string, code: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f8f9fa; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .code { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; margin: 20px 0; display: inline-block; font-family: monospace; }
    .button { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
    .footer { margin-top: 30px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📧 Verify Your Email</h1>
    <p>Thank you for signing up! Use this code to verify your email address.</p>
    <div class="code">${code}</div>
    <p style="font-size: 16px;">This code expires in 10 minutes.</p>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/auth/verify-email" class="button">Verify Email</a>
    <div class="footer">
      <p>Need help? Contact support.</p>
      <p>© 2024 My Product</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: email, subject: 'Email Verification Code', html });
}

export async function sendPasswordResetCode(email: string, token: string): Promise<boolean> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont,  Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f8f9fa; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .button { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
    .footer { margin-top: 30px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔑 Reset Your Password</h1>
    <p>Click the button below to reset your password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p style="font-size: 14px; margin-top: 20px;">If the button doesn't work, copy this link: ${resetUrl}</p>
    <div class="footer">
      <p>If you didn't request this, ignore this email.</p>
      <p>© 2024 My Product</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: email, subject: 'Password Reset Request', html });
}

export async function sendWelcomeEmail(email: string, firstname: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont,  Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .button { background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
    .footer { margin-top: 30px; font-size: 14px; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 Welcome, ${firstname}!</h1>
    <p>Thanks for joining My Product. Get started by exploring your dashboard.</p>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/products" class="button">Get Started</a>
    <div class="footer">
      <p>Happy exploring! 👋</p>
      <p>© 2024 My Product</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: email, subject: `Welcome to My Product, ${firstname}!`, html });
}

