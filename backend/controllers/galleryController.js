const cloudinary = require("../config/cloudinary");

/* ──────────────  GALLERY  ────────────── */

// List only images in the 'Gallery' folder
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

// Secure upload signature generation
function getUploadSignature(req, res) {
  try {
    const allowedFolders = ["Gallery", "Products"];
    const requestedFolder = req.body.folder || req.query.folder || "Gallery";

    // Validate the folder to prevent unauthorized uploads
    if (!allowedFolders.includes(requestedFolder)) {
      return res.status(400).json({ error: "Invalid folder specified." });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { folder: requestedFolder, timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      folder: requestedFolder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    console.error("Signature error:", err);
    res.status(500).json({ error: "Failed to generate signature." });
  }
}

// Delete image from Cloudinary
async function deleteImage(req, res) {
  try {
    const publicId = req.params.id;
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "not found") {
      return res.status(404).json({ error: "Image not found or already deleted." });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete image." });
  }
}

/* ──────────────  EXPORTS  ────────────── */
module.exports = {
  listGallery,
  getUploadSignature,
  deleteImage,
};
