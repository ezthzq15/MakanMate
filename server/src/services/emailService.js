const nodemailer = require('nodemailer');

/**
 * Email Service for MakanMate (FYP Scope)
 * Uses SMTP-based delivery via Nodemailer.
 */
class EmailService {
  constructor() {
    // Configure your SMTP settings here (e.g., Mailtrap, Gmail, etc.)
    // For FYP, we can use environment variables.
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });
  }

  /**
   * Send credentials to a new StallManager
   */
  async sendCredentials(userEmail, userName, tempPassword) {
    const mailOptions = {
      from: '"MakanMate Admin" <admin@makanmate.com>',
      to: userEmail,
      subject: 'Your MakanMate Account Credentials',
      html: `
        <h1>Welcome, ${userName}!</h1>
        <p>Your Stall Manager account has been created successfully.</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please login and change your password immediately.</p>
        <br/>
        <p>Best Regards,<br/>MakanMate Team</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Credential email sent to ${userEmail}`);
    } catch (error) {
      console.error(`Failed to send credential email to ${userEmail}:`, error.message);
      // We log but don't throw to allow account creation to proceed as per plan
    }
  }

  /**
   * Send stall assignment notification
   */
  async sendStallAssignment(userEmail, stallName) {
    const mailOptions = {
      from: '"MakanMate Admin" <admin@makanmate.com>',
      to: userEmail,
      subject: 'Stall Assigned - MakanMate',
      html: `
        <h1>New Assignment</h1>
        <p>You have been assigned to manage the following stall: <strong>${stallName}</strong>.</p>
        <p>You can now log in to manage the menu for this stall.</p>
        <br/>
        <p>Best Regards,<br/>MakanMate Team</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Assignment email sent to ${userEmail}`);
    } catch (error) {
      console.error(`Failed to send assignment email to ${userEmail}:`, error.message);
    }
  }
}

module.exports = new EmailService();
