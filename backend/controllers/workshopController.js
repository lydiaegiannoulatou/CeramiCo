const Workshop= require("../models/workshopModel");

//ALL CLASSES
const getAllClasses = async (req, res) => {
  try {
    const classes = await Workshop.find().sort({ date: 1 }); // Sorted by date
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch classes", details: error.message });
  }
};

// CLASS BY ID
// GET workshop by ID (with session availability)
const getClassById = async (req, res) => {
  try {
    const classItem = await Workshop.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    console.log("Workshop fetched:", classItem);  // Log the workshop item

    // Calculate available spots for each session
    const sessionsWithAvailability = classItem.sessions.map((session) => {
      console.log("Processing session:", session); // Log each session to see if sessionDate is available

      return {
        sessionDate: session.sessionDate, // Log if sessionDate is coming through correctly
        bookedSpots: session.bookedSpots,
        availableSpots: classItem.maxSpots - session.bookedSpots,
        _id: session._id,
      };
    });

    console.log("Sessions with availability:", sessionsWithAvailability); // Log the final result

    const workshopWithSessions = {
      ...classItem.toObject(),
      sessions: sessionsWithAvailability,
    };

    res.status(200).json(workshopWithSessions);
  } catch (error) {
    console.error("Error in getClassById:", error);
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
    const newClass = new Workshop({
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

  const [hours, minutes] = time.split(":").map(Number);
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0);

  const endDate = new Date(currentDate);
  endDate.setMonth(currentDate.getMonth() + 2);

  while (currentDate <= endDate) {
    sessions.push({ sessionDate: new Date(currentDate), bookedSpots: 0 });
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return sessions;
};



//UPDATE CLASS (ADMIN)
const updateClass = async (req, res) => {
  try {
    const updatedClass = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedClass) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: "Failed to update class", details: error.message });
  }
};

//DELETE CLASS(ADMIN)
const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Workshop.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    res.status(200).json({ message: "Workshop deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete class", details: error.message });
  }
};

const getClassesForCalendar = async (req, res) => {
    try {
      const classes = await Workshop.find({ date: { $gte: new Date() } });
  
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
  
  // BOOK A SESSION (User selects a specific session)
const bookSession = async (req, res) => {
  try {
    const { workshopId, sessionId } = req.body; // Receiving the workshopId and sessionId from the client

    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    // Find the selected session
    const session = workshop.sessions.id(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if there are available spots
    if (session.bookedSpots >= workshop.maxSpots) {
      return res.status(400).json({ error: "No available spots for this session" });
    }

    // Increment the booked spots for this session
    session.bookedSpots += 1;

    // Save the workshop with updated session data
    await workshop.save();

    res.status(200).json({ success: true, message: "Booking confirmed" });
  } catch (error) {
    console.error("Error booking session:", error);
    res.status(500).json({ error: "Failed to book session", details: error.message });
  }
};



const getSessionsForCalendar = async (req, res) => {
  try {
    const workshops = await Workshop.find({
      "sessions.sessionDate": { $gte: new Date() },
    });

    const events = [];

    workshops.forEach((workshop) => {
      workshop.sessions.forEach((s) => {
        if (
          s.sessionDate >= new Date() &&  // future-only
          s.bookedSpots < workshop.maxSpots  // spots left
        ) {
          events.push({
            id: s._id,  // session id
            workshopId: workshop._id,
            title: workshop.title,
            start: s.sessionDate,
            end: new Date(
              new Date(s.sessionDate).getTime() +
                workshop.duration * 60 * 1000  // duration in mins
            ),
            availableSpots: workshop.maxSpots - s.bookedSpots,
          });
        }
      });
    });

    console.log("Fetched events:", events);  // Add log to check response
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching sessions:", err);  // Add more logging for better insight
    res.status(500).json({ error: "Failed to fetch sessions", details: err.message });
  }
};



module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassesForCalendar,
  bookSession,
  getSessionsForCalendar
};