
const transporter=require('../config/EmailConfig')
async function sendUserCredentials(user, plainPassword) {
  try {
    await transporter.sendMail({
      from: `" Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Login Credentials",
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Your account has been created successfully.</p>
        <p>Here are your login credentials:</p>
        <ul>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Password:</strong> ${plainPassword}</li>
        </ul>
        <p>You can login here: <a href="http://localhost:5000/">Login Page</a></p>
        <br/>
        <p>Regards,<br/>Admin Team</p>
      `
    });
    console.log("✅ Credentials email sent:", user.email);
  } catch (err) {
    console.error("❌ Error sending credentials:", err);
  }
}

module.exports = { sendUserCredentials };