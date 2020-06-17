const nodemailer = require('nodemailer');

module.exports.sendMail = ({
  mailFrom,
  mailTo,
  subject,
  cc = null,
  bcc = null,
  body,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env.SENDINBLUE_HOST,
        port: parseInt(process.env.SENDINBLUE_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SENDINBLUE_USER,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });

      const message = {
        from: mailFrom,
        to: mailTo,
        subject: subject,
        text: body,
        html: body,
        cc,
        bcc,
      };

      await transporter.sendMail(message);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
