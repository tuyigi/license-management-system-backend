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
