import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendContractFeedbackEmail(
    email: string,
    status: string,
    contract_no: string,
    reason: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'CONTRACTS LICENSE APPROVAL FEEDBACK',
      text: `Dear Team,\nKindly note that the license with contract number ${contract_no} has been ${status}.\nWith reason "${reason}".`,
    };
    await this.transporter.sendMail(mailOptions);
  }
  async sendLicenseFeedbackEmail(
    email: string,
    status: string,
    licenseName: string,
    reason: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'LICENSE APPROVAL FEEDBACK',
      text: `Dear Team,\nKindly note that the license with name : ${licenseName} ;has been ${status}.\nWith reason "${reason}".`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  //Expiration reminder email for contracts
  async sendContractReminderEmail(
    email: string,
    contract_no: string,
    endDate: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'CONTRACTS EXPIRATION REMINDER',
      text: `Dear Team,\nKindly note that the contract with contract number ${contract_no} expires on ${endDate}.`,
    };
    await this.transporter.sendMail(mailOptions);
  }
  //Expiration reminder email certificates
  async sendCertificatesReminderEmail(
    email: string,
    certificate: string,
    endDate: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'CERTIFICATES EXPIRATION REMINDER',
      text: `Dear Team,\nKindly note that the certificate  ${certificate} expires on ${endDate}.`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
