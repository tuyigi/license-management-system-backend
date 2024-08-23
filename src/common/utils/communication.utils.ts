/*
This will handle all communication through the system 
 */
import * as process from 'process';

export async function sendEmail(email: string, content: string) {
  const axios = require('axios');
  const data = JSON.stringify({
    personalizations: [
      {
        to: [
          {
            email: `${email}`,
          },
        ],
      },
    ],
    from: {
      email: 'gtuyishime@bnr.rw',
    },
    subject: 'License MIS',
    content: [
      {
        type: 'text/plain',
        value: `${content}`,
      },
    ],
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.SENDGRIP_TOKEN}`,
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(response.status);
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function sendEmailV2(): Promise<boolean> {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0);
  const nodemailer = require('nodemailer');
  // create transporter object with smtp server details
  const transporter = nodemailer.createTransport({
    host: '172.16.1.120',
    port: 25,
    secure: false,
    auth: {
      user: 'bnrw\\ecor-uat',
      pass: '3c0R#U@7_2021#',
    },
  });

  // send email
  await transporter.sendMail({
    from: 'ecor-uat@bnr.rw',
    to: 'tuyigilbert97@gamil.com',
    subject: 'Test Email Subject',
    text: 'Example Plain Text Message Body',
  });
  return true;
}
