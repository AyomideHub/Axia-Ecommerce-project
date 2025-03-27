const {client, sender} = require('../configs/mailtrap.config')

const verificationTokenMail = async (email, token) => {

	const recipients = [
		{
		  email,
		}
	  ];

	try {
		await client.send({
		  from: sender,
		  to: recipients,
		  subject: "verify your email",
		  text: `This is your email verification token ${token}`,
		  category: "email verification",})
		
	} catch (error) {
		console.error(error)
	}
	
}

const ForgetPasswordTokenMail = async (email, PasswordResetToken, url) => {

	const recipients = [
		{
		  email,
		}
	  ];

	try {
		await client.send({
		  from: sender,
		  to: recipients,
		  subject: "Reset Password",
		  text: `Click the link in this mail to reset your password ${url}`,
		  category: "Reset Password",})
		
	} catch (error) {
		console.error(error)
	}
	
}

module.exports = {verificationTokenMail, ForgetPasswordTokenMail}
