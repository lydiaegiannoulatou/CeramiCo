const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinary");

/* ──────────────  NEWSLETTER  ────────────── */
async function sendNewsletter(req, res) {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: "Subject and message are required." });
  }

  try {
    const subscribers = await User.find({ enrolled: true }, "email");
    if (!subscribers.length) {
      return res.status(404).json({ error: "No enrolled users found." });
    }

    // In production swap to OAuth2 credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Pottery Studio" <${process.env.MAIL_USER}>`,
      to: subscribers.map((u) => u.email),
      subject,
      text: message,
    });

    res.json({ message: "Newsletter sent successfully!" });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ error: "Failed to send newsletter." });
  }
}

/* ──────────────  GALLERY  ────────────── */
async function listGallery(req, res) {
  try {
    const data = await cloudinary.search
      .expression("folder:Gallery")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    res.json(data.resources || []);
  } catch (err) {
    console.error("Gallery list error:", err);
    res.status(500).json({ error: "Failed to list images." });
  }
}

function getUploadSignature(req, res) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "Gallery";
    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error("Signature error:", err);
    res.status(500).json({ error: "Failed to generate signature." });
  }
}

async function deleteImage(req, res) {
  try {
    const result = await cloudinary.uploader.destroy(req.params.id);
    if (result.result === "not found") {
      return res.status(403).json({ error: "Image not found or already deleted." });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete image." });
  }
}

/* ──────────────  EXPORTS  ────────────── */
module.exports = {
  sendNewsletter,
  listGallery,
  getUploadSignature,
  deleteImage,
};
