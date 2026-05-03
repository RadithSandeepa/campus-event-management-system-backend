import Event from "../models/Event.js";

// CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      image: req.file ? req.file.path : "",
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Event created",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL EVENTS
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE EVENT
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // OWNER CHECK
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Event updated",
      updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // OWNER CHECK
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await event.deleteOne();

    res.json({
      message: "Event deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};