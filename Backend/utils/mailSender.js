// const nodemailer = require("nodemailer");
// const { ses } = require("../config/awsSesConfig");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.SendMail = async ({ to, subject, html }) => {
  try {
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "Sweet Shop",
      },
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error);
    throw error;
  }
};

/* exports.SendMail = async ({to,subject,body})=>{

  const params = {
    Source: process.env.SES_VERIFIED_EMAIL, 
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: body } },
    },
  };

  try{
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent successfully!", result.MessageId);
  } 
  catch (error) {
    console.error("Error sending email:", error);
  }

} */

// exports.SendMail = async ({ to, subject, body }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.HOST,
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//     });

//     const mailResponse = await transporter.sendMail({
//       from: `Property On Rent`,
//       to: `${to}`,
//       subject: `${subject}`,
//       html: `${body}`,
//     });

//     return mailResponse;
//   } catch (err) {
//     console.log("error in nodemailer", err);
//   }
// };
