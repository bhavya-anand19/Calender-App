const express = require("express");
const router = express.Router();
const Event = require("../models/Event-models");

// GET all events
router.get("/", async (req, res) => {
    console.log("📥 New event received in backend:", req.body);
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: "Error fetching events", error: err.message });
    }
});

// POST a new event
router.post("/", async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: "Error saving event", error: err.message });
    }
});

// PUT to update an event
router.put("/:id", async (req, res) => {
    try {
        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: "Error updating event", error: err.message });
    }
});

// DELETE an event
router.delete("/:id", async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting event", error: err.message });
    }
});

module.exports = router;
