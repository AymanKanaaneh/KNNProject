const express = require('express');
const Courses = require('../models/course');
const Enrollments = require('../models/enrollment');
const router = express.Router();

router.get('/', async (req, res) => {
	const courses = await Courses.find();
	res.send(courses);
});

router.get('/:courseId', async (req, res) => {
	const { courseId } = req.params;
	if (!courseId) {
		return res.sendStatus(400); // bad request
	}
	const course = await Courses.findById(courseId);
	if (!course) {
		return res.sendStatus(404); // not found
	}
	res.send(course);
});

router.post('/', async (req, res) => {
	const { name, points, semester } = req.body;
	try {
		const course = await Courses.create({ name, points, semester });
		res.send(course);
	} catch (err) {
		res.sendStatus(400);
	}
});

router.delete('/:courseId', async (req, res) => {

	const { courseId } = req.params;
	if (!courseId) {
		return res.sendStatus(400); // bad request
	}
	await Courses.findByIdAndDelete(courseId);
	await Enrollments.deleteMany({ course: courseId });
	res.sendStatus(200);
});

router.put('/:courseId', async (req, res) => {
	const { courseId } = req.params;
	const updatedCourse = req.body;
	if (!courseId || !updatedCourse) {
		return res.sendStatus(400); // bad request
	}
	try {
		const course = await Courses.findByIdAndUpdate(courseId, updatedCourse, { new: true });
		res.send(course);
	} catch (err) {
		console.error(err);
		res.sendStatus(400);
	}
});

module.exports = router;