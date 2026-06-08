const nodemailer = require('nodemailer');

/**
 * Email Service for MakanMate (FYP Scope)
 * Configured for Gmail SMTP using user-provided credentials.
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      },
      connectionTimeout: 5000, // 5 seconds
      greetingTimeout: 5000,   // 5 seconds
      socketTimeout: 5000      // 5 seconds
    });
  }

  /**
   * Send credentials to a new User (StallManager or Admin)
   */
  async sendCredentials(userEmail, userName, tempPassword, userRole) {
    const mailOptions = {
      from: `"MakanMate System" <${process.env.SMTP_EMAIL || process.env.EMAIL}>`,
      to: userEmail,
      subject: 'Welcome to MakanMate - Your Account Credentials',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4D6459;">Welcome, ${userName}!</h2>
          <p>An administrator has created a <strong>${userRole}</strong> account for you on the MakanMate platform.</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong> ${userEmail}</p>
            <p style="margin: 5px 0 0 0;"><strong>Temporary Password:</strong> <span style="color: #d63384; font-family: monospace;">${tempPassword}</span></p>
          </div>
          <p>Please log in and <strong>change your password immediately</strong> to secure your account.</p>
          <p>Access the portal here: <a href="http://localhost:5173/auth/login" style="color: #4D6459; font-weight: bold;">MakanMate Login</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #777;">This is an automated system message. Please do not reply directly to this email.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[Email] Credentials sent to ${userEmail}`);
    } catch (error) {
      console.error(`[Email Error] Failed to send credentials to ${userEmail}:`, error.message);
    }
  }

  /**
   * Send stall assignment notification
   */
  async sendStallAssignment(userEmail, userName, stallName) {
    const mailOptions = {
      from: `"MakanMate System" <${process.env.SMTP_EMAIL || process.env.EMAIL}>`,
      to: userEmail,
      subject: 'Action Required: New Stall Assignment',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4D6459;">Hello ${userName},</h2>
          <p>You have been officially assigned to manage the following stall:</p>
          <div style="background: #eef2f0; border-left: 5px solid #4D6459; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0; color: #4D6459;">${stallName}</h3>
          </div>
          <p>You can now log in to your dashboard to manage the menu, update stall information, and monitor performance.</p>
          <p>Log in to your dashboard: <a href="http://localhost:5173/stall/dashboard" style="color: #4D6459; font-weight: bold;">Go to Dashboard</a></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #777;">MakanMate Administrative Services</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[Email] Assignment notification sent to ${userEmail}`);
    } catch (error) {
      console.error(`[Email Error] Failed to send assignment notification to ${userEmail}:`, error.message);
    }
  }

  /**
   * Send 6-digit OTP for password reset
   */
  async sendOTP(userEmail, otpCode) {
    const mailOptions = {
      from: `"MakanMate System" <${process.env.SMTP_EMAIL || process.env.EMAIL}>`,
      to: userEmail,
      subject: 'MakanMate Password Reset Code',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4D6459;">Password Reset Request</h2>
          <p>You have requested to reset your password. Here is your 6-digit verification code:</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h1 style="letter-spacing: 5px; color: #d63384; margin: 0;">${otpCode}</h1>
          </div>
          <p>This code is valid for 2 minutes. Do not share this code with anyone.</p>
        </div>
      `
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[Email] OTP sent to ${userEmail}`);
    } catch (error) {
      console.error(`[Email Error] Failed to send OTP to ${userEmail}:`, error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();
