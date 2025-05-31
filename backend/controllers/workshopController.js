const Workshop= require("../models/workshopModel");

//ALL CLASSES
const getAllClasses = async (req, res) => {
  try {
    const classes = await Workshop.find().sort({ date: 1 }); 
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

    const sessionsWithAvailability = classItem.sessions.map((session) => {
     
      return {
        sessionDate: session.sessionDate,
        bookedSpots: session.bookedSpots,
        availableSpots: classItem.maxSpots - session.bookedSpots,
        _id: session._id,
      };
    });

 

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

    const { title, instructor, description, price, duration, startDate, recurringTime, maxSpots, image } = req.body;

    if (!title || !instructor || !description || !price || !duration || !startDate || !recurringTime || !maxSpots) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (typeof price !== 'number' || typeof maxSpots !== 'number') {
      return res.status(400).json({ error: "Price and maxSpots must be numbers." });
    }
    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate)) {
      return res.status(400).json({ error: "Invalid start date format." });
    }

    const sessions = generateSessions(parsedStartDate, recurringTime);

    const newClass = new Workshop({
      title,
      image,
      instructor,
      description,
      price,
      duration,
      startDate: parsedStartDate,
      recurringTime,
      maxSpots,
      sessions, 
    });

    const savedClass = await newClass.save();

    res.status(201).json(savedClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Failed to create class", details: error.message });
  }
};

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
    const { workshopId, sessionId } = req.body; 

    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }


    const session = workshop.sessions.id(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.bookedSpots >= workshop.maxSpots) {
      return res.status(400).json({ error: "No available spots for this session" });
    }

    session.bookedSpots += 1;

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
          s.sessionDate >= new Date() &&  
          s.bookedSpots < workshop.maxSpots  
        ) {
          events.push({
            id: s._id,  
            workshopId: workshop._id,
            title: workshop.title,
            start: s.sessionDate,
            end: new Date(
              new Date(s.sessionDate).getTime() +
                workshop.duration * 60 * 1000  
            ),
            availableSpots: workshop.maxSpots - s.bookedSpots,
          });
        }
      });
    });
 
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching sessions:", err);
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