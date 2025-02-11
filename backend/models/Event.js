const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    category: { type: String, required: true },  // ✅ Added category field
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ Make required
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Event', EventSchema);
