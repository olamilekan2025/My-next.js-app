import { sendEmail } from './mailer'

export async function sendWelcomeEmailWithDefaultPassword(params: {
  email: string
  firstname: string
  lastname?: string
  role: 'admin' | 'sales'
  defaultPassword: string
}): Promise<boolean> {
  const { email, firstname, lastname, role, defaultPassword } = params

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .box { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); border-radius: 12px; padding: 18px; text-align: left; margin: 20px 0; }
    .label { opacity: 0.9; font-size: 14px; margin-bottom: 6px; }
    .value { font-family: ui-monospace, SFMono-Regular, Monaco,  "Liberation Mono", "Courier New", monospace; font-size: 22px; letter-spacing: 0.5px; word-break: break-word; }
    .footer { margin-top: 30px; font-size: 14px; opacity: 0.9; }
    .button { background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <h1>👋 Welcome, ${firstname}${lastname ? ` ${lastname}` : ''}!</h1>
    <p>You're registered as <b>${role}</b>. Use the default password below to log in.</p>

    <div class="box">
      <div class="label">Default password</div>
      <div class="value">${defaultPassword}</div>
    </div>

    <p style="margin-top: 10px; font-size: 16px;">For security, consider changing your password after login.</p>

    <a href="${process.env.APP_URL || 'http://localhost:3000'}/auth/login" class="button">Login</a>

    <div class="footer">
      <p>Happy exploring! 💜</p>
      <p>© 2024 My Product</p>
    </div>
  </div>
</body>
</html>`

  return sendEmail({
    to: email,
    subject: `Welcome to My Product (${role})`,
    html,
  })
}

