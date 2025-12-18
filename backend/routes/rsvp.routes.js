const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/join", auth, async (req, res) => {
  const { eventCode } = req.body;
  const event = await Event.findOne({ eventCode });
  const user = await User.findById(req.user._id);

  if (!event) return res.status(404).json({ message: "Invalid code" });
  if (user.activeEvent)
    return res.status(400).json({ message: "Leave current event first" });
  if (event.attendees.length >= event.capacity)
    return res.status(400).json({ message: "Event full" });

  event.attendees.push(user._id);
  event.activeParticipants.push(user._id);
  event.isLive = true;

  user.activeEvent = event._id;
  user.attendedEvents.push(event._id);

  await event.save();
  await user.save();

  res.json({ message: "Joined event" });
});

router.post("/leave", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.activeEvent)
    return res.status(400).json({ message: "Not in event" });

  const event = await Event.findById(user.activeEvent);

  event.activeParticipants =
    event.activeParticipants.filter(
      (u) => u.toString() !== user._id.toString()
    );

  user.activeEvent = null;

  if (event.activeParticipants.length === 0)
    event.isLive = false;

  await event.save();
  await user.save();

  res.json({ message: "Left event" });
});

module.exports = router;
