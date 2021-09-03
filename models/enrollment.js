const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    PHP: { type: Number, min: 0, max: 100 },
    JavaScript: { type: Number, min: 0, max: 100 },
    Java: { type: Number, min: 0, max: 100 },
    SQL: { type: Number, min: 0, max: 100 },
    Jquery: { type: Number, min: 0, max: 100 },
    DotNet: { type: Number, min: 0, max: 100 }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);