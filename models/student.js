const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    /*firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    idNumber: { type: String, required: true }*/
    _id: { type: Number, required: true },
    PHP: { type: Number, min: 0, max: 100 },
    JavaScript: { type: Number, min: 0, max: 100 },
    Java: { type: Number, min: 0, max: 100 },
    SQL: { type: Number, min: 0, max: 100 },
    Jquery: { type: Number, min: 0, max: 100 },
    DotNet: { type: Number, min: 0, max: 100 }
});

module.exports = mongoose.model('Student', StudentSchema);