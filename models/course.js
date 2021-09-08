const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    _id: { type: String }, // id by course name
    points: { type: Number, required: true },
    semester: { type: String, enum: ['A', 'B'] }
});

module.exports = mongoose.model('Course', CourseSchema);