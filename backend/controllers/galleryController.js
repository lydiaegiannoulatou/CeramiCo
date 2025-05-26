const cloudinary = require("../config/cloudinary");

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
    const publicId = req.params.id; 
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "not found") {
      return res
        .status(404)
        .json({ error: "Image not found or already deleted." });
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
