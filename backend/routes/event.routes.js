const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/auth.middleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

/* ===== Ensure uploads folder exists ===== */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

/* ===== Generate unique Event Code ===== */
const generateEventCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

/* =====================================================
   CREATE EVENT
===================================================== */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, dateTime, location, capacity } = req.body;

    if (!title || !description || !dateTime || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let eventCode;
    while (!eventCode || (await Event.findOne({ eventCode }))) {
      eventCode = generateEventCode();
    }

    let imageUrl = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Cloudinary upload failed:", err.message);
      }
    }

    const event = await Event.create({
      title,
      description,
      dateTime: new Date(dateTime),
      location,
      capacity,
      imageUrl,
      eventCode,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Create event error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DASHBOARD (MY EVENTS)
===================================================== */
router.get("/my/dashboard", authMiddleware, async (req, res) => {
  const userId = req.user._id;

  const created = await Event.find({
    createdBy: userId,
    isDeleted: false,
  });

  const joined = await Event.find({
    attendees: userId,
    isDeleted: false,
  });

  res.json({ created, joined });
});

/* =====================================================
   ALL EVENTS
===================================================== */
router.get("/all", authMiddleware, async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

/* =====================================================
   JOIN EVENT (BY EVENT CODE)
===================================================== */
router.post("/:code/join", authMiddleware, async (req, res) => {
  const event = await Event.findOne({ eventCode: req.params.code });

  if (!event) {
    return res.status(404).json({ message: "Invalid event ID" });
  }

  if (event.isDeleted) {
    return res.status(400).json({ message: "Event was deleted" });
  }

  if (event.attendees.includes(req.user._id)) {
    return res.status(400).json({ message: "Already joined" });
  }

  if (event.attendees.length >= event.capacity) {
    return res.status(400).json({ message: "Event is full" });
  }

  event.attendees.push(req.user._id);
  await event.save();

  res.json({ message: "Joined successfully" });
});

/* =====================================================
   ENTER EVENT (30-MINUTE AUTO END)
===================================================== */
router.get("/:id/enter", authMiddleware, async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event || event.isDeleted) {
    return res.status(404).json({ message: "Event not available" });
  }

  const now = Date.now();
  const start = new Date(event.dateTime).getTime();
  const end = start + 30 * 60 * 1000; // 30 minutes

  if (now < start) {
    return res.status(400).json({ message: "Event has not started yet" });
  }

  if (now > end) {
    return res.status(400).json({
      message:
        "Event has ended. Please create a new event to continue the session.",
    });
  }

  res.json({ message: "Event live" });
});

/* =====================================================
   DELETE EVENT — OPTION B (SMART DELETE)
===================================================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event || event.isDeleted) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Only owner can delete
  if (event.createdBy.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Only owner can delete this event" });
  }

  const now = Date.now();
  const start = new Date(event.dateTime).getTime();
  const end = start + 30 * 60 * 1000; // 30 minutes

  // Block delete during live event
  if (now >= start && now <= end) {
    return res
      .status(400)
      .json({ message: "Cannot delete during live event" });
  }

  event.isDeleted = true;
  await event.save();

  res.json({ message: "Event deleted" });
});

module.exports = router;
