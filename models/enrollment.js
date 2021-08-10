const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
	student: { type: mongoose.SchemaTypes.ObjectId, ref: 'Student', required: true },
	course: { type: mongoose.SchemaTypes.ObjectId, ref: 'Course', required: true },
	grade: { type: Number, min: 0, max: 100 }
});
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
module.exports = mongoose.model('Enrollment', EnrollmentSchema);