const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    points: { type: Number, required: true },
    semester: { type: String, enum: ['A', 'B'] }
});

module.exports = mongoose.model('Course', CourseSchema);