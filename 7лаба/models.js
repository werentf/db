const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const eventSchema = new mongoose.Schema({
    date_time: { type: Date, required: true },
    sport_type: { type: String, required: true },
    coach: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Командные', 'Индивидуальные', 'Групповые']
    },
    participants_count: { 
        type: Number, 
        required: true,
        min: 1 
    },
    location: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Location',
        required: true 
    }
});

const Location = mongoose.model('Location', locationSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports = { Location, Event }; 