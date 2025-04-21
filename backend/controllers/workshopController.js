const Workshop= require("../models/WorkshopModel");

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
    // Destructure the data from the request body
    const { title, instructor, description, price, duration, startDate, recurringTime, maxSpots, image } = req.body;

    // Validate required fields
    if (!title || !instructor || !description || !price || !duration || !startDate || !recurringTime || !maxSpots) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Ensure the price and maxSpots are numbers
    if (typeof price !== 'number' || typeof maxSpots !== 'number') {
      return res.status(400).json({ error: "Price and maxSpots must be numbers." });
    }

    // Parse startDate if it's a string (e.g., datetime-local input)
    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate)) {
      return res.status(400).json({ error: "Invalid start date format." });
    }

    // Calculate the sessions based on recurringTime (e.g., every Monday at 5 PM)
    const sessions = generateSessions(parsedStartDate, recurringTime);

    // Create the new class object
    const newClass = new Class({
      title,
      image, // Optional field
      instructor,
      description,
      price,
      duration,
      startDate: parsedStartDate,
      recurringTime,
      maxSpots,
      sessions, // Add the generated sessions to the class
    });

    // Save the class to the database
    const savedClass = await newClass.save();

    // Send a success response
    res.status(201).json(savedClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Failed to create class", details: error.message });
  }
};

// Helper function to generate sessions based on recurring time
const generateSessions = (startDate, time) => {
  const sessions = [];
  const currentDate = new Date(startDate);

  // Use provided time like "17:00"
  const [hours, minutes] = time.split(":").map(Number);

  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0);

  const endDate = new Date(currentDate);
  endDate.setMonth(currentDate.getMonth() + 2);

  while (currentDate <= endDate) {
    sessions.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return sessions;
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
