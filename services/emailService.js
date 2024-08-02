const { transporter, mailOptions } = require("../emailSetUp/mailSetup");

/**FUNC- TO SEND EMAIL TO USER */
const sendEmail = async (email, emailSubject, mailData, attachedFileDetails = []) => {
  const mailOptionsInfo = {
    from: mailOptions,
    to: email,
    subject: emailSubject,
    html: mailData,
    attachments: attachedFileDetails,
  };
    console.log(mailOptionsInfo);
    const isSuccess = await transporter.sendMail(mailOptionsInfo);
    console.log("isSuccess-------------", isSuccess);
    return isSuccess;
};

module.exports = {
  sendEmail,
};
