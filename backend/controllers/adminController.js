const User = require("../models/userModel");
const nodemailer = require("nodemailer");


const newsletter = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: "Subject and message are required." });
  }

  try {
    const enrolledUsers = await User.find({ enrolled: true });

    if (!enrolledUsers.length) {
      return res.status(404).json({ error: "No enrolled users found." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // or your mail service
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const emails = enrolledUsers.map((user) => user.email);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: emails,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Newsletter sent successfully!" });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ error: "Failed to send newsletter." });
  }
};

module.exports = newsletter;
