// sendEmail.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iradukundacarine14@gmail.com',
    pass: 'pezyufhlkykuzobt',
  },
});

function sendEmails(
  emailAddresses: string | any[],
  subjects: any,
  message: any,
) {
  console.log('recipients: ' + emailAddresses);
  return new Promise((resolve, reject) => {
    if (!Array.isArray(emailAddresses)) {
      emailAddresses = [emailAddresses]; // Convert to array if it's not already
    }
    const promises = emailAddresses.map((email: any) => {
      return new Promise((resolveEmail, rejectEmail) => {
        const mailOptions = {
          from: 'iradukundacarine14@gmail.com',
          to: email,
          subject: subjects,
          text: message,
        };

        transporter.sendMail(
          mailOptions,
          function (error: any, info: { response: unknown }) {
            if (error) {
              rejectEmail(error);
            } else {
              resolveEmail(info.response);
            }
          },
        );
      });
    });

    Promise.all(promises)
      .then((responses) => resolve(responses))
      .catch((error) => reject(error));
  });
}

module.exports = sendEmails;
