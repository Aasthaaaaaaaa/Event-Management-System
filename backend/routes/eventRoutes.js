const express = require('express');
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createEvent);
router.get('/getevents', protect, getEvents);
router.put('/updateevents:id', protect, updateEvent);
router.delete('/deleteevents:id', protect, deleteEvent);

module.exports = router;
