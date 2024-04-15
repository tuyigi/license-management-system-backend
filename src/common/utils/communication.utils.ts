/*
This will handle all communication through the system 
 */
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
    url: 'https://api.sendgrid.com/v3/mail/send',
    headers: {
      Authorization:
        'Bearer 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',
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
