// email.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';

type MailUser = 'NOREPLY';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private users: Record<MailUser, { user: string; pass: string }>;
  private mailUser: MailUser = 'NOREPLY';
  logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.users = {
      NOREPLY: {
        user: this.configService.get<string>('smtpNoreplyUser'),
        pass: this.configService.get<string>('smtpNoreplyPass'),
      },
    };
    this.transporter = createTransport({
      host: this.configService.get<string>('smtpHost'),
      port: this.configService.get<number>('smtpPort'),
      secure: false,
      auth: this.users[this.mailUser],
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(options: Options): Promise<void> {
    try {
      await this.transporter.sendMail({
        ...options,
        from: this.users[this.mailUser].user,
      });

      this.logger.log({
        message: `Email sent to ${options.to} from ${
          this.users[this.mailUser].user
        }`,
        level: 'debug',
      });
    } catch (error) {
      this.logger.error({
        message: `Failed to send email to ${options.to} from ${
          this.users[this.mailUser].user
        }`,
        level: 'error',
      });

      throw new Error(error);
    }
  }

  withUser(user: MailUser): EmailService {
    this.mailUser = user;
    return this;
  }
}
