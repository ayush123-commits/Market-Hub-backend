export const welcomeEmail = (name) => {
  return {
    subject: "Welcome to Market Hub!",
    
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <h1>Welcome to Market Hub, ${name}! 🎉</h1>

            <p>
              Thanks for joining Market Hub.
              We're happy to have you with us.
            </p>

            <p>
              You can now explore products, manage your cart,
              place orders, and more.
            </p>

            <p>
              Happy shopping!
            </p>

            <p>
              — The Market Hub Team
            </p>

          </div>
        </body>
      </html>
    `,

    text: `
Welcome to Market Hub, ${name}!

Thanks for joining Market Hub.
We're happy to have you with us.

Happy shopping!

— The Market Hub Team
    `
  };
};


export const verificationCodeEmail = (code) => {
  return {
    subject: "Verify your Market Hub email",

    text: `
Your Market Hub verification code is: ${code}

This code will expire in 5 minutes.

If you did not request this code, you can safely ignore this email.
    `,

    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial,sans-serif;">
          <div style="max-width:600px; margin:40px auto; background:white; padding:40px; border-radius:12px;">
            
            <h1 style="margin-bottom:20px;">
              Verify your email
            </h1>

            <p>
              Thank you for joining Market Hub.
              Use the verification code below to verify your email address.
            </p>

            <div style="margin:30px 0; text-align:center;">
              <span style="font-size:32px; font-weight:bold; letter-spacing:6px;">
                ${code}
              </span>
            </div>

            <p>
              This code will expire in <strong>5 minutes</strong>.
            </p>

            <p>
              If you did not request this code, you can safely ignore this email.
            </p>

            <p style="margin-top:30px;">
              — The Market Hub Team
            </p>

          </div>
        </body>
      </html>
    `
  };
};


export const passwordResetCodeEmail = (code) => {
  const currentYear = new Date().getFullYear();
  const brandName = "Market Hub";

  return {
    subject: `Reset your ${brandName} password`,

    text: `
Hi there,

We received a request to reset the password for your ${brandName} account.

Your password reset code is:

    ${code}

This code will expire in 5 minutes. For your security, do not share this code with anyone.

If you did not request a password reset, you can safely ignore this email. Your password will not be changed unless this code is successfully used.

Need help? Contact our support team.

— The ${brandName} Team
© ${currentYear} ${brandName}. All rights reserved.
    `.trim(),

    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your ${brandName} password</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,Helvetica,sans-serif; color:#333333; line-height:1.6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td style="padding:32px 40px 0 40px;">
                <h1 style="margin:0; font-size:22px; font-weight:700; color:#111111;">
                  Reset your password
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:16px 40px 0 40px; font-size:15px; color:#444444;">
                <p style="margin:0 0 16px 0;">Hi there,</p>
                <p style="margin:0 0 24px 0;">
                  We received a request to reset the password for your ${brandName} account.
                  Enter the verification code below to continue:
                </p>

                <!-- Code box -->
                <div style="text-align:center; margin:0 0 24px 0;">
                  <div style="display:inline-block; padding:16px 32px; background-color:#f0f4ff; border:1px solid #d6e0ff; border-radius:10px; font-size:28px; font-weight:700; letter-spacing:6px; color:#1a3dcc; font-family:'Courier New',monospace;">
                    ${code}
                  </div>
                </div>

                <p style="margin:0 0 16px 0; font-size:14px; color:#666666;">
                  ⏱ This code will expire in <strong>5 minutes</strong>. For your security, never share this code with anyone.
                </p>

                <p style="margin:0 0 24px 0; font-size:14px; color:#666666;">
                  If you did not request a password reset, you can safely ignore this email. Your password will not be changed unless this code is successfully used.
                </p>

                <p style="margin:0; font-size:14px; color:#666666;">
                  Need help? Contact our support team.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px 32px 40px; border-top:1px solid #eeeeee; margin-top:24px;">
                <p style="margin:0; font-size:13px; color:#888888;">
                  — The ${brandName} Team
                </p>
                <p style="margin:8px 0 0 0; font-size:12px; color:#aaaaaa;">
                  © ${currentYear} ${brandName}. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim(),
  };
};

export const accountVerifiedEmail = () => {
  const currentYear = new Date().getFullYear();
  const brandName = "Market Hub";
  const appUrl= "Lululu LaLiLo"
  return {
    subject: `Your ${brandName} account is verified 🎉`,

    text: `
Hi there,

Great news — your email address has been successfully verified. Your ${brandName} account is now fully active.

You can now:
  • Sign in and access your dashboard
  • List and browse items on the marketplace
  • Message other users securely


If you did not create a ${brandName} account, please contact our support team immediately.

— The ${brandName} Team
© ${currentYear} ${brandName}. All rights reserved.
    `.trim(),

    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your ${brandName} account is verified</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,Helvetica,sans-serif; color:#333333; line-height:1.6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

            <!-- Header -->
            <tr>
              <td style="padding:32px 40px 0 40px; text-align:center;">
                <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:50%; background-color:#e6f7ee; font-size:28px;">
                  ✅
                </div>
                <h1 style="margin:16px 0 0 0; font-size:22px; font-weight:700; color:#111111;">
                  Your account is verified
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:16px 40px 0 40px; font-size:15px; color:#444444;">
                <p style="margin:0 0 16px 0;">Hi there,</p>
                <p style="margin:0 0 24px 0;">
                  Great news — your email address has been successfully verified.
                  Your ${brandName} account is now fully active.
                </p>

                <p style="margin:0 0 12px 0; font-weight:600; color:#111111;">You can now:</p>
                <ul style="margin:0 0 24px 0; padding-left:20px; color:#444444;">
                  <li style="margin-bottom:6px;">Sign in and access your dashboard</li>
                  <li style="margin-bottom:6px;">List and browse items on the marketplace</li>
                  <li style="margin-bottom:6px;">Message other users securely</li>
                </ul>

                <!-- CTA button -->
                <div style="text-align:center; margin:0 0 24px 0;">
                  <a href="${appUrl}"
                     style="display:inline-block; padding:14px 32px; background-color:#1a3dcc; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px;">
                    Sign in to ${brandName}
                  </a>
                </div>

                <p style="margin:0 0 16px 0; font-size:13px; color:#888888; word-break:break-all;">
                  Or paste this link into your browser:<br />
                  <a href="${appUrl}" style="color:#1a3dcc;">${appUrl}</a>
                </p>

                <p style="margin:0; font-size:14px; color:#666666;">
                  If you did not create a ${brandName} account, please
                  contact our support team immediately.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px 32px 40px; border-top:1px solid #eeeeee;">
                <p style="margin:0; font-size:13px; color:#888888;">
                  — The ${brandName} Team
                </p>
                <p style="margin:8px 0 0 0; font-size:12px; color:#aaaaaa;">
                  © ${currentYear} ${brandName}. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim(),
  };
};
