const Class = require("../models/classModel");

//ALL CLASSES
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ date: 1 }); // Sorted by date
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes", details: error.message });
  }
};

// CLASS BY ID
const getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json(classItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch class", details: error.message });
  }
};

//ADD NEW CLASS (ADMIN)
const createClass = async (req, res) => {
  try {
    const { title, instructor, description, price, duration, date, maxSpots } = req.body;

    const newClass = new Class({
      title,
      instructor,
      description,
      price,
      duration,
      date,
      maxSpots,
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(500).json({ error: "Failed to create class", details: error.message });
  }
};

//UPDATE CLASS (ADMIN)
const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: "Failed to update class", details: error.message });
  }
};

//DELETE CLASS(ADMIN)
const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete class", details: error.message });
  }
};

const getClassesForCalendar = async (req, res) => {
    try {
      const classes = await Class.find({ date: { $gte: new Date() } });
  
      const calendarEvents = classes.map((classItem) => ({
        id: classItem._id,
        title: classItem.title,
        start: classItem.date,
        extendedProps: {
          instructor: classItem.instructor,
          price: classItem.price,
          description: classItem.description,
          availableSpots: classItem.maxSpots - classItem.bookedSpots,
        },
      }));
  
      res.status(200).json(calendarEvents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calendar classes", details: error.message });
    }
  };
  

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassesForCalendar,
};
