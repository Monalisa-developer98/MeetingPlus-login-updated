const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'monalisamahanta98@gmail.com',
      pass: 'ccnnvyabddelnehj',
    },
});

const mailOptions = {
  from: `${process.env.FROM_EMAIL}`,
  to: '', 
  subject: 'Your OTP for Verification', 
  html: '<b>Welcome to Demo App !!! :</b>', 
  attachments: []
};

module.exports = {
  transporter, mailOptions,
};