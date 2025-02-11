const Event = require('../models/Event')
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');


const createEvent = asyncHandler(async (req, res) => {
    const { name, description, date, category } = req.body;  // ✅ Include category

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!category) {
        return res.status(400).json({ error: "Category is required" });
    }

    const event = new Event({
        name,
        description,
        date,
        category,  // ✅ Store category
        createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
});



const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({User:req.body.id});
    res.status(200).json(events);
});



const updateEvent = asyncHandler(async (req, res) => {
    const { name, description, category } = req.body;

    let event = await Event.findById(req.params.id);
    
    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: "Access Denied! Only the creator can edit this event." });
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.category = category || event.category;  // ✅ Allow category update

    const updatedEvent = await event.save();
    res.json(updatedEvent);
});







const deleteEvent = asyncHandler(async (req, res) => {
    // Find event by ID
    let event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    // Check if `createdBy` is missing (old database issue)
    if (!event.createdBy) {
        return res.status(400).json({ error: "Event creator missing. Cannot delete event." });
    }

    // Ensure only the creator can delete
    if (event.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: "Access Denied! Only the creator can delete this event." });
    }

    // Delete the event
    await event.deleteOne();

    res.json({ message: "Event deleted successfully." });
});

module.exports = { createEvent, getEvents,  updateEvent, deleteEvent };
