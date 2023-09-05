// users/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import mailerConfig from './mailer.config';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailerConfig);
  }

  async sendMail(options: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(options);
  }
}
