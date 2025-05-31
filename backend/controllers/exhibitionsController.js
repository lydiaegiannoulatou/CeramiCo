const Exhibition = require("../models/exhibitionModel");

// Get all exhibitions
const getAllExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find().sort({ startDate: -1 });
    res.status(200).json(exhibitions);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch exhibitions", error });
  }
};

// Get single exhibition by ID
const getExhibitionById = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition)
      return res.status(404).json({ msg: "Exhibition not found" });

    res.status(200).json(exhibition);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch exhibition", error });
  }
};

// Add a new exhibition (admin only)
const addExhibition = async (req, res) => {
  try {
    const newExhibition = new Exhibition(req.body);
    await newExhibition.save();
    res
      .status(201)
      .json({ msg: "Exhibition created", exhibition: newExhibition });
  } catch (error) {
    res.status(400).json({ msg: "Failed to create exhibition", error });
  }
};

// Update exhibition (admin only)
const updateExhibition = async (req, res) => {
  try {
    const updated = await Exhibition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) return res.status(404).json({ msg: "Exhibition not found" });

    res.status(200).json({ msg: "Exhibition updated", exhibition: updated });
  } catch (error) {
    res.status(500).json({ msg: "Failed to update exhibition", error });
  }
};

// Delete exhibition (admin only)
const deleteExhibition = async (req, res) => {
  try {
    const deleted = await Exhibition.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Exhibition not found" });

    res.status(200).json({ msg: "Exhibition deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete exhibition", error });
  }
};

module.exports = {
  getAllExhibitions,
  getExhibitionById,
  addExhibition,
  updateExhibition,
  deleteExhibition,
};
