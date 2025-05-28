const nodemailer = require('nodemailer');
const User = require("../models/userModel");
const NewsletterSubscription = require("../models/newsletterModel");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* ────────────── NEWSLETTER ────────────── */
async function sendNewsletter(req, res) {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: "Subject and message are required." });
  }

  try {
    const enrolledUsers = await User.find({ enrolled: true }, "email");
    const userEmails = enrolledUsers.map(user => user.email);

    const guestSubscribers = await NewsletterSubscription.find({}, "email");
    const guestEmails = guestSubscribers.map(sub => sub.email);

    const allEmails = [...new Set([...userEmails, ...guestEmails])];

    if (!allEmails.length) {
      return res.status(404).json({ error: "No subscribers found." });
    }

    await transporter.sendMail({
      from: `"Pottery Studio" <${process.env.MAIL_USER}>`,
      bcc: allEmails,
      subject,
      text: message,
    });

    res.json({ message: "Newsletter sent successfully!" });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ error: "Failed to send newsletter." });
  }
}

/* ────────────── CONTACT FORM ────────────── */
async function handleContactMessage(req, res) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: email,
    to: 'ceramico.pottery@gmail.com',
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

/* ────────────── SUBSCRIBE TO NEWSLETTER ────────────── */
async function subscribeUser(req, res) {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.enrolled) {
      return res.status(400).json({ error: "User is already subscribed." });
    }

    existingUser.enrolled = true;
    await existingUser.save();
    return res.json({ message: "User successfully subscribed!" });
  }

  const existingSubscription = await NewsletterSubscription.findOne({ email });

  if (existingSubscription) {
    return res.status(400).json({ error: "This email is already subscribed." });
  }

  const newSubscription = new NewsletterSubscription({ email });
  await newSubscription.save();

  res.json({ message: "Guest successfully subscribed!" });
}

/* ────────────── ORDER CONFIRMATION ────────────── */
async function sendOrderConfirmationEmail(user, orderDetails) {
  const mailOptions = {
    from: `"CeramiCo Pottery Studio" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Your Pottery Order Confirmation",
    text: `Hi ${user.name || 'Customer'},\n\nThank you for your order!\n\nOrder Details:\n${orderDetails}\n\nWe'll notify you once it's shipped.\n\nBest regards,\nCeramico Pottery Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation sent to:", user.email);
  } catch (error) {
    console.error("Error sending order confirmation:", error);
  }
}

/* ────────────── WORKSHOP CONFIRMATION ────────────── */
async function sendWorkshopBookingConfirmationEmail(user, bookingDetails) {
  const mailOptions = {
    from: `"Pottery Studio" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Your Workshop Booking Confirmation",
    text: `Hi ${user.name || 'Participant'},\n\nThanks for booking a workshop with us!\n\nWorkshop Details:\n${bookingDetails}\n\nLooking forward to seeing you!\n\nBest,\nCeramico Pottery Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Workshop booking confirmation sent to:", user.email);
  } catch (error) {
    console.error("Error sending workshop confirmation:", error);
  }
}

module.exports = {
  subscribeUser,
  handleContactMessage,
  sendNewsletter,
  sendOrderConfirmationEmail,
  sendWorkshopBookingConfirmationEmail,
};
