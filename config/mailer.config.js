const nodemailer = require("nodemailer");

const host = process.env.HOST || "https://iron-appyhour.herokuapp.com";
const user = process.env.NM_USER;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: process.env.NM_PASS,
  },
});

module.exports.sendValidationEmail = ({ name, email, id, activationToken }) => {
  transport
    .sendMail({
      to: email,
      from: `AppyHour team <${user}>`,
      subject: "Activate your account!",
      html: `
			<h1>Hi ${name}</h1>
			<p>Click on the button below to activate your account ❤️</p>
			<a href="${host}/users/${id}/activate/${activationToken}" style="padding: 10px 20px 20px 20px; margin-bottom: 30px; color: white; background-color: #E9082A; border-radius: 5px;">Click here</a>
		`,
    })
    .then(console.log)
    .catch(console.error);
};
