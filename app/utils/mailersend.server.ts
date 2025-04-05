import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  cc?: string[];
  bcc?: string[];
}

interface SMTPError extends Error {
  code?: string;
  response?: string;
  responseCode?: number;
  command?: string;
}

class MailerSendService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!process.env.MAILERSEND_SMTP_USER || !process.env.MAILERSEND_SMTP_PASSWORD) {
      throw new Error('MailerSend SMTP credentials not configured');
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.MAILERSEND_SMTP_HOST || 'smtp.mailersend.net',
      port: parseInt(process.env.MAILERSEND_SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.MAILERSEND_SMTP_USER,
        pass: process.env.MAILERSEND_SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production' // Only reject in production
      },
      logger: process.env.NODE_ENV !== 'production',
      debug: process.env.NODE_ENV !== 'production'
    });
  }

  private isSMTPError(error: unknown): error is SMTPError {
    return error instanceof Error && 'code' in error;
  }

  async sendMail(options: MailOptions): Promise<SentMessageInfo> {
    try {
      const mailOptions = {
        from: `"${process.env.MAILERSEND_FROM_NAME || 'App'}" <${process.env.MAILERSEND_FROM_EMAIL}>`,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
        headers: {
          'X-MailerSend-Track-Opens': 'true',
          'X-MailerSend-Track-Clicks': 'true'
        }
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error: unknown) {
      if (this.isSMTPError(error)) {
        console.error('MailerSend SMTP Error:', {
          code: error.code,
          command: error.command,
          responseCode: error.responseCode
        });
        throw new Error(`Email failed: ${error.response || error.message}`);
      }
      console.error('Unexpected mail error:', error);
      throw new Error('Failed to send email due to unexpected error');
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error: unknown) {
      if (this.isSMTPError(error)) {
        console.error('Connection verification failed:', {
          code: error.code,
          response: error.response
        });
      }
      return false;
    }
  }
}

export const mailerSend = new MailerSendService();

// Verify connection on startup in development
if (process.env.NODE_ENV === 'development') {
  mailerSend.verifyConnection()
    .then(verified => console.log(`MailerSend connection ${verified ? 'verified' : 'failed'}`))
    .catch(err => console.error('Startup verification error:', err));
}