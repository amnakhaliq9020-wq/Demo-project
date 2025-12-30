import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendVerificationEmail = async (email, fullname, verificationToken, userId) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email not configured. Skipping email send.');
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify/${userId}/${verificationToken}`;

    const mailOptions = {
      from: `"VidShare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your VidShare Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #14b8a6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to VidShare!</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullname},</h2>
              <p>Thank you for signing up for VidShare! Please verify your email address to complete your registration.</p>
              <p>Click the button below to verify your email:</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #14b8a6;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 VidShare. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

export const testEmailConfig = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return false;
    }
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to send emails');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};
