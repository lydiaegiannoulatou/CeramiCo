const NewsletterSubscription = require("../models/newsletterModel")
const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function handleContactMessage(req, res) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: email,
    to: 'ceramico.pottery@gmail.com', // Send email to this address
    subject: `New Message from ${name} (${email})`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
}



// Subscribe User (Registered or Not)
async function subscribeUser(req, res) {
  const { email } = req.body;

  // Check if the email is already a registered user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.subscribed) {
      return res.status(400).json({ error: "User is already subscribed." });
    }

    // Update the subscribed field if the user is found
    existingUser.subscribed = true;
    await existingUser.save();
    return res.json({ message: "User successfully subscribed!" });
  }

  // If not a registered user, add to the newsletter subscription list
  const existingSubscription = await NewsletterSubscription.findOne({ email });

  if (existingSubscription) {
    return res.status(400).json({ error: "This email is already subscribed." });
  }

  const newSubscription = new NewsletterSubscription({ email });
  await newSubscription.save();

  res.json({ message: "Guest successfully subscribed!" });
}


module.exports = { subscribeUser, handleContactMessage }