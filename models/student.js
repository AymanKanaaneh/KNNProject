const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    _id: { type: String }, // id by student's id
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }

});

module.exports = mongoose.model('Student', StudentSchema);